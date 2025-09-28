import { VerifyDto } from '../service/UserService.types';
import { UserCreationDto, PrimaryField, LoginDto } from '../shared.types';

export declare class IUserValidator {
    validateUserCreationDto(
        userDto: UserCreationDto,
        primaryFields: PrimaryField[],
    ): Promise<RegisterWithPhone | RegisterWithUsername | RegisterWithEmail>;
    validateLoginDto(
        loginDto: LoginDto,
        primaryFields: PrimaryField[],
    ): Promise<LoginWithEmail | LoginWithPhone | LoginWithUsername>;
    validatePassword(password: string): Promise<string>;
    validateVerifyDto(verifyDto: VerifyDto): Promise<VerifyWithEmail | VerifyWithPhone>;

    validateTokenString(token: string, tokenType: 'refresh' | 'access'): Promise<string>;
}

export interface RegisterWithUsername {
    username: string;
    method: 'username';
    locale?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    middleName?: string | undefined;
    password: string;
}

export interface RegisterWithEmail {
    email: string;
    method: 'email';
    locale?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    middleName?: string | undefined;
    password: string;
}

export interface RegisterWithPhone {
    phone: string;
    method: 'phone';
    locale?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    middleName?: string | undefined;
    password: string;
}

export interface LoginWithUsername {
    username: string;
    method: 'username';
    password: string;
}

export interface LoginWithEmail {
    email: string;
    method: 'email';
    password: string;
}

export interface LoginWithPhone {
    phone: string;
    method: 'phone';
    password: string;
}

export interface VerifyWithEmail {
    email: string;
    method: 'email';
    code: string;
}

export interface VerifyWithPhone {
    phone: string;
    method: 'phone';
    code: string;
}
