import { UserCreationDto, PrimaryField, LoginDto } from '../shared.types';
import { IUserValidator } from './UserValidator.types';
import { VerifyDto } from '../service/UserService.types';
export declare class UserValidator implements IUserValidator {
    constructor();
    validateUserCreationDto(userDto: UserCreationDto, primaryFields: PrimaryField[]): Promise<{
        method: "username";
        username: string;
        password: string;
        locale?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        middleName?: string | undefined;
    } | {
        method: "email";
        email: string;
        password: string;
        locale?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        middleName?: string | undefined;
    } | {
        method: "phone";
        phone: string;
        password: string;
        locale?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        middleName?: string | undefined;
    }>;
    validateLoginDto(loginDto: LoginDto, primaryFields: PrimaryField[]): Promise<{
        method: "email";
        email: string;
        password: string;
    } | {
        method: "phone";
        phone: string;
        password: string;
    } | {
        method: "username";
        username: string;
        password: string;
    }>;
    validatePassword(password: string): Promise<string>;
    validateVerifyDto(verifyDto: VerifyDto): Promise<{
        method: "email";
        email: string;
        code: string;
    } | {
        method: "phone";
        phone: string;
        code: string;
    }>;
    validateMethod(method: PrimaryField): void;
}
//# sourceMappingURL=UserValidator.d.ts.map