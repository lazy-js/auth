"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const error_guard_1 = require("@lazy-js/error-guard");
const constants_1 = require("../constants");
const zod_1 = __importDefault(require("zod"));
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
class UserValidator {
    constructor() { }
    async validateUserCreationDto(userDto, primaryFields) {
        // Validate that method is provided
        if (!userDto.method) {
            throw new error_guard_1.ValidationError(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_METHOD);
        }
        // Validate that method is supported by the system
        if (!primaryFields.includes(userDto.method)) {
            throw new error_guard_1.ValidationError(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_METHOD);
        }
        // Use discriminated union to validate based on method type
        const createUserDtoSchema = zod_1.default.discriminatedUnion('method', [
            registerWithUsernameSchema,
            registerWithEmailSchema,
            registerWithPhoneSchema,
        ]);
        return await createUserDtoSchema.parseAsync(userDto);
    }
    async validateLoginDto(loginDto, primaryFields) {
        // Validate that method is provided
        if (!loginDto.method || !primaryFields.includes(loginDto.method)) {
            throw new error_guard_1.ValidationError(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_METHOD);
        }
        // Use discriminated union to validate based on method type
        const loginDtoSchema = zod_1.default.discriminatedUnion('method', [
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
        const verifyDtoSchema = zod_1.default.discriminatedUnion('method', [verifyEmailSchema, verifyPhoneSchema]);
        return await verifyDtoSchema.parseAsync(verifyDto);
    }
    async validateTokenString(token, tokenType) {
        const res = await getJwtSchema(tokenType).parseAsync(token);
        return res;
    }
}
exports.UserValidator = UserValidator;
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
const passwordSchema = zod_1.default
    .string(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.PASSWORD_REQUIRED)
    .min(8, constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.PASSWORD_INVALID);
/**
 * Email validation schema
 *
 * Requirements:
 * - Must be a valid email format
 * - Uses centralized error messages from config
 */
const emailSchema = zod_1.default
    .string(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.EMAIL_REQUIRED)
    .email(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.EMAIL_INVALID);
/**
 * Username validation schema
 *
 * Requirements:
 * - Must be a string
 * - Minimum 3 characters
 * - Uses centralized error messages from config
 */
const usernameSchema = zod_1.default
    .string(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.USERNAME_REQUIRED)
    .min(3, constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.USERNAME_INVALID);
/**
 * Phone validation schema
 *
 * Requirements:
 * - Must be a string
 * - Minimum 10 characters
 * - Uses centralized error messages from config
 */
const phoneSchema = zod_1.default
    .string(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.PASSWORD_REQUIRED)
    .min(10, constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.PASSWORD_INVALID);
/**
 * Verification code validation schema
 *
 * Requirements:
 * - Must be a string
 * - Exactly 6 characters (numeric code)
 * - Uses centralized error messages from config
 */
const codeSchema = zod_1.default
    .string(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_CODE)
    .min(6, constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_CODE)
    .max(6, constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_CODE);
// ============================================================================
// LOGIN SCHEMAS
// ============================================================================
/**
 * Email-based login schema
 *
 * Validates login credentials using email as primary identifier
 */
const loginWithEmailSchema = zod_1.default.object({
    method: zod_1.default.literal('email'),
    email: emailSchema,
    password: passwordSchema,
});
/**
 * Username-based login schema
 *
 * Validates login credentials using username as primary identifier
 */
const loginWithUsernameSchema = zod_1.default.object({
    method: zod_1.default.literal('username'),
    username: usernameSchema,
    password: passwordSchema,
});
/**
 * Phone-based login schema
 *
 * Validates login credentials using phone number as primary identifier
 */
const loginWithPhoneSchema = zod_1.default.object({
    method: zod_1.default.literal('phone'),
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
const registerWithUsernameSchema = zod_1.default.object({
    method: zod_1.default.literal('username'),
    username: usernameSchema,
    locale: zod_1.default.string().optional(), // User's preferred locale
    firstName: zod_1.default.string().optional(), // User's first name
    lastName: zod_1.default.string().optional(), // User's last name
    middleName: zod_1.default.string().optional(), // User's middle name
    password: passwordSchema,
});
/**
 * Email-based registration schema
 *
 * Validates user registration data using email as primary identifier.
 * Includes optional fields for user profile information.
 */
const registerWithEmailSchema = zod_1.default.object({
    method: zod_1.default.literal('email'),
    email: emailSchema,
    locale: zod_1.default.string().optional(), // User's preferred locale
    firstName: zod_1.default.string().optional(), // User's first name
    lastName: zod_1.default.string().optional(), // User's last name
    middleName: zod_1.default.string().optional(), // User's middle name
    password: passwordSchema,
});
/**
 * Phone-based registration schema
 *
 * Validates user registration data using phone number as primary identifier.
 * Includes optional fields for user profile information.
 */
const registerWithPhoneSchema = zod_1.default.object({
    method: zod_1.default.literal('phone'),
    phone: phoneSchema,
    locale: zod_1.default.string().optional(), // User's preferred locale
    firstName: zod_1.default.string().optional(), // User's first name
    lastName: zod_1.default.string().optional(), // User's last name
    middleName: zod_1.default.string().optional(), // User's middle name
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
const verifyEmailSchema = zod_1.default.object({
    method: zod_1.default.literal('email'),
    email: emailSchema,
    code: codeSchema,
});
/**
 * Phone verification schema
 *
 * Validates phone verification process with verification code
 */
const verifyPhoneSchema = zod_1.default.object({
    method: zod_1.default.literal('phone'),
    phone: phoneSchema,
    code: codeSchema,
});
function getJwtSchema(tokenType) {
    let TOKEN_REQUIRED = constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.ACCESS_OKEN_REQUIRED;
    let INVALID_TOKEN_SHAPE = constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_ACCESS_TOKEN_SHAPE;
    if (tokenType === 'refresh') {
        TOKEN_REQUIRED = constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.REFRESH_TOKEN_REQUIRED;
        INVALID_TOKEN_SHAPE = constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.INVALID_REFRESH_TOKEN_SHAPE;
    }
    return zod_1.default
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