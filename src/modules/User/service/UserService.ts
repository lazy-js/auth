import { UserRepository } from '../repository/UserRepo';
import { UserValidator } from '../validator/UserValidator';
import {
    CreateUserParams,
    IUserRepository,
    IUserService,
    IUserValidator,
    UserCreationDto,
    PrivateUserService,
    VerifyDto,
} from './UserService.types';

import { IKcApi, TokenResponse, AccessTokenPayload } from '../../kcApi';
import { IClient } from '../../Realm';
import { userServiceLogger } from '../../../config/loggers';
import { INotificationClientSdk } from '../../../types';
import { Schema } from 'mongoose';
import {
    AuthenticationError,
    AuthorizationError,
    BadConfigError,
    ConflictError,
    InternalError,
    NotFoundError,
    ValidationError,
} from '@lazy-js/error-guard';
import { USER_SERVICE_INTERNAL_ERRORS, USER_SERVICE_OPERATIONAL_ERRORS } from '../constants';

interface PublicRegisterReturn {
    _id: Schema.Types.ObjectId;
    username: string;
    method: string;
    verified: boolean;
    createdAt: Date;
    email?: string;
    phone?: string;
}
type RegisterReturn = PublicRegisterReturn | null;
type LoginReturn = { token: TokenResponse | null; user: PublicRegisterReturn };
/**
 * UserService is the service that handles the user registration, login, verification, and password update.
 * @requires IUserRepository
 * @requires IUserValidator
 * @requires IKcApi
 * @requires IClient
 * @requires INotificationClientSdk
 */

export class UserService implements IUserService, PrivateUserService {
    public userRepository: IUserRepository;
    public userValidator: IUserValidator;
    public kcApi: IKcApi;
    public client: IClient;
    public notificationClientSdk: INotificationClientSdk;

    constructor(client: IClient, kcApi: IKcApi, notificationClientSdk: INotificationClientSdk) {
        this.userRepository = new UserRepository();
        this.userValidator = new UserValidator();
        this.client = client;
        this.kcApi = kcApi;
        this.notificationClientSdk = notificationClientSdk;
    }

    async register(createUserParams: CreateUserParams): Promise<RegisterReturn> {
        const { status } = this.client.clientAuthConfiguration.registerConfig;

        if (status === 'public') {
            return await this._publicRegister(createUserParams);
        }
        if (status === 'private') {
            return await this._privateRegister(createUserParams);
        }
        // disabled

        return null;
    }

    async login(loginParams: CreateUserParams): Promise<LoginReturn> {
        const { body } = loginParams;
        const { primaryFields } = this.client.clientAuthConfiguration;

        const loginDto = await this.userValidator.validateLoginDto(body, primaryFields);

        const userInDb = await this._getUser(loginDto);
        if (!userInDb) throw this.throwInvalidCredentialsError();

        let verified = loginDto.method === 'username';
        if (loginDto.method === 'email') {
            const linkedEmail = userInDb.linkedEmails.find((linkedEmail) => linkedEmail.email === loginDto.email);
            if (!linkedEmail) throw this.throwInvalidCredentialsError();
            verified = linkedEmail.verified;
        }
        if (loginDto.method === 'phone') {
            const linkedPhone = userInDb.linkedPhones.find((linkedPhone) => linkedPhone.phone === loginDto.phone);
            if (!linkedPhone) throw this.throwInvalidCredentialsError();
            verified = linkedPhone.verified;
        }

        let tokenResponse = null;
        if (verified)
            tokenResponse = await this.kcApi.users.loginWithUsername({
                username: userInDb.username,
                password: loginDto.password,
                clientId: this.client.clientId,
            });

        const user = {
            _id: userInDb._id,
            username: userInDb.username,
            method: loginDto.method,
            [loginDto.method]: loginDto[loginDto.method as keyof typeof loginDto],
            verified: verified,
            createdAt: userInDb.createdAt,
        };
        return { token: tokenResponse, user: user };
    }

    throwInvalidCredentialsError(): never {
        throw new AuthenticationError(USER_SERVICE_OPERATIONAL_ERRORS.INVALID_CREDENTIALS).updateContext({
            layer: 'SERVICE',
            methodName: 'login',
        });
    }

    async verify(verifyDto: VerifyDto): Promise<void> {
        // validate the dto
        const validatedVerifyDto = await this.userValidator.validateVerifyDto(verifyDto);

        // verify the email
        if (validatedVerifyDto.method === 'email') {
            // get the user from the database
            const userInDb = await this.userRepository.getUserByEmail(validatedVerifyDto.email);

            // check if the user exists
            if (!userInDb) {
                throw new NotFoundError(USER_SERVICE_OPERATIONAL_ERRORS.USER_NOT_FOUND);
            }

            // check if the email is linked to the user
            const linkedEmail = userInDb.linkedEmails.find(
                (linkedEmail) => linkedEmail.email === validatedVerifyDto.email,
            );

            if (!linkedEmail) {
                throw new NotFoundError(USER_SERVICE_OPERATIONAL_ERRORS.USER_NOT_FOUND);
            }

            // check if the email is already verified
            if (linkedEmail.verified) {
                throw new ConflictError(USER_SERVICE_OPERATIONAL_ERRORS.EMAIL_ALREADY_VERIFIED);
            }

            // check if the code is expired
            const _5Minutes = 5 * 60 * 1000;

            if (userInDb.updatedAt && userInDb.updatedAt.getTime() + _5Minutes < Date.now()) {
                throw new ValidationError(USER_SERVICE_OPERATIONAL_ERRORS.CODE_EXPIRED);
            }

            // check if the code is correct
            if (linkedEmail.confirmCode !== validatedVerifyDto.code) {
                throw new ValidationError(USER_SERVICE_OPERATIONAL_ERRORS.INVALID_CODE);
            }

            // update the user
            await this.userRepository.verifyUserEmail(validatedVerifyDto.email);
            return;
        }
        if (validatedVerifyDto.method === 'phone') {
            const userInDb = await this.userRepository.getUserByPhone(validatedVerifyDto.phone);
        }
    }

    async updatePassword(accessToken: string, newPassword: string): Promise<void> {
        const payload = await this.validateRole(accessToken, 'update-own-password');

        const validatedPassword = await this.userValidator.validatePassword(newPassword as string);

        await this.kcApi.users.setUserPassword({
            userId: payload.sub as string,
            password: validatedPassword,
        });
    }

    async validateAccessToken<T extends string>(
        accessToken?: string,
    ): Promise<AccessTokenPayload<T> & { _id: string }> {
        const validatedAccessToken = await this.userValidator.validateTokenString(accessToken as string, 'access');
        const { payload } = await this.kcApi.users.validateAccessToken(validatedAccessToken);

        if (!payload.sub)
            throw new InternalError(USER_SERVICE_INTERNAL_ERRORS.SUB_NOT_DEFINED).updateContext({
                layer: 'SERVICE',
                methodName: 'validateAccessToken',
                className: 'UserService',
                payload: payload,
            });

        // sub in payload is the id of user in keyloak
        const userInLocalDb = await this.userRepository.getUserByKeycloakId(payload.sub);

        if (!userInLocalDb) {
            throw new InternalError(USER_SERVICE_INTERNAL_ERRORS.USER_NOT_FOUND_IN_LOCAL_DB).updateContext({
                layer: 'SERVICE',
                methodName: 'validateAccessToken',
                className: 'UserService',
                payload: payload,
            });
        }

        return { ...payload, _id: userInLocalDb._id as unknown as string };
    }

    async refreshToken(refreshToken: string): Promise<TokenResponse> {
        const validatedRefreshToken = await this.userValidator.validateTokenString(refreshToken as string, 'refresh');
        const tokenResponse = await this.kcApi.users.refreshAccessToken({
            refreshToken: validatedRefreshToken,
            clientId: this.client.clientId,
        });

        return tokenResponse;
    }

    async validateRole(accessToken: string, role: string | string[]) {
        const payload = await this.validateAccessToken(accessToken);

        // azp is the client id which token issued with
        const payloadClientId = payload.azp;

        if (!payloadClientId || payloadClientId !== this.client.clientId) {
            throw new AuthorizationError(USER_SERVICE_OPERATIONAL_ERRORS.UNAUTHORIZED);
        }

        const payloadResouceAccess = payload.resource_access;
        if (
            !payloadResouceAccess ||
            !payloadResouceAccess[payloadClientId] ||
            !payloadResouceAccess[payloadClientId].roles
        ) {
            throw new ValidationError(USER_SERVICE_OPERATIONAL_ERRORS.INVALID_ACCESS_TOKEN);
        }

        const roles = payloadResouceAccess[payloadClientId].roles;

        const canAccess = Array.isArray(role) ? role.some((r) => roles.includes(r)) : roles.includes(role);

        if (!canAccess) {
            throw new AuthorizationError(USER_SERVICE_OPERATIONAL_ERRORS.UNAUTHORIZED);
        }

        return payload;
    }

    async _getUser(user: UserCreationDto) {
        let userInDb;
        if (user.method === 'email') {
            userInDb = await this.userRepository.getUserByEmail(user.email as string);
        } else if (user.method === 'phone') {
            userInDb = await this.userRepository.getUserByPhone(user.phone as string);
        } else if (user.method === 'username') {
            userInDb = await this.userRepository.getUserByUsername(user.username as string);
        }
        if (userInDb) {
            const userInKc = await this.kcApi.users.getUserById(userInDb.keycloakUserId);
            if (!userInKc) {
                throw new InternalError(USER_SERVICE_INTERNAL_ERRORS.USER_NOT_FOUND_IN_LOCAL_DB).updateContext({
                    layer: 'SERVICE',
                    methodName: '_getUser',
                    className: 'UserService',
                    user: userInDb,
                });
            }
            return userInDb;
        }

        return null;
    }

    async _getClientDefaultGroupId() {
        const defaultGroup = this.client.groups.find((group) => group.isDefault);

        if (!defaultGroup) {
            throw new BadConfigError(USER_SERVICE_INTERNAL_ERRORS.NO_DEFAULT_GROUP_CONFIGURED);
        }

        const deafaltGroupPath = `${this.client.appPath}/${this.client.name}/${defaultGroup.name}`;
        return await this._getGroupIdByPath(deafaltGroupPath);
    }

    async _getGroupIdByPath(path: string) {
        const group = await this.kcApi.groups.getGroupByPath(path);
        if (!group) {
            throw new InternalError(USER_SERVICE_INTERNAL_ERRORS.NO_GROUP_WITH_THAT_PATH);
        }
        return group.id as string;
    }

    async _registerUserInKeycloak(userDto: UserCreationDto, groupId?: string) {
        let keycloakUserId: string | undefined;
        try {
            const { username, firstName, lastName, password } = userDto;
            const verified =
                (this.client.clientAuthConfiguration.registerConfig.status === 'public' &&
                    this.client.clientAuthConfiguration.registerConfig.verified) ||
                userDto.method === 'username';
            const { id } = await this.kcApi.users.createUser({
                username: username as string,
                firstName: firstName,
                lastName: lastName,
                verified: verified,
            });
            keycloakUserId = id;

            // set password
            await this.kcApi.users.setUserPassword({
                userId: keycloakUserId,
                password: password,
            });
            // remove default realm roles
            await this.kcApi.users.removeDefaultRealmRolesFromUser(keycloakUserId);

            // add user to default group
            const defaultGroupId = groupId || (await this._getClientDefaultGroupId());

            // add user to default group
            await this.kcApi.users.addUserToGroup({
                userId: keycloakUserId,
                groupId: defaultGroupId,
            });

            return keycloakUserId;
        } catch (error) {
            if (keycloakUserId) {
                await this.kcApi.users.deleteUser(keycloakUserId);
            }
            throw error;
        }
    }

    async registerDefaultUser(
        createUserParams: CreateUserParams & {
            group: { name: string; clientPath: string; isDefault: boolean };
        },
    ) {
        const { body, group } = createUserParams;
        const { primaryFields } = this.client.clientAuthConfiguration;

        const userDto = await this.userValidator.validateUserCreationDto(body, primaryFields);

        // generate username
        const username = this._generateUsername(userDto);

        const groupPath = `${this.client.appPath}/${this.client.name}/${group.name}`;
        const groupId = await this._getGroupIdByPath(groupPath);
        // create user in keycloak db
        const keycloakUserId = await this._registerUserInKeycloak(
            {
                ...userDto,
                username: username,
            },
            groupId,
        );

        // create user in local db
        const confirmCode = this._generateConfirmCode();
        const userInDb = await this.userRepository.createUser({
            ...userDto,
            username: username,
            keycloakUserId: keycloakUserId,
            verified: true,
            app: this.client.appName,
            client: this.client.name,
            confirmCode: confirmCode,
        });
        return userInDb;
    }

    async _publicRegister(createUserParams: CreateUserParams) {
        const { body } = createUserParams;
        const { primaryFields } = this.client.clientAuthConfiguration;
        const verifiedByDefault =
            this.client.clientAuthConfiguration.registerConfig.status === 'public' &&
            this.client.clientAuthConfiguration.registerConfig.verified;

        const userDto = await this.userValidator.validateUserCreationDto(body, primaryFields);

        const doesUserExists = await this._getUser(userDto);
        if (doesUserExists) {
            throw new ConflictError(USER_SERVICE_OPERATIONAL_ERRORS.USER_ALREADY_EXISTS);
        }

        // generate username
        const username = this._generateUsername(userDto);
        const _verifiedByDefault = verifiedByDefault || userDto.method === 'username';

        // create user in keycloak db
        const keycloakUserId = await this._registerUserInKeycloak({
            ...userDto,
            username: username,
        });

        // create user in local db
        const confirmCode = this._generateConfirmCode();
        const userInDb = await this.userRepository.createUser({
            ...userDto,
            username: username,
            keycloakUserId: keycloakUserId,
            verified: _verifiedByDefault,
            app: this.client.appName,
            client: this.client.name,
            confirmCode: confirmCode,
        });

        if (!_verifiedByDefault) {
            await this._sendVerificationCode(userDto, confirmCode);
        }
        return {
            _id: userInDb._id,
            username: username,
            method: userDto.method,
            [userDto.method]: userDto[userDto.method as keyof typeof userDto],
            verified: _verifiedByDefault,
            createdAt: userInDb.createdAt,
        };
    }

    async _privateRegister(createUserParams: CreateUserParams) {
        const { status } = this.client.clientAuthConfiguration.registerConfig;
        if (status !== 'private') {
            throw new BadConfigError(USER_SERVICE_INTERNAL_ERRORS.SHOULD_CALLED_IN_PRIVATE_REGISTER);
        }
        const { accessToken } = createUserParams;
        if (!accessToken) {
            throw new AuthenticationError(USER_SERVICE_OPERATIONAL_ERRORS.UNAUTHORIZED);
        }

        const { privateAccessRoles } = this.client.clientAuthConfiguration.registerConfig;

        await this.validateRole(
            accessToken,
            privateAccessRoles.map((role) => role.name),
        );

        return await this._publicRegister(createUserParams);
    }

    _generateUsername(userDto: UserCreationDto) {
        let username = '';
        if (userDto.method === 'username') {
            username = userDto.username as string;
        } else if (userDto.method === 'email') {
            username = ((userDto.email as string).split('@')[0] +
                '_' +
                (userDto.email as string).split('@')[1]) as string;
        } else if (userDto.method === 'phone') {
            username = (userDto.phone as string).split(' ')[0] as string;
        }

        return username;
    }

    _generateConfirmCode() {
        return Math.random().toString(36).substring(2, 8);
    }

    async _sendVerificationCode(userDto: UserCreationDto, confirmCode: string) {
        if (!(await this.notificationClientSdk.available())) {
            userServiceLogger.warn('Notification service is not available');
        } else {
            if (userDto.method === 'email') {
                await this.notificationClientSdk.sendEmail({
                    method: 'email',
                    receiver: userDto.email as string,
                    subject: 'Verify your email',
                    content: `Please verify your email by clicking the link ${confirmCode}`,
                });
            }
        }
    }
}
