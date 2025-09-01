import { CreateUserParams, IUserRepository, IUserService, IUserValidator, UserCreationDto, PrivateUserService, VerifyDto } from './UserService.types';
import { IKcApi, TokenResponse } from '../../kcApi';
import { IClient } from '../../Realm';
import { IUserSchema } from '../model/UserModel.types';
import { INotificationClientSdk } from '../../../types';
export declare class UserService implements IUserService, PrivateUserService {
    userRepository: IUserRepository;
    userValidator: IUserValidator;
    kcApi: IKcApi;
    client: IClient;
    notificationClientSdk: INotificationClientSdk;
    constructor(client: IClient, kcApi: IKcApi, notificationClientSdk: INotificationClientSdk);
    register(createUserParams: CreateUserParams): Promise<IUserSchema | null | {
        mustVerify: boolean;
    }>;
    login(loginParams: CreateUserParams): Promise<{
        token: TokenResponse;
        user: IUserSchema;
    } | {
        mustVerify: boolean;
    }>;
    throwInvalidCredentialsError(method: string): never;
    verify(verifyDto: VerifyDto): Promise<true | undefined>;
    updatePassword(accessToken: string, newPassword: string): Promise<boolean>;
    validateAccessToken(accessToken?: string): Promise<import("../../kcApi").AccessTokenPayload<string> & import("jose").JWTPayload & {
        _id: string;
    }>;
    refreshToken(refreshToken: string): Promise<TokenResponse>;
    validateRole(accessToken: string, role: string | string[]): Promise<import("../../kcApi").AccessTokenPayload<string> & import("jose").JWTPayload & {
        _id: string;
    }>;
    _getUser(user: UserCreationDto): Promise<IUserSchema | null>;
    _getClientDefaultGroupId(): Promise<string>;
    _getGroupIdByPath(path: string): Promise<string>;
    _registerUserInKeycloak(userDto: UserCreationDto, groupId?: string): Promise<string>;
    registerDefaultUser(createUserParams: CreateUserParams & {
        group: {
            name: string;
            clientPath: string;
            isDefault: boolean;
        };
    }): Promise<IUserSchema | null>;
    _publicRegister(createUserParams: CreateUserParams): Promise<IUserSchema | {
        mustVerify: boolean;
    } | null>;
    _privateRegister(createUserParams: CreateUserParams): Promise<IUserSchema | {
        mustVerify: boolean;
    } | null>;
    _generateUsername(userDto: UserCreationDto): string;
    _generateConfirmCode(): string;
}
//# sourceMappingURL=UserService.d.ts.map