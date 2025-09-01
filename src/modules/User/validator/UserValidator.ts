import { AppError } from '@lazy-js/utils';
import { UserCreationDto, PrimaryField, LoginDto } from '../shared.types';
import { IUserValidator } from './UserValidator.types';

import z from 'zod';
import errors from '../../../config/errors';
import { VerifyDto } from '../service/UserService.types';

export class UserValidator implements IUserValidator {
  constructor() {}

  async validateUserCreationDto(
    userDto: UserCreationDto,
    primaryFields: PrimaryField[],
  ) {
    if (!userDto.method) {
      throw new AppError(errors.INVALID_LOGIN_METHOD);
    }
    if (!primaryFields.includes(userDto.method)) {
      throw new AppError(errors.NOT_SUPPORTED_REGISTER_METHOD);
    }
    const createUserDtoSchema = z.discriminatedUnion('method', [
      registerWithUsernameSchema,
      registerWithEmailSchema,
      registerWithPhoneSchema,
    ]);

    return await createUserDtoSchema.parseAsync(userDto);
  }

  async validateLoginDto(loginDto: LoginDto, primaryFields: PrimaryField[]) {
    if (!loginDto.method) {
      throw new AppError(errors.INVALID_LOGIN_METHOD);
    }

    if (!primaryFields.includes(loginDto.method)) {
      throw new AppError(errors.INVALID_LOGIN_METHOD);
    }
    const loginDtoSchema = z.discriminatedUnion('method', [
      loginWithEmailSchema,
      loginWithPhoneSchema,
      loginWithUsernameSchema,
    ]);

    return await loginDtoSchema.parseAsync(loginDto);
  }

  async validatePassword(password: string): Promise<string> {
    return await passwordSchema.parseAsync(password);
  }

  async validateVerifyDto(verifyDto: VerifyDto) {
    const verifyDtoSchema = z.discriminatedUnion('method', [
      verifyEmailSchema,
      verifyPhoneSchema,
    ]);
    return await verifyDtoSchema.parseAsync(verifyDto);
  }

  validateMethod(method: PrimaryField) {
    const primaryFields = ['email', 'phone', 'username'];
    if (!method) {
      throw new AppError(errors.INVALID_LOGIN_METHOD);
    }
    if (!primaryFields.includes(method)) {
      throw new AppError(errors.INVALID_LOGIN_METHOD);
    }
  }
}

const passwordSchema = z
  .string({ message: errors.PASSWORD_REQUIRED.code })
  .min(8, errors.PASSWORD_INVALID.code);
const emailSchema = z
  .string({ message: errors.EMAIL_REQUIRED.code })
  .email(errors.EMAIL_INVALID.code);
const usernameSchema = z
  .string({ message: errors.USERNAME_REQUIRED.code })
  .min(3, errors.USERNAME_INVALID.code);
const phoneSchema = z
  .string({ message: errors.PHONE_REQUIRED.code })
  .min(10, errors.PHONE_INVALID.code);

const codeSchema = z
  .string({ message: errors.INVALID_CODE.code })
  .min(6, errors.INVALID_CODE.code)
  .max(6, errors.INVALID_CODE.code);
const loginWithEmailSchema = z.object({
  method: z.literal('email'),
  email: emailSchema,
  password: passwordSchema,
});

const loginWithUsernameSchema = z.object({
  method: z.literal('username'),
  username: usernameSchema,
  password: passwordSchema,
});

const loginWithPhoneSchema = z.object({
  method: z.literal('phone'),
  phone: phoneSchema,
  password: passwordSchema,
});

const registerWithUsernameSchema = z.object({
  method: z.literal('username'),
  username: usernameSchema,
  locale: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  password: passwordSchema,
});

const registerWithEmailSchema = z.object({
  method: z.literal('email'),
  email: emailSchema,
  locale: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  password: passwordSchema,
});

const registerWithPhoneSchema = z.object({
  method: z.literal('phone'),
  phone: phoneSchema,
  locale: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  password: passwordSchema,
});

const verifyEmailSchema = z.object({
  method: z.literal('email'),
  email: emailSchema,
  code: codeSchema,
});

const verifyPhoneSchema = z.object({
  method: z.literal('phone'),
  phone: phoneSchema,
  code: codeSchema,
});
