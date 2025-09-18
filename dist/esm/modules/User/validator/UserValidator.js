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
import { AppError } from '@lazy-js/utils';
import { userValidatorLogger } from '../../../config/loggers';
import z from 'zod';
import errors from '../../../config/errors';
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
export class UserValidator {
    /**
     * Creates an instance of UserValidator
     *
     * @constructor
     */
    constructor() { }
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
    async validateUserCreationDto(userDto, primaryFields) {
        userValidatorLogger.info('received userDto', userDto);
        userValidatorLogger.info('primaryFields for this client', primaryFields);
        // Validate that method is provided
        if (!userDto.method) {
            userValidatorLogger.error('method is required');
            throw new AppError(errors.INVALID_LOGIN_METHOD);
        }
        // Validate that method is supported by the system
        if (!primaryFields.includes(userDto.method)) {
            userValidatorLogger.error('method is not supported by this client');
            throw new AppError(errors.NOT_SUPPORTED_REGISTER_METHOD);
        }
        // Use discriminated union to validate based on method type
        const createUserDtoSchema = z.discriminatedUnion('method', [registerWithUsernameSchema, registerWithEmailSchema, registerWithPhoneSchema]);
        return await createUserDtoSchema.parseAsync(userDto);
    }
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
    async validateLoginDto(loginDto, primaryFields) {
        // Validate that method is provided
        if (!loginDto.method) {
            throw new AppError(errors.INVALID_LOGIN_METHOD);
        }
        // Validate that method is supported by the system
        if (!primaryFields.includes(loginDto.method)) {
            throw new AppError(errors.INVALID_LOGIN_METHOD);
        }
        // Use discriminated union to validate based on method type
        const loginDtoSchema = z.discriminatedUnion('method', [loginWithEmailSchema, loginWithPhoneSchema, loginWithUsernameSchema]);
        return await loginDtoSchema.parseAsync(loginDto);
    }
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
    async validatePassword(password) {
        return await passwordSchema.parseAsync(password);
    }
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
    async validateVerifyDto(verifyDto) {
        const verifyDtoSchema = z.discriminatedUnion('method', [verifyEmailSchema, verifyPhoneSchema]);
        return await verifyDtoSchema.parseAsync(verifyDto);
    }
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
    validateMethod(method) {
        const primaryFields = ['email', 'phone', 'username'];
        // Validate that method is provided
        if (!method) {
            throw new AppError(errors.INVALID_LOGIN_METHOD);
        }
        // Validate that method is in the list of supported methods
        if (!primaryFields.includes(method)) {
            throw new AppError(errors.INVALID_LOGIN_METHOD);
        }
    }
}
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Password validation schema
 *
 * Requirements:
 * - Must be a string
 * - Minimum 8 characters
 * - Uses centralized error messages from config
 */
const passwordSchema = z.string({ message: errors.PASSWORD_REQUIRED.code }).min(8, errors.PASSWORD_INVALID.code);
/**
 * Email validation schema
 *
 * Requirements:
 * - Must be a valid email format
 * - Uses centralized error messages from config
 */
const emailSchema = z.string({ message: errors.EMAIL_REQUIRED.code }).email(errors.EMAIL_INVALID.code);
/**
 * Username validation schema
 *
 * Requirements:
 * - Must be a string
 * - Minimum 3 characters
 * - Uses centralized error messages from config
 */
const usernameSchema = z.string({ message: errors.USERNAME_REQUIRED.code }).min(3, errors.USERNAME_INVALID.code);
/**
 * Phone validation schema
 *
 * Requirements:
 * - Must be a string
 * - Minimum 10 characters
 * - Uses centralized error messages from config
 */
const phoneSchema = z.string({ message: errors.PHONE_REQUIRED.code }).min(10, errors.PHONE_INVALID.code);
/**
 * Verification code validation schema
 *
 * Requirements:
 * - Must be a string
 * - Exactly 6 characters (numeric code)
 * - Uses centralized error messages from config
 */
const codeSchema = z.string({ message: errors.INVALID_CODE.code }).min(6, errors.INVALID_CODE.code).max(6, errors.INVALID_CODE.code);
// ============================================================================
// LOGIN SCHEMAS
// ============================================================================
/**
 * Email-based login schema
 *
 * Validates login credentials using email as primary identifier
 */
const loginWithEmailSchema = z.object({
    method: z.literal('email'),
    email: emailSchema,
    password: passwordSchema,
});
/**
 * Username-based login schema
 *
 * Validates login credentials using username as primary identifier
 */
const loginWithUsernameSchema = z.object({
    method: z.literal('username'),
    username: usernameSchema,
    password: passwordSchema,
});
/**
 * Phone-based login schema
 *
 * Validates login credentials using phone number as primary identifier
 */
const loginWithPhoneSchema = z.object({
    method: z.literal('phone'),
    phone: phoneSchema,
    password: passwordSchema,
});
// ============================================================================
// REGISTRATION SCHEMAS
// ============================================================================
/**
 * Username-based registration schema
 *
 * Validates user registration data using username as primary identifier.
 * Includes optional fields for user profile information.
 */
const registerWithUsernameSchema = z.object({
    method: z.literal('username'),
    username: usernameSchema,
    locale: z.string().optional(), // User's preferred locale
    firstName: z.string().optional(), // User's first name
    lastName: z.string().optional(), // User's last name
    middleName: z.string().optional(), // User's middle name
    password: passwordSchema,
});
/**
 * Email-based registration schema
 *
 * Validates user registration data using email as primary identifier.
 * Includes optional fields for user profile information.
 */
const registerWithEmailSchema = z.object({
    method: z.literal('email'),
    email: emailSchema,
    locale: z.string().optional(), // User's preferred locale
    firstName: z.string().optional(), // User's first name
    lastName: z.string().optional(), // User's last name
    middleName: z.string().optional(), // User's middle name
    password: passwordSchema,
});
/**
 * Phone-based registration schema
 *
 * Validates user registration data using phone number as primary identifier.
 * Includes optional fields for user profile information.
 */
const registerWithPhoneSchema = z.object({
    method: z.literal('phone'),
    phone: phoneSchema,
    locale: z.string().optional(), // User's preferred locale
    firstName: z.string().optional(), // User's first name
    lastName: z.string().optional(), // User's last name
    middleName: z.string().optional(), // User's middle name
    password: passwordSchema,
});
// ============================================================================
// VERIFICATION SCHEMAS
// ============================================================================
/**
 * Email verification schema
 *
 * Validates email verification process with verification code
 */
const verifyEmailSchema = z.object({
    method: z.literal('email'),
    email: emailSchema,
    code: codeSchema,
});
/**
 * Phone verification schema
 *
 * Validates phone verification process with verification code
 */
const verifyPhoneSchema = z.object({
    method: z.literal('phone'),
    phone: phoneSchema,
    code: codeSchema,
});
//# sourceMappingURL=UserValidator.js.map