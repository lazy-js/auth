import { ErrorCategory, ErrorConstructorMap, NetworkErrorCodes, DatabaseErrorCodes, } from './constants';
import { StackHelper } from './StackHelper';
export class CustomError extends Error {
    constructor(error, name) {
        var _a;
        super(error.label || error.code);
        this.code = error.code;
        this.context = error.context;
        this.name = name;
        this.label = (_a = error.label) !== null && _a !== void 0 ? _a : '';
        this.category = error.category;
        this.statusCode = error.statusCode;
        this.isOperational = error.isOperational;
        this.timestamp = error.timestamp;
        this.stack = this.createStack();
    }
    createStack() {
        return StackHelper.createStack(this.name, this.code);
    }
    log(logContext = true) {
        const keywordsFilter = ['node_modules', 'node:internal'];
        const callStack = StackHelper.getAndFilterCallStack(this.stack || '', keywordsFilter);
        StackHelper.doubleLineSeparator('Error');
        StackHelper.logErrorName(this.name, this.code);
        StackHelper.logCallStack(callStack);
        StackHelper.singleLineSeparator('Context');
        if (logContext && this.context) {
            Object.keys(this.context).forEach((key) => {
                var _a;
                StackHelper.warningConsole(`- ${key}: `);
                console.log((_a = this.context) === null || _a === void 0 ? void 0 : _a[key]);
            });
        }
        else {
            StackHelper.warningConsole('No context');
        }
        StackHelper.doubleLineSeparator('End of Error');
    }
    updateTimestamp(timestamp) {
        this.timestamp = timestamp;
    }
    updateTimestampToNow() {
        this.timestamp = new Date();
    }
    updateContext(context) {
        if (context.originalError && context.originalError.stack) {
            this.stack = context.originalError.stack;
        }
        this.context = { ...this.context, ...context };
    }
}
export class ValidationError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.VALIDATION,
            statusCode: ValidationError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, ValidationError._name);
    }
}
ValidationError._statusCode = 400;
ValidationError._name = ErrorConstructorMap.ValidationError;
// authentication error
export class AuthenticationError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.AUTHENTICATION,
            statusCode: AuthenticationError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, AuthenticationError._name);
    }
}
AuthenticationError._statusCode = 401;
AuthenticationError._name = ErrorConstructorMap.AuthenticationError;
export class AuthorizationError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.AUTHORIZATION,
            statusCode: AuthorizationError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, AuthorizationError._name);
    }
}
AuthorizationError._statusCode = 403;
AuthorizationError._name = ErrorConstructorMap.AuthorizationError;
export class NotFoundError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.NOT_FOUND,
            statusCode: NotFoundError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, NotFoundError._name);
    }
}
NotFoundError._statusCode = 404;
NotFoundError._name = ErrorConstructorMap.NotFoundError;
export class ConflictError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.CONFLICT,
            statusCode: ConflictError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, ConflictError._name);
    }
}
ConflictError._statusCode = 409;
ConflictError._name = ErrorConstructorMap.ConflictError;
export class ExternalServiceError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.EXTERNAL_SERVICE,
            statusCode: ExternalServiceError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, ExternalServiceError._name);
        this.externalService = error.externalService;
    }
}
ExternalServiceError._statusCode = 502;
ExternalServiceError._name = ErrorConstructorMap.ExternalServiceError;
export class DatabaseError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.DATABASE,
            statusCode: DatabaseError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, DatabaseError._name);
    }
}
DatabaseError._statusCode = 500;
DatabaseError.CODES = DatabaseErrorCodes;
DatabaseError._name = ErrorConstructorMap.DatabaseError;
export class InternalError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.INTERNAL,
            statusCode: InternalError._statusCode,
            isOperational: false,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, InternalError._name);
    }
}
InternalError._statusCode = 500;
InternalError._name = ErrorConstructorMap.InternalError;
export class NetworkError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.NETWORK,
            statusCode: NetworkError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, NetworkError._name);
    }
}
NetworkError._statusCode = 500;
NetworkError.CODES = NetworkErrorCodes;
NetworkError._name = ErrorConstructorMap.NetworkError;
export class BadConfigError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: ErrorCategory.BAD_CONFIG,
            statusCode: BadConfigError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, BadConfigError._name);
    }
}
BadConfigError._statusCode = 500;
BadConfigError.CODES = NetworkErrorCodes;
BadConfigError._name = ErrorConstructorMap.BadConfigError;
export function getErrorConstructor(constructor) {
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
        case ErrorConstructorMap.BadConfigError:
            return BadConfigError;
    }
}
//# sourceMappingURL=Error.js.map