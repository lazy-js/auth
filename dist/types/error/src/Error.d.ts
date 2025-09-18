import { IError, ValidationErrorOptions, AuthenticationErrorOptions, AuthorizationErrorOptions, DatabaseErrorOptions, ConflictErrorOptions, NetworkErrorOptions, NotFoundErrorOptions, ExternalServiceErrorOptions, InternalErrorOptions, ErrorContextBase, BadConfigErrorOptions } from './types/errors';
import { ErrorCategory, ErrorConstructorMap, NetworkErrorCodes, DatabaseErrorCodes } from './constants';
export declare class CustomError extends Error implements IError {
    readonly code: string;
    readonly category: ErrorCategory;
    readonly statusCode: number;
    readonly isOperational: boolean;
    context?: ErrorContextBase;
    timestamp: Date;
    readonly label: string;
    stack: string;
    readonly name: ErrorConstructorMap;
    constructor(error: IError, name: ErrorConstructorMap);
    createStack(): string;
    log(logContext?: boolean): void;
    updateTimestamp(timestamp: Date): void;
    updateTimestampToNow(): void;
    updateContext(context: ErrorContextBase): void;
}
export declare class ValidationError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly _name: ErrorConstructorMap;
    constructor(error: ValidationErrorOptions);
}
export declare class AuthenticationError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly _name: ErrorConstructorMap;
    constructor(error: AuthenticationErrorOptions);
}
export declare class AuthorizationError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly _name: ErrorConstructorMap;
    constructor(error: AuthorizationErrorOptions);
}
export declare class NotFoundError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly _name: ErrorConstructorMap;
    constructor(error: NotFoundErrorOptions);
}
export declare class ConflictError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly _name: ErrorConstructorMap;
    constructor(error: ConflictErrorOptions);
}
export declare class ExternalServiceError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly _name: ErrorConstructorMap;
    readonly externalService: string;
    constructor(error: ExternalServiceErrorOptions);
}
export declare class DatabaseError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly CODES: typeof DatabaseErrorCodes;
    static readonly _name: ErrorConstructorMap;
    constructor(error: DatabaseErrorOptions);
}
export declare class InternalError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly _name: ErrorConstructorMap;
    constructor(error: InternalErrorOptions);
}
export declare class NetworkError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly CODES: typeof NetworkErrorCodes;
    static readonly _name: ErrorConstructorMap;
    constructor(error: NetworkErrorOptions);
}
export declare class BadConfigError extends CustomError implements IError {
    static readonly _statusCode: number;
    static readonly CODES: typeof NetworkErrorCodes;
    static readonly _name: ErrorConstructorMap;
    constructor(error: BadConfigErrorOptions);
}
export declare function getErrorConstructor(constructor: ErrorConstructorMap): typeof ValidationError;
export type ErrorInstance = ValidationError | ConflictError | ExternalServiceError | DatabaseError | InternalError | NotFoundError | AuthenticationError | AuthorizationError | NetworkError;
//# sourceMappingURL=Error.d.ts.map