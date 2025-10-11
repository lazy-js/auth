/**
 * @fileoverview UserValidator - Comprehensive validation service for user authentication and registration
 *
 * This module provides robust validation for user-related operations including:
 * - User registration with multiple authentication methods (email, phone, username)
 * - User login validation across different primary fields
 * - Password strength validation
 * - Email/phone verification code validation
 *
 * The validator uses Zod schemas for type-safe validation and provides detailed error messages
 * through a centralized error configuration system.
 *
 * @author Lazy JS Auth Package
 * @version 1.0.0
 * @since 2024
 */
import { UserCreationDto, PrimaryField, LoginDto } from '../shared.types';
import { IUserValidator } from './UserValidator.types';
import { ResendVerifyCodeDto, VerifyDto } from '../service/UserService.types';
/**
 * Logger instance for UserValidator module
 * Configured to log all levels (debug, info, warn, error) for comprehensive debugging
 */
/**
 * UserValidator Class
 *
 * Implements comprehensive validation for user authentication and registration operations.
 * Uses Zod schemas for type-safe validation with discriminated unions to handle different
 * authentication methods (email, phone, username).
 *
 * @implements {IUserValidator}
 * @class UserValidator
 */
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
    validateResendVerifyCodeDto(verifyDto: ResendVerifyCodeDto): Promise<{
        method: "email";
        email: string;
    } | {
        method: "phone";
        phone: string;
    }>;
    validateTokenString(token: string, tokenType: 'refresh' | 'access'): Promise<string>;
}
//# sourceMappingURL=UserValidator.d.ts.map