import { CreateUserParams, IUserRepository, IUserService, IUserValidator, UserCreationDto, PrivateUserService, VerifyDto } from "./UserService.types";
import { IKcApi, TokenResponse, AccessTokenPayload } from "../../kcApi";
import { IClient } from "../../Realm";
import { IUserSchema } from "../model/UserModel.types";
import { INotificationClientSdk } from "../../../types";
type RegisterReturn = IUserSchema | {
    mustVerify: boolean;
} | null;
type LoginReturn = {
    token: TokenResponse;
    user: IUserSchema;
} | {
    mustVerify: boolean;
};
/**
 * UserService is the service that handles the user registration, login, verification, and password update.
 * @requires IUserRepository
 * @requires IUserValidator
 * @requires IKcApi
 * @requires IClient
 * @requires INotificationClientSdk
 */
export declare class UserService implements IUserService, PrivateUserService {
    userRepository: IUserRepository;
    userValidator: IUserValidator;
    kcApi: IKcApi;
    client: IClient;
    notificationClientSdk: INotificationClientSdk;
    constructor(client: IClient, kcApi: IKcApi, notificationClientSdk: INotificationClientSdk);
    register(createUserParams: CreateUserParams): Promise<RegisterReturn>;
    login(loginParams: CreateUserParams): Promise<LoginReturn>;
    throwInvalidCredentialsError(method: string): never;
    verify(verifyDto: VerifyDto): Promise<void>;
    updatePassword(accessToken: string, newPassword: string): Promise<void>;
    validateAccessToken<T extends string>(accessToken?: string): Promise<AccessTokenPayload<T> & {
        _id: string;
    }>;
    refreshToken(refreshToken: string): Promise<TokenResponse>;
    validateRole(accessToken: string, role: string | string[]): Promise<AccessTokenPayload<string> & {
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
export {};
//# sourceMappingURL=UserService.d.ts.map