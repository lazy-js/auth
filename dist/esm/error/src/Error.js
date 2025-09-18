import { ErrorCategory, ErrorConstructorMap, NetworkErrorCodes, DatabaseErrorCodes } from "./constants";
import { generateStack } from "./utils";
import { cleanStack } from "./utils";
const stackConfig = {
    removeWorkingDirectoryPrefix: true,
    clean: ["node_modules", "internal/", "generateStack", "updateStack"],
};
export class CustomError extends Error {
    constructor(error, name) {
        var _a;
        super(error.label || error.code);
        this.code = error.code;
        this.context = error.context;
        this.name = name;
        this.label = (_a = error.label) !== null && _a !== void 0 ? _a : "";
        this.stack = error.stack ? error.stack : generateStack({ ...stackConfig, errorName: name });
        this.category = error.category;
        this.statusCode = error.statusCode;
        this.isOperational = error.isOperational;
        this.timestamp = error.timestamp;
    }
    getStack(clean = true) {
        var _a, _b, _c, _d;
        if (clean && stackConfig.clean && stackConfig.clean.length > 0) {
            return (_c = (_a = this.stack) !== null && _a !== void 0 ? _a : cleanStack((_b = this.stack) !== null && _b !== void 0 ? _b : "", ...stackConfig.clean)) !== null && _c !== void 0 ? _c : "";
        }
        return (_d = this.stack) !== null && _d !== void 0 ? _d : "";
    }
    updateTimestamp(timestamp) {
        this.timestamp = timestamp;
    }
    updateTimestampToNow() {
        this.timestamp = new Date();
    }
    updateContext(context) {
        this.context = { ...this.context, ...context };
    }
    updateStack(stack) {
        this.stack = generateStack({ ...stackConfig, errorName: this.name });
        this.stack = this.stack + "\n";
        this.stack = this.stack + stack;
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
    }
}
//# sourceMappingURL=Error.js.map