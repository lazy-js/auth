import { ErrorCategory, ErrorLayer, NetworkErrorCodes, DatabaseErrorCodes } from '../constants';

export type ErrorContextBase = {
    layer?: ErrorLayer;
    className?: string;
    methodName?: string;
    originalError?: Error;
} & Record<string, any>;

export interface IError {
    code: string;
    statusCode: number;
    isOperational: boolean;
    timestamp: Date;
    category: ErrorCategory;
    label?: string;
    context?: ErrorContextBase;
    stack?: string;
}

export type ErrorOptions = Omit<IError, 'category' | 'statusCode' | 'isOperational' | 'timestamp'>;

export type ValueType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null' | 'undefined';
export type ValidationConstraint = 'required' | 'min' | 'max' | 'pattern' | 'type' | 'enum' | 'custom' | 'unique';

export interface ValidationErrorContext extends ErrorContextBase {
    providedValueType?: ValueType;
    providedValue?: any;
    expectedValueType?: ValueType;
    expectedValueExample?: any;
    path?: string;
    constraint?: ValidationConstraint;
}

export interface ValidationErrorOptions extends ErrorOptions {
    context?: ValidationErrorContext;
}

export type InternalErrorOptions = ErrorOptions;
export type NetworkErrorOptions = ErrorOptions & { code: NetworkErrorCodes };
export type DatabaseErrorOptions = ErrorOptions & { code: DatabaseErrorCodes };
export type ExternalServiceErrorOptions = ErrorOptions & { externalService: string };
export type ConflictErrorOptions = ErrorOptions;
export type NotFoundErrorOptions = ErrorOptions;
export type AuthorizationErrorOptions = ErrorOptions;
export type AuthenticationErrorOptions = ErrorOptions;
export type BadConfigErrorOptions = ErrorOptions;
