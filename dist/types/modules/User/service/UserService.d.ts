import { CreateUserParams, IUserRepository, IUserService, IUserValidator, UserCreationDto, PrivateUserService, VerifyDto } from './UserService.types';
import { IKcApi, TokenResponse, AccessTokenPayload } from '../../kcApi';
import { IClient } from '../../Realm';
import { INotificationClientSdk } from '../../../types';
import { Schema } from 'mongoose';
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
type LoginReturn = {
    token: TokenResponse | null;
    user: PublicRegisterReturn;
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
    throwInvalidCredentialsError(): never;
    verify(verifyDto: VerifyDto): Promise<void>;
    updatePassword(accessToken: string, newPassword: string): Promise<void>;
    validateAccessToken<T extends string>(accessToken?: string): Promise<AccessTokenPayload<T> & {
        _id: string;
    }>;
    refreshToken(refreshToken: string): Promise<TokenResponse>;
    validateRole(accessToken: string, role: string | string[]): Promise<AccessTokenPayload<string> & {
        _id: string;
    }>;
    _getUser(user: UserCreationDto): Promise<import("../model/UserModel.types").IUserSchema | null>;
    _getClientDefaultGroupId(): Promise<string>;
    _getGroupIdByPath(path: string): Promise<string>;
    _registerUserInKeycloak(userDto: UserCreationDto, groupId?: string): Promise<string>;
    registerDefaultUser(createUserParams: CreateUserParams & {
        group: {
            name: string;
            clientPath: string;
            isDefault: boolean;
        };
    }): Promise<import("../model/UserModel.types").IUserSchema>;
    _publicRegister(createUserParams: CreateUserParams): Promise<{
        [x: string]: string | boolean | Schema.Types.ObjectId | Date | undefined;
        _id: Schema.Types.ObjectId;
        username: string;
        method: "email" | "phone" | "username";
        verified: boolean;
        createdAt: Date;
    }>;
    _privateRegister(createUserParams: CreateUserParams): Promise<{
        [x: string]: string | boolean | Schema.Types.ObjectId | Date | undefined;
        _id: Schema.Types.ObjectId;
        username: string;
        method: "email" | "phone" | "username";
        verified: boolean;
        createdAt: Date;
    }>;
    _generateUsername(userDto: UserCreationDto): string;
    _generateConfirmCode(): string;
    _sendVerificationCode(userDto: UserCreationDto, confirmCode: string): Promise<void>;
}
export {};
//# sourceMappingURL=UserService.d.ts.map