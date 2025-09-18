import { IError, ValidationErrorOptions, AuthenticationErrorOptions, AuthorizationErrorOptions, DatabaseErrorOptions, ConflictErrorOptions, NetworkErrorOptions, NotFoundErrorOptions, ExternalServiceErrorOptions, InternalErrorOptions, ErrorContextBase, BadConfigErrorOptions } from './types/errors';
import { ErrorCategory, ErrorConstructorMap, NetworkErrorCodes, DatabaseErrorCodes } from './constants';
import { StackHelper } from './StackHelper';

export class CustomError extends Error implements IError {
    public readonly code: string;
    public readonly category: ErrorCategory;
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public context?: ErrorContextBase;
    public timestamp: Date;
    public readonly label: string;
    public stack: string;
    public readonly name: ErrorConstructorMap;

    constructor(error: IError, name: ErrorConstructorMap) {
        super(error.label || error.code);
        this.code = error.code;
        this.context = error.context;
        this.name = name;
        this.label = error.label ?? '';
        this.category = error.category;
        this.statusCode = error.statusCode;
        this.isOperational = error.isOperational;
        this.timestamp = error.timestamp;
        this.stack = this.createStack();
    }

    createStack(): string {
        return StackHelper.createStack(this.name, this.code);
    }

    log(logContext: boolean = true): void {
        const keywordsFilter = ['node_modules', 'node:internal'];
        const callStack = StackHelper.getAndFilterCallStack(this.stack || '', keywordsFilter);
        StackHelper.doubleLineSeparator('Error');
        StackHelper.logErrorName(this.name, this.code);
        StackHelper.logCallStack(callStack);
        StackHelper.singleLineSeparator('Context');
        if (logContext && this.context) {
            Object.keys(this.context).forEach((key: string) => {
                StackHelper.warningConsole(`- ${key}: `);
                console.log(this.context?.[key] as string);
            });
        } else {
            StackHelper.warningConsole('No context');
        }
        StackHelper.doubleLineSeparator('End of Error');
    }

    updateTimestamp(timestamp: Date): void {
        this.timestamp = timestamp;
    }

    updateTimestampToNow(): void {
        this.timestamp = new Date();
    }

    updateContext(context: ErrorContextBase): void {
        if (context.originalError && context.originalError.stack) {
            this.stack = context.originalError.stack;
        }
        this.context = { ...this.context, ...context };
    }
}

export class ValidationError extends CustomError implements IError {
    static readonly _statusCode: number = 400;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.ValidationError;

    constructor(error: ValidationErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.VALIDATION,
            statusCode: ValidationError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, ValidationError._name);
    }
}

// authentication error
export class AuthenticationError extends CustomError implements IError {
    static readonly _statusCode: number = 401;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.AuthenticationError;
    constructor(error: AuthenticationErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.AUTHENTICATION,
            statusCode: AuthenticationError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, AuthenticationError._name);
    }
}

export class AuthorizationError extends CustomError implements IError {
    static readonly _statusCode: number = 403;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.AuthorizationError;
    constructor(error: AuthorizationErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.AUTHORIZATION,
            statusCode: AuthorizationError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, AuthorizationError._name);
    }
}

export class NotFoundError extends CustomError implements IError {
    static readonly _statusCode: number = 404;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.NotFoundError;
    constructor(error: NotFoundErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.NOT_FOUND,
            statusCode: NotFoundError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, NotFoundError._name);
    }
}

export class ConflictError extends CustomError implements IError {
    static readonly _statusCode: number = 409;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.ConflictError;
    constructor(error: ConflictErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.CONFLICT,
            statusCode: ConflictError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, ConflictError._name);
    }
}

export class ExternalServiceError extends CustomError implements IError {
    static readonly _statusCode: number = 502;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.ExternalServiceError;
    public readonly externalService: string;
    constructor(error: ExternalServiceErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.EXTERNAL_SERVICE,
            statusCode: ExternalServiceError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, ExternalServiceError._name);
        this.externalService = error.externalService;
    }
}

export class DatabaseError extends CustomError implements IError {
    static readonly _statusCode: number = 500;
    static readonly CODES = DatabaseErrorCodes;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.DatabaseError;
    constructor(error: DatabaseErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.DATABASE,
            statusCode: DatabaseError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, DatabaseError._name);
    }
}

export class InternalError extends CustomError implements IError {
    static readonly _statusCode: number = 500;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.InternalError;
    constructor(error: InternalErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.INTERNAL,
            statusCode: InternalError._statusCode,
            isOperational: false,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, InternalError._name);
    }
}

export class NetworkError extends CustomError implements IError {
    static readonly _statusCode: number = 500;
    static readonly CODES = NetworkErrorCodes;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.NetworkError;
    constructor(error: NetworkErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.NETWORK,
            statusCode: NetworkError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, NetworkError._name);
    }
}

export class BadConfigError extends CustomError implements IError {
    static readonly _statusCode: number = 500;
    static readonly CODES = NetworkErrorCodes;
    static readonly _name: ErrorConstructorMap = ErrorConstructorMap.BadConfigError;
    constructor(error: BadConfigErrorOptions) {
        const defaultOptions: Partial<IError> = {
            category: ErrorCategory.BAD_CONFIG,
            statusCode: BadConfigError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error } as IError, BadConfigError._name);
    }
}
export function getErrorConstructor(constructor: ErrorConstructorMap) {
    switch (constructor) {
        case ErrorConstructorMap.ValidationError:
            return ValidationError;
        case ErrorConstructorMap.ConflictError:
            return ConflictError;
        case ErrorConstructorMap.ExternalServiceError:
            return ExternalServiceError;
        case ErrorConstructorMap.DatabaseError:
            return DatabaseError;
        case ErrorConstructorMap.InternalError:
            return InternalError;
        case ErrorConstructorMap.NotFoundError:
            return NotFoundError;
        case ErrorConstructorMap.AuthenticationError:
            return AuthenticationError;
        case ErrorConstructorMap.AuthorizationError:
            return AuthorizationError;
        case ErrorConstructorMap.NetworkError:
            return NetworkError;
    }
}

export type ErrorInstance = ValidationError | ConflictError | ExternalServiceError | DatabaseError | InternalError | NotFoundError | AuthenticationError | AuthorizationError | NetworkError;
