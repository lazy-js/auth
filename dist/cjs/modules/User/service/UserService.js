"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepo_1 = require("../repository/UserRepo");
const UserValidator_1 = require("../validator/UserValidator");
const errors_1 = __importDefault(require("../../../config/errors"));
const utils_1 = require("@lazy-js/utils");
const loggers_1 = require("../../../config/loggers");
const jose_1 = require("jose");
class UserService {
    constructor(client, kcApi, notificationClientSdk) {
        this.userRepository = new UserRepo_1.UserRepository();
        this.userValidator = new UserValidator_1.UserValidator();
        this.client = client;
        this.kcApi = kcApi;
        this.notificationClientSdk = notificationClientSdk;
    }
    async register(createUserParams) {
        const { registerStatus } = this.client.clientAuthConfiguration;
        if (registerStatus === 'public') {
            return await this._publicRegister(createUserParams);
        }
        else if (registerStatus === 'private') {
            return await this._privateRegister(createUserParams);
        }
        else if (registerStatus === 'disabled') {
            return null;
        }
        return null;
    }
    async login(loginParams) {
        const { body } = loginParams;
        const { primaryField } = this.client.clientAuthConfiguration;
        const loginDto = await this.userValidator.validateLoginDto(body, primaryField);
        const userInDb = await this._getUser(loginDto);
        if (!userInDb)
            this.throwInvalidCredentialsError(loginDto.method);
        try {
            const tokenResponse = await this.kcApi.users.loginWithUsername({
                username: userInDb.username,
                password: loginDto.password,
                clientId: this.client.clientId,
            });
            if (loginDto.method === 'email') {
                const linkedEmail = userInDb.linkedEmails.find((linkedEmail) => linkedEmail.email === loginDto.email);
                if (!linkedEmail)
                    this.throwInvalidCredentialsError(loginDto.method);
                if (!linkedEmail.verified) {
                    return { mustVerify: true };
                }
            }
            return { token: tokenResponse, user: userInDb };
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('invalid_grant')) {
                this.throwInvalidCredentialsError(loginDto.method);
            }
            throw error;
        }
    }
    throwInvalidCredentialsError(method) {
        if (method === 'email') {
            throw new utils_1.AppError(errors_1.default.INVALID_EMAIL_OR_PASSWORD);
        }
        else if (method === 'phone') {
            throw new utils_1.AppError(errors_1.default.INVALID_PHONE_OR_PASSWORD);
        }
        else {
            throw new utils_1.AppError(errors_1.default.INVALID_USERNAME_OR_PASSWORD);
        }
    }
    async verify(verifyDto) {
        // validate the dto
        const validatedVerifyDto = await this.userValidator.validateVerifyDto(verifyDto);
        // verify the email
        if (validatedVerifyDto.method === 'email') {
            // get the user from the database
            const userInDb = await this.userRepository.getUserByEmail(validatedVerifyDto.email);
            // check if the user exists
            if (!userInDb) {
                throw new utils_1.AppError(errors_1.default.USER_NOT_FOUND);
            }
            // check if the email is linked to the user
            const linkedEmail = userInDb.linkedEmails.find((linkedEmail) => linkedEmail.email === validatedVerifyDto.email);
            if (!linkedEmail) {
                throw new utils_1.AppError(errors_1.default.USER_NOT_FOUND);
            }
            // check if the email is already verified
            if (linkedEmail.verified) {
                throw new utils_1.AppError(errors_1.default.EMAIL_ALREADY_VERIFIED);
            }
            // check if the code is expired
            const _5Minutes = 5 * 60 * 1000;
            if (userInDb.updatedAt &&
                userInDb.updatedAt.getTime() + _5Minutes < Date.now()) {
                throw new utils_1.AppError(errors_1.default.CODE_EXPIRED);
            }
            // check if the code is correct
            if (linkedEmail.confirmCode !== validatedVerifyDto.code) {
                throw new utils_1.AppError(errors_1.default.INVALID_CODE);
            }
            // update the user
            await this.userRepository.verifyUserEmail(validatedVerifyDto.email);
            return true;
        }
        else if (validatedVerifyDto.method === 'phone') {
            const userInDb = await this.userRepository.getUserByPhone(validatedVerifyDto.phone);
        }
    }
    async updatePassword(accessToken, newPassword) {
        const payload = await this.validateRole(accessToken, 'update-own-password');
        const validatedPassword = await this.userValidator.validatePassword(newPassword);
        const tokenResponse = await this.kcApi.users.setUserPassword({
            userId: payload.sub,
            password: validatedPassword,
        });
        return tokenResponse;
    }
    async validateAccessToken(accessToken) {
        try {
            if (!accessToken ||
                accessToken === '' ||
                accessToken === 'undefined' ||
                !accessToken.startsWith('Bearer ') ||
                accessToken.split(' ')[1] === '') {
                throw new utils_1.AppError(errors_1.default.INVALID_ACCESS_TOKEN);
            }
            const { payload } = await this.kcApi.users.validateAccessToken(accessToken.split(' ')[1]);
            if (!payload.sub)
                throw new Error('User Id (sub) is undefined');
            // sub in payload is the id of user in keyloak
            const userInLocalDb = (await this.userRepository.getUserByKeycloakId(payload.sub));
            if (!userInLocalDb) {
                throw new utils_1.AppError({
                    code: 'ErrorInValidteAccessToken',
                    label: 'no user with keycload user id',
                });
            }
            return { ...payload, _id: userInLocalDb._id };
        }
        catch (error) {
            if (error instanceof jose_1.errors.JWTExpired) {
                throw new utils_1.AppError(errors_1.default.EXPIRED_ACCESS_TOKEN);
            }
            else if (error instanceof jose_1.errors.JWTInvalid ||
                error instanceof jose_1.errors.JWSSignatureVerificationFailed) {
                throw new utils_1.AppError(errors_1.default.INVALID_ACCESS_TOKEN);
            }
            else {
                throw new utils_1.AppError(errors_1.default.INVALID_ACCESS_TOKEN);
            }
        }
    }
    async refreshToken(refreshToken) {
        if (!refreshToken || refreshToken === '' || refreshToken === 'undefined') {
            throw new utils_1.AppError(errors_1.default.INVALID_REFRESH_TOKEN);
        }
        const tokenResponse = await this.kcApi.users.refreshAccessToken({
            refreshToken: refreshToken,
            clientId: this.client.clientId,
        });
        return tokenResponse;
    }
    async validateRole(accessToken, role) {
        const payload = await this.validateAccessToken(accessToken);
        // azp is the client name which token issued with
        if (!payload ||
            !payload.resource_access ||
            !payload.azp ||
            !payload.resource_access[payload.azp] ||
            payload.azp !== this.client.clientId ||
            !payload.resource_access[payload.azp].roles ||
            !Array.isArray(payload.resource_access[payload.azp].roles)) {
            throw new utils_1.AppError(errors_1.default.INVALID_ACCESS_TOKEN);
        }
        const roles = payload.resource_access[payload.azp].roles;
        if (!roles)
            throw new utils_1.AppError(errors_1.default.UNAUTHORIZED);
        const canAccess = Array.isArray(role)
            ? role.some((r) => roles.includes(r))
            : roles.includes(role);
        loggers_1.userServiceLogger.info(`User has role ${role}: ${canAccess}`);
        if (!canAccess) {
            throw new utils_1.AppError(errors_1.default.UNAUTHORIZED);
        }
        return payload;
    }
    async _getUser(user) {
        let userInDb;
        if (user.method === 'email') {
            userInDb = await this.userRepository.getUserByEmail(user.email);
        }
        else if (user.method === 'phone') {
            userInDb = await this.userRepository.getUserByPhone(user.phone);
        }
        else if (user.method === 'username') {
            userInDb = await this.userRepository.getUserByUsername(user.username);
        }
        if (userInDb) {
            const userInKc = await this.kcApi.users.getUserById(userInDb.keycloakUserId);
            if (!userInKc) {
                loggers_1.userServiceLogger.error(`User ${user.method} ${user.email || user.phone || user.username} not found in Keycloak`);
            }
            return userInDb;
        }
        return null;
    }
    async _getClientDefaultGroupId() {
        const defaultGroup = this.client.groups.find((group) => group.isDefault);
        if (!defaultGroup)
            throw new Error(errors_1.default.MULTIPLE_DEFAULT_GROUPS.code);
        const deafaltGroupPath = `${this.client.appPath}/${this.client.name}/${defaultGroup.name}`;
        return await this._getGroupIdByPath(deafaltGroupPath);
    }
    async _getGroupIdByPath(path) {
        const group = await this.kcApi.groups.getGroupByPath(path);
        if (!group)
            throw new Error(errors_1.default.NO_GROUP_WITH_THAT_NAME.code);
        return group.id;
    }
    async _registerUserInKeycloak(userDto, groupId) {
        let keycloakUserId;
        try {
            const { username, firstName, lastName, password } = userDto;
            const verified = this.client.clientAuthConfiguration.verifiedByDefault ||
                userDto.method === 'username';
            const { id } = await this.kcApi.users.createUser({
                username: username,
                firstName: firstName,
                lastName: lastName,
                enabled: true,
                emailVerified: verified,
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
        }
        catch (error) {
            if (keycloakUserId) {
                await this.kcApi.users.deleteUser(keycloakUserId);
            }
            throw error;
        }
    }
    async registerDefaultUser(createUserParams) {
        const { body, group } = createUserParams;
        const { primaryField } = this.client.clientAuthConfiguration;
        const userDto = await this.userValidator.validateUserCreationDto(body, primaryField);
        // generate username
        const username = this._generateUsername(userDto);
        const groupPath = `${this.client.appPath}/${this.client.name}/${group.name}`;
        const groupId = await this._getGroupIdByPath(groupPath);
        // create user in keycloak db
        const keycloakUserId = await this._registerUserInKeycloak({
            ...userDto,
            username: username,
        }, groupId);
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
        loggers_1.userServiceLogger.info(`User ${username} created in local db`);
        return userInDb;
    }
    async _publicRegister(createUserParams) {
        const { body } = createUserParams;
        const { verifiedByDefault, primaryField } = this.client.clientAuthConfiguration;
        const userDto = await this.userValidator.validateUserCreationDto(body, primaryField);
        const userInDb = await this._getUser(userDto);
        if (userInDb) {
            throw new utils_1.AppError(errors_1.default.USER_ALREADY_EXISTS);
        }
        else {
            // generate username
            const username = this._generateUsername(userDto);
            const verified = verifiedByDefault || userDto.method === 'username';
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
                verified: verified,
                app: this.client.appName,
                client: this.client.name,
                confirmCode: confirmCode,
            });
            if (verified)
                return userInDb;
            else {
                if (await this.notificationClientSdk.available()) {
                    if (userDto.method === 'email') {
                        await this.notificationClientSdk.sendEmail({
                            method: 'email',
                            receiver: userDto.email,
                            subject: 'Verify your email',
                            content: `Please verify your email by clicking the link ${confirmCode}`,
                        });
                    }
                }
                else {
                    loggers_1.userServiceLogger.warn('Notification service is not available');
                    loggers_1.userServiceLogger.warn('Confirm code is: ' + confirmCode);
                }
                return { mustVerify: true };
            }
        }
    }
    async _privateRegister(createUserParams) {
        const { accessToken } = createUserParams;
        if (!accessToken)
            throw new Error(errors_1.default.UNAUTHORIZED.code);
        const { privateRegisterAccessRoles } = this.client.clientAuthConfiguration;
        await this.validateRole(accessToken, privateRegisterAccessRoles.map((role) => role.name));
        return await this._publicRegister(createUserParams);
    }
    _generateUsername(userDto) {
        let username = '';
        if (userDto.method === 'username') {
            username = userDto.username;
        }
        else if (userDto.method === 'email') {
            username = (userDto.email.split('@')[0] +
                '_' +
                userDto.email.split('@')[1]);
        }
        else if (userDto.method === 'phone') {
            username = userDto.phone.split(' ')[0];
        }
        return username;
    }
    _generateConfirmCode() {
        return Math.random().toString(36).substring(2, 8);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map