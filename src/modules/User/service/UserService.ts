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
import { IKcApi, TokenResponse } from '../../kcApi';
import { IClient } from '../../Realm';
import errors from '../../../config/errors';
import { AppError } from '@lazy-js/utils';
import { userServiceLogger } from '../../../config/loggers';
import { errors as joseErrors } from 'jose';
import { IUserSchema } from '../model/UserModel.types';
import { INotificationClientSdk } from '../../../types';

export class UserService implements IUserService, PrivateUserService {
  public userRepository: IUserRepository;
  public userValidator: IUserValidator;
  public kcApi: IKcApi;
  public client: IClient;
  public notificationClientSdk: INotificationClientSdk;

  constructor(
    client: IClient,
    kcApi: IKcApi,
    notificationClientSdk: INotificationClientSdk,
  ) {
    this.userRepository = new UserRepository();
    this.userValidator = new UserValidator();
    this.client = client;
    this.kcApi = kcApi;
    this.notificationClientSdk = notificationClientSdk;
  }

  async register(
    createUserParams: CreateUserParams,
  ): Promise<IUserSchema | null | { mustVerify: boolean }> {
    const { registerStatus } = this.client.clientAuthConfiguration;

    if (registerStatus === 'public') {
      return await this._publicRegister(createUserParams);
    } else if (registerStatus === 'private') {
      return await this._privateRegister(createUserParams);
    } else if (registerStatus === 'disabled') {
      return null;
    }
    return null;
  }

  async login(
    loginParams: CreateUserParams,
  ): Promise<
    { token: TokenResponse; user: IUserSchema } | { mustVerify: boolean }
  > {
    const { body } = loginParams;
    const { primaryField } = this.client.clientAuthConfiguration;

    const loginDto = await this.userValidator.validateLoginDto(
      body,
      primaryField,
    );

    const userInDb = await this._getUser(loginDto);
    if (!userInDb) this.throwInvalidCredentialsError(loginDto.method);

    try {
      const tokenResponse = await this.kcApi.users.loginWithUsername({
        username: userInDb.username,
        password: loginDto.password,
        clientId: this.client.clientId,
      });

      if (loginDto.method === 'email') {
        const linkedEmail = userInDb.linkedEmails.find(
          (linkedEmail) => linkedEmail.email === loginDto.email,
        );
        if (!linkedEmail) this.throwInvalidCredentialsError(loginDto.method);
        if (!linkedEmail.verified) {
          return { mustVerify: true };
        }
      }
      return { token: tokenResponse, user: userInDb };
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('invalid_grant')) {
        this.throwInvalidCredentialsError(loginDto.method);
      }
      throw error;
    }
  }

  throwInvalidCredentialsError(method: string): never {
    if (method === 'email') {
      throw new AppError(errors.INVALID_EMAIL_OR_PASSWORD);
    } else if (method === 'phone') {
      throw new AppError(errors.INVALID_PHONE_OR_PASSWORD);
    } else {
      throw new AppError(errors.INVALID_USERNAME_OR_PASSWORD);
    }
  }

  async verify(verifyDto: VerifyDto) {
    // validate the dto
    const validatedVerifyDto = await this.userValidator.validateVerifyDto(
      verifyDto,
    );

    // verify the email
    if (validatedVerifyDto.method === 'email') {
      // get the user from the database
      const userInDb = await this.userRepository.getUserByEmail(
        validatedVerifyDto.email,
      );

      // check if the user exists
      if (!userInDb) {
        throw new AppError(errors.USER_NOT_FOUND);
      }

      // check if the email is linked to the user
      const linkedEmail = userInDb.linkedEmails.find(
        (linkedEmail) => linkedEmail.email === validatedVerifyDto.email,
      );

      if (!linkedEmail) {
        throw new AppError(errors.USER_NOT_FOUND);
      }

      // check if the email is already verified
      if (linkedEmail.verified) {
        throw new AppError(errors.EMAIL_ALREADY_VERIFIED);
      }

      // check if the code is expired
      const _5Minutes = 5 * 60 * 1000;

      if (
        userInDb.updatedAt &&
        userInDb.updatedAt.getTime() + _5Minutes < Date.now()
      ) {
        throw new AppError(errors.CODE_EXPIRED);
      }

      // check if the code is correct
      if (linkedEmail.confirmCode !== validatedVerifyDto.code) {
        throw new AppError(errors.INVALID_CODE);
      }

      // update the user
      await this.userRepository.verifyUserEmail(validatedVerifyDto.email);
      return true;
    } else if (validatedVerifyDto.method === 'phone') {
      const userInDb = await this.userRepository.getUserByPhone(
        validatedVerifyDto.phone,
      );
    }
  }

  async updatePassword(accessToken: string, newPassword: string) {
    const payload = await this.validateRole(accessToken, 'update-own-password');

    const validatedPassword = await this.userValidator.validatePassword(
      newPassword as string,
    );

    const tokenResponse = await this.kcApi.users.setUserPassword({
      userId: payload.sub as string,
      password: validatedPassword,
    });

    return tokenResponse;
  }

  async validateAccessToken(accessToken?: string) {
    try {
      if (
        !accessToken ||
        accessToken === '' ||
        accessToken === 'undefined' ||
        !accessToken.startsWith('Bearer ') ||
        accessToken.split(' ')[1] === ''
      ) {
        throw new AppError(errors.INVALID_ACCESS_TOKEN);
      }
      const { payload } = await this.kcApi.users.validateAccessToken(
        accessToken.split(' ')[1],
      );
      if (!payload.sub) throw new Error('User Id (sub) is undefined');
      // sub in payload is the id of user in keyloak
      const userInLocalDb = (await this.userRepository.getUserByKeycloakId(
        payload.sub,
      )) as unknown as { _id: string };
      if (!userInLocalDb) {
        throw new AppError({
          code: 'ErrorInValidteAccessToken',
          label: 'no user with keycload user id',
        });
      }

      return { ...payload, _id: userInLocalDb._id } as typeof payload & {
        _id: string;
      };
    } catch (error: unknown) {
      if (error instanceof joseErrors.JWTExpired) {
        throw new AppError(errors.EXPIRED_ACCESS_TOKEN);
      } else if (
        error instanceof joseErrors.JWTInvalid ||
        error instanceof joseErrors.JWSSignatureVerificationFailed
      ) {
        throw new AppError(errors.INVALID_ACCESS_TOKEN);
      } else {
        throw new AppError(errors.INVALID_ACCESS_TOKEN);
      }
    }
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken || refreshToken === '' || refreshToken === 'undefined') {
      throw new AppError(errors.INVALID_REFRESH_TOKEN);
    }
    const tokenResponse = await this.kcApi.users.refreshAccessToken({
      refreshToken: refreshToken,
      clientId: this.client.clientId,
    });
    return tokenResponse;
  }

  async validateRole(accessToken: string, role: string | string[]) {
    const payload = await this.validateAccessToken(accessToken);
    // azp is the client name which token issued with

    if (
      !payload ||
      !payload.resource_access ||
      !payload.azp ||
      !payload.resource_access[payload.azp] ||
      payload.azp !== this.client.clientId ||
      !payload.resource_access[payload.azp].roles ||
      !Array.isArray(payload.resource_access[payload.azp].roles)
    ) {
      throw new AppError(errors.INVALID_ACCESS_TOKEN);
    }
    const roles = payload.resource_access[payload.azp].roles;
    if (!roles) throw new AppError(errors.UNAUTHORIZED);
    const canAccess = Array.isArray(role)
      ? role.some((r) => roles.includes(r))
      : roles.includes(role);
    userServiceLogger.info(`User has role ${role}: ${canAccess}`);
    if (!canAccess) {
      throw new AppError(errors.UNAUTHORIZED);
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
      userInDb = await this.userRepository.getUserByUsername(
        user.username as string,
      );
    }
    if (userInDb) {
      const userInKc = await this.kcApi.users.getUserById(
        userInDb.keycloakUserId,
      );
      if (!userInKc) {
        userServiceLogger.error(
          `User ${user.method} ${
            user.email || user.phone || user.username
          } not found in Keycloak`,
        );
      }
      return userInDb;
    }

    return null;
  }

  async _getClientDefaultGroupId() {
    const defaultGroup = this.client.groups.find((group) => group.isDefault);

    if (!defaultGroup) throw new Error(errors.MULTIPLE_DEFAULT_GROUPS.code);
    const deafaltGroupPath = `${this.client.appPath}/${this.client.name}/${defaultGroup.name}`;
    return await this._getGroupIdByPath(deafaltGroupPath);
  }

  async _getGroupIdByPath(path: string) {
    const group = await this.kcApi.groups.getGroupByPath(path);
    if (!group) throw new Error(errors.NO_GROUP_WITH_THAT_NAME.code);
    return group.id as string;
  }

  async _registerUserInKeycloak(userDto: UserCreationDto, groupId?: string) {
    let keycloakUserId: string | undefined;
    try {
      const { username, firstName, lastName, password } = userDto;
      const verified =
        this.client.clientAuthConfiguration.verifiedByDefault ||
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
    const { primaryField } = this.client.clientAuthConfiguration;

    const userDto = await this.userValidator.validateUserCreationDto(
      body,
      primaryField,
    );

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
    userServiceLogger.info(`User ${username} created in local db`);
    return userInDb;
  }

  async _publicRegister(createUserParams: CreateUserParams) {
    const { body } = createUserParams;
    const { verifiedByDefault, primaryField } =
      this.client.clientAuthConfiguration;

    const userDto = await this.userValidator.validateUserCreationDto(
      body,
      primaryField,
    );
    const userInDb = await this._getUser(userDto);

    if (userInDb) {
      throw new AppError(errors.USER_ALREADY_EXISTS);
    } else {
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

      if (verified) return userInDb;
      else {
        if (await this.notificationClientSdk.available()) {
          if (userDto.method === 'email') {
            await this.notificationClientSdk.sendEmail({
              method: 'email',
              receiver: userDto.email as string,
              subject: 'Verify your email',
              content: `Please verify your email by clicking the link ${confirmCode}`,
            });
          }
        } else {
          userServiceLogger.warn('Notification service is not available');
          userServiceLogger.warn('Confirm code is: ' + confirmCode);
        }
        return { mustVerify: true };
      }
    }
  }

  async _privateRegister(createUserParams: CreateUserParams) {
    const { accessToken } = createUserParams;
    if (!accessToken) throw new Error(errors.UNAUTHORIZED.code);
    const { privateRegisterAccessRoles } = this.client.clientAuthConfiguration;

    await this.validateRole(
      accessToken,
      privateRegisterAccessRoles.map((role) => role.name),
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
}
