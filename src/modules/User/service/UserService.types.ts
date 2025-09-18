import { IUserRepository } from '../repository/UserRepo.types';
import { IUserValidator } from '../validator/UserValidator.types';
import { IUserSchema } from '../model/UserModel.types';
import { UserCreationDto } from '../shared.types';
import { IClient } from '../../Realm';

export interface CreateUserParams {
    body: any;
    accessToken?: string;
}

export interface VerifyDto {
    code: string;
    email?: string;
    phone?: string;
    method: 'phone' | 'email';
}

export type { UserCreationDto, IUserValidator, IUserRepository };

export declare class IUserService {
    public userRepository: IUserRepository;
    public userValidator: IUserValidator;

    register(createUserParams: CreateUserParams): Promise<any>;
    login(loginParams: Omit<CreateUserParams, 'accessToken'>): Promise<any>;
    updatePassword(accessToken?: string, newPassword?: string): Promise<any>;
    validateAccessToken(accessToken?: string): Promise<any>;
    validateRole(accessToken: string, role: string | string[]): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
    updatePassword(accessToken: string, newPassword: string): Promise<any>;
    verify(verifyDto: VerifyDto): Promise<any>;
}

export interface PrivateUserService {
    _getUser(user: UserCreationDto): Promise<IUserSchema | null>;
    _registerUserInKeycloak(
        userDto: UserCreationDto,
        groupId?: string,
    ): Promise<string>;
    _getClientDefaultGroupId(client: IClient): Promise<string>;
    _generateUsername(userDto: UserCreationDto): string;
    _publicRegister(
        createUserParams: CreateUserParams,
        groupId?: string,
    ): Promise<any>;
}
