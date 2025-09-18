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
import { VerifyDto } from '../service/UserService.types';
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
    /**
     * Creates an instance of UserValidator
     *
     * @constructor
     */
    constructor();
    /**
     * Validates user creation DTO for registration
     *
     * Performs comprehensive validation of user registration data including:
     * - Method validation against supported primary fields
     * - Field-specific validation based on registration method
     * - Password strength requirements
     * - Optional field validation (locale, names)
     *
     * @async
     * @method validateUserCreationDto
     * @param {UserCreationDto} userDto - The user creation data to validate
     * @param {PrimaryField[]} primaryFields - Array of supported authentication methods
     * @returns {Promise<RegisterWithPhone | RegisterWithUsername | RegisterWithEmail>}
     *          Validated and typed user creation data
     * @throws {AppError} When method is missing or not supported
     * @throws {ZodError} When validation fails for specific fields
     *
     * @example
     * ```typescript
     * const validator = new UserValidator();
     * const userDto = {
     *   method: 'email',
     *   email: 'user@example.com',
     *   password: 'securePassword123',
     *   firstName: 'John',
     *   lastName: 'Doe'
     * };
     * const validated = await validator.validateUserCreationDto(userDto, ['email', 'phone']);
     * ```
     */
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
    /**
     * Validates login DTO for authentication
     *
     * Validates user login credentials including:
     * - Method validation against supported primary fields
     * - Credential validation based on login method
     * - Password validation
     *
     * @async
     * @method validateLoginDto
     * @param {LoginDto} loginDto - The login credentials to validate
     * @param {PrimaryField[]} primaryFields - Array of supported authentication methods
     * @returns {Promise<LoginWithEmail | LoginWithPhone | LoginWithUsername>}
     *          Validated and typed login data
     * @throws {AppError} When method is missing or not supported
     * @throws {ZodError} When validation fails for specific fields
     *
     * @example
     * ```typescript
     * const loginDto = {
     *   method: 'email',
     *   email: 'user@example.com',
     *   password: 'securePassword123'
     * };
     * const validated = await validator.validateLoginDto(loginDto, ['email', 'username']);
     * ```
     */
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
    /**
     * Validates password strength and format
     *
     * Ensures password meets security requirements:
     * - Minimum length of 8 characters
     * - Non-empty string
     *
     * @async
     * @method validatePassword
     * @param {string} password - The password to validate
     * @returns {Promise<string>} The validated password
     * @throws {ZodError} When password doesn't meet requirements
     *
     * @example
     * ```typescript
     * const password = 'securePassword123';
     * const validatedPassword = await validator.validatePassword(password);
     * ```
     */
    validatePassword(password: string): Promise<string>;
    /**
     * Validates verification DTO for email/phone verification
     *
     * Validates verification codes for account verification:
     * - Method validation (email or phone)
     * - Code format validation (6-digit code)
     * - Contact information validation
     *
     * @async
     * @method validateVerifyDto
     * @param {VerifyDto} verifyDto - The verification data to validate
     * @returns {Promise<VerifyWithEmail | VerifyWithPhone>}
     *          Validated and typed verification data
     * @throws {ZodError} When validation fails for specific fields
     *
     * @example
     * ```typescript
     * const verifyDto = {
     *   method: 'email',
     *   email: 'user@example.com',
     *   code: '123456'
     * };
     * const validated = await validator.validateVerifyDto(verifyDto);
     * ```
     */
    validateVerifyDto(verifyDto: VerifyDto): Promise<{
        method: "email";
        email: string;
        code: string;
    } | {
        method: "phone";
        phone: string;
        code: string;
    }>;
    /**
     * Validates authentication method
     *
     * Simple validation to ensure the provided method is valid and supported.
     * This is a utility method for basic method validation without full DTO validation.
     *
     * @method validateMethod
     * @param {PrimaryField} method - The authentication method to validate
     * @throws {AppError} When method is missing or invalid
     *
     * @example
     * ```typescript
     * validator.validateMethod('email'); // Valid
     * validator.validateMethod('invalid'); // Throws AppError
     * ```
     */
    validateMethod(method: PrimaryField): void;
}
//# sourceMappingURL=UserValidator.d.ts.map