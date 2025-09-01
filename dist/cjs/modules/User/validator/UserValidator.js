"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const utils_1 = require("@lazy-js/utils");
const zod_1 = __importDefault(require("zod"));
const errors_1 = __importDefault(require("../../../config/errors"));
class UserValidator {
    constructor() { }
    async validateUserCreationDto(userDto, primaryFields) {
        if (!userDto.method) {
            throw new utils_1.AppError(errors_1.default.INVALID_LOGIN_METHOD);
        }
        if (!primaryFields.includes(userDto.method)) {
            throw new utils_1.AppError(errors_1.default.NOT_SUPPORTED_REGISTER_METHOD);
        }
        const createUserDtoSchema = zod_1.default.discriminatedUnion('method', [
            registerWithUsernameSchema,
            registerWithEmailSchema,
            registerWithPhoneSchema,
        ]);
        return await createUserDtoSchema.parseAsync(userDto);
    }
    async validateLoginDto(loginDto, primaryFields) {
        if (!loginDto.method) {
            throw new utils_1.AppError(errors_1.default.INVALID_LOGIN_METHOD);
        }
        if (!primaryFields.includes(loginDto.method)) {
            throw new utils_1.AppError(errors_1.default.INVALID_LOGIN_METHOD);
        }
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
        const verifyDtoSchema = zod_1.default.discriminatedUnion('method', [
            verifyEmailSchema,
            verifyPhoneSchema,
        ]);
        return await verifyDtoSchema.parseAsync(verifyDto);
    }
    validateMethod(method) {
        const primaryFields = ['email', 'phone', 'username'];
        if (!method) {
            throw new utils_1.AppError(errors_1.default.INVALID_LOGIN_METHOD);
        }
        if (!primaryFields.includes(method)) {
            throw new utils_1.AppError(errors_1.default.INVALID_LOGIN_METHOD);
        }
    }
}
exports.UserValidator = UserValidator;
const passwordSchema = zod_1.default
    .string({ message: errors_1.default.PASSWORD_REQUIRED.code })
    .min(8, errors_1.default.PASSWORD_INVALID.code);
const emailSchema = zod_1.default
    .string({ message: errors_1.default.EMAIL_REQUIRED.code })
    .email(errors_1.default.EMAIL_INVALID.code);
const usernameSchema = zod_1.default
    .string({ message: errors_1.default.USERNAME_REQUIRED.code })
    .min(3, errors_1.default.USERNAME_INVALID.code);
const phoneSchema = zod_1.default
    .string({ message: errors_1.default.PHONE_REQUIRED.code })
    .min(10, errors_1.default.PHONE_INVALID.code);
const codeSchema = zod_1.default
    .string({ message: errors_1.default.INVALID_CODE.code })
    .min(6, errors_1.default.INVALID_CODE.code)
    .max(6, errors_1.default.INVALID_CODE.code);
const loginWithEmailSchema = zod_1.default.object({
    method: zod_1.default.literal('email'),
    email: emailSchema,
    password: passwordSchema,
});
const loginWithUsernameSchema = zod_1.default.object({
    method: zod_1.default.literal('username'),
    username: usernameSchema,
    password: passwordSchema,
});
const loginWithPhoneSchema = zod_1.default.object({
    method: zod_1.default.literal('phone'),
    phone: phoneSchema,
    password: passwordSchema,
});
const registerWithUsernameSchema = zod_1.default.object({
    method: zod_1.default.literal('username'),
    username: usernameSchema,
    locale: zod_1.default.string().optional(),
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
    middleName: zod_1.default.string().optional(),
    password: passwordSchema,
});
const registerWithEmailSchema = zod_1.default.object({
    method: zod_1.default.literal('email'),
    email: emailSchema,
    locale: zod_1.default.string().optional(),
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
    middleName: zod_1.default.string().optional(),
    password: passwordSchema,
});
const registerWithPhoneSchema = zod_1.default.object({
    method: zod_1.default.literal('phone'),
    phone: phoneSchema,
    locale: zod_1.default.string().optional(),
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
    middleName: zod_1.default.string().optional(),
    password: passwordSchema,
});
const verifyEmailSchema = zod_1.default.object({
    method: zod_1.default.literal('email'),
    email: emailSchema,
    code: codeSchema,
});
const verifyPhoneSchema = zod_1.default.object({
    method: zod_1.default.literal('phone'),
    phone: phoneSchema,
    code: codeSchema,
});
//# sourceMappingURL=UserValidator.js.map