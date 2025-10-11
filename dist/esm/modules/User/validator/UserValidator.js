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
import { ValidationError } from '@lazy-js/error-guard';
import { USER_VALIDATOR_OPERATIONAL_ERRORS } from '../constants';
import z from 'zod';
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
    constructor() { }
    async validateUserCreationDto(userDto, primaryFields) {
        // Validate that method is provided
        if (!userDto.method) {
            throw new ValidationError(USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_METHOD);
        }
        // Validate that method is supported by the system
        if (!primaryFields.includes(userDto.method)) {
            throw new ValidationError(USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_METHOD);
        }
        // Use discriminated union to validate based on method type
        const createUserDtoSchema = z.discriminatedUnion('method', [
            registerWithUsernameSchema,
            registerWithEmailSchema,
            registerWithPhoneSchema,
        ]);
        return await createUserDtoSchema.parseAsync(userDto);
    }
    async validateLoginDto(loginDto, primaryFields) {
        // Validate that method is provided
        if (!loginDto.method || !primaryFields.includes(loginDto.method)) {
            throw new ValidationError(USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_METHOD);
        }
        // Use discriminated union to validate based on method type
        const loginDtoSchema = z.discriminatedUnion('method', [
            loginWithEmailSchema,
            loginWithPhoneSchema,
            loginWithUsernameSchema,
        ]);
        return await loginDtoSchema.parseAsync(loginDto);
    }
    async validatePassword(password) {
        return await passwordSchema.parseAsync(password);
    }
    async validateVerifyDto(verifyDto) {
        const verifyDtoSchema = z.discriminatedUnion('method', [verifyEmailSchema, verifyPhoneSchema]);
        return await verifyDtoSchema.parseAsync(verifyDto);
    }
    async validateResendVerifyCodeDto(verifyDto) {
        const verifyDtoSchema = z.discriminatedUnion('method', [
            resendVerifyCodeEmailSchema,
            resendVerifyCodePhoneSchema,
        ]);
        return await verifyDtoSchema.parseAsync(verifyDto);
    }
    async validateTokenString(token, tokenType) {
        const res = await getJwtSchema(tokenType).parseAsync(token);
        return res;
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
const passwordSchema = z
    .string(USER_VALIDATOR_OPERATIONAL_ERRORS.PASSWORD_REQUIRED)
    .min(8, USER_VALIDATOR_OPERATIONAL_ERRORS.PASSWORD_INVALID);
/**
 * Email validation schema
 *
 * Requirements:
 * - Must be a valid email format
 * - Uses centralized error messages from config
 */
const emailSchema = z
    .string(USER_VALIDATOR_OPERATIONAL_ERRORS.EMAIL_REQUIRED)
    .email(USER_VALIDATOR_OPERATIONAL_ERRORS.EMAIL_INVALID);
/**
 * Username validation schema
 *
 * Requirements:
 * - Must be a string
 * - Minimum 3 characters
 * - Uses centralized error messages from config
 */
const usernameSchema = z
    .string(USER_VALIDATOR_OPERATIONAL_ERRORS.USERNAME_REQUIRED)
    .min(3, USER_VALIDATOR_OPERATIONAL_ERRORS.USERNAME_INVALID);
/**
 * Phone validation schema
 *
 * Requirements:
 * - Must be a string
 * - Minimum 10 characters
 * - Uses centralized error messages from config
 */
const phoneSchema = z
    .string(USER_VALIDATOR_OPERATIONAL_ERRORS.PASSWORD_REQUIRED)
    .min(10, USER_VALIDATOR_OPERATIONAL_ERRORS.PASSWORD_INVALID);
/**
 * Verification code validation schema
 *
 * Requirements:
 * - Must be a string
 * - Exactly 6 characters (numeric code)
 * - Uses centralized error messages from config
 */
const codeSchema = z
    .string(USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_CODE)
    .min(6, USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_CODE)
    .max(6, USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_CODE);
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
const resendVerifyCodeEmailSchema = z.object({
    method: z.literal('email'),
    email: emailSchema,
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
const resendVerifyCodePhoneSchema = z.object({
    method: z.literal('phone'),
    phone: phoneSchema,
});
function getJwtSchema(tokenType) {
    let TOKEN_REQUIRED = USER_VALIDATOR_OPERATIONAL_ERRORS.ACCESS_OKEN_REQUIRED;
    let INVALID_TOKEN_SHAPE = USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_ACCESS_TOKEN_SHAPE;
    if (tokenType === 'refresh') {
        TOKEN_REQUIRED = USER_VALIDATOR_OPERATIONAL_ERRORS.REFRESH_TOKEN_REQUIRED;
        INVALID_TOKEN_SHAPE = USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_REFRESH_TOKEN_SHAPE;
    }
    return z
        .string(TOKEN_REQUIRED)
        .refine((val) => val.startsWith('Bearer '), {
        message: INVALID_TOKEN_SHAPE,
    })
        .refine((val) => {
        const parts = val.split(' ');
        return parts.length === 2 && parts[1].trim().length > 0;
    }, {
        message: INVALID_TOKEN_SHAPE,
    })
        .transform((val) => val.split(' ')[1]);
}
//# sourceMappingURL=UserValidator.js.map