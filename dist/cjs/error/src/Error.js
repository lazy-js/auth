"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadConfigError = exports.NetworkError = exports.InternalError = exports.DatabaseError = exports.ExternalServiceError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.CustomError = void 0;
exports.getErrorConstructor = getErrorConstructor;
const constants_1 = require("./constants");
const StackHelper_1 = require("./StackHelper");
class CustomError extends Error {
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
        return StackHelper_1.StackHelper.createStack(this.name, this.code);
    }
    log(logContext = true) {
        const keywordsFilter = ['node_modules', 'node:internal'];
        const callStack = StackHelper_1.StackHelper.getAndFilterCallStack(this.stack || '', keywordsFilter);
        StackHelper_1.StackHelper.doubleLineSeparator('Error');
        StackHelper_1.StackHelper.logErrorName(this.name, this.code);
        StackHelper_1.StackHelper.logCallStack(callStack);
        StackHelper_1.StackHelper.singleLineSeparator('Context');
        if (logContext && this.context) {
            Object.keys(this.context).forEach((key) => {
                var _a;
                StackHelper_1.StackHelper.warningConsole(`- ${key}: `);
                console.log((_a = this.context) === null || _a === void 0 ? void 0 : _a[key]);
            });
        }
        else {
            StackHelper_1.StackHelper.warningConsole('No context');
        }
        StackHelper_1.StackHelper.doubleLineSeparator('End of Error');
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
exports.CustomError = CustomError;
class ValidationError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.VALIDATION,
            statusCode: ValidationError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, ValidationError._name);
    }
}
exports.ValidationError = ValidationError;
ValidationError._statusCode = 400;
ValidationError._name = constants_1.ErrorConstructorMap.ValidationError;
// authentication error
class AuthenticationError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.AUTHENTICATION,
            statusCode: AuthenticationError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, AuthenticationError._name);
    }
}
exports.AuthenticationError = AuthenticationError;
AuthenticationError._statusCode = 401;
AuthenticationError._name = constants_1.ErrorConstructorMap.AuthenticationError;
class AuthorizationError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.AUTHORIZATION,
            statusCode: AuthorizationError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, AuthorizationError._name);
    }
}
exports.AuthorizationError = AuthorizationError;
AuthorizationError._statusCode = 403;
AuthorizationError._name = constants_1.ErrorConstructorMap.AuthorizationError;
class NotFoundError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.NOT_FOUND,
            statusCode: NotFoundError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, NotFoundError._name);
    }
}
exports.NotFoundError = NotFoundError;
NotFoundError._statusCode = 404;
NotFoundError._name = constants_1.ErrorConstructorMap.NotFoundError;
class ConflictError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.CONFLICT,
            statusCode: ConflictError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, ConflictError._name);
    }
}
exports.ConflictError = ConflictError;
ConflictError._statusCode = 409;
ConflictError._name = constants_1.ErrorConstructorMap.ConflictError;
class ExternalServiceError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.EXTERNAL_SERVICE,
            statusCode: ExternalServiceError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, ExternalServiceError._name);
        this.externalService = error.externalService;
    }
}
exports.ExternalServiceError = ExternalServiceError;
ExternalServiceError._statusCode = 502;
ExternalServiceError._name = constants_1.ErrorConstructorMap.ExternalServiceError;
class DatabaseError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.DATABASE,
            statusCode: DatabaseError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, DatabaseError._name);
    }
}
exports.DatabaseError = DatabaseError;
DatabaseError._statusCode = 500;
DatabaseError.CODES = constants_1.DatabaseErrorCodes;
DatabaseError._name = constants_1.ErrorConstructorMap.DatabaseError;
class InternalError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.INTERNAL,
            statusCode: InternalError._statusCode,
            isOperational: false,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, InternalError._name);
    }
}
exports.InternalError = InternalError;
InternalError._statusCode = 500;
InternalError._name = constants_1.ErrorConstructorMap.InternalError;
class NetworkError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.NETWORK,
            statusCode: NetworkError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, NetworkError._name);
    }
}
exports.NetworkError = NetworkError;
NetworkError._statusCode = 500;
NetworkError.CODES = constants_1.NetworkErrorCodes;
NetworkError._name = constants_1.ErrorConstructorMap.NetworkError;
class BadConfigError extends CustomError {
    constructor(error) {
        const defaultOptions = {
            category: constants_1.ErrorCategory.BAD_CONFIG,
            statusCode: BadConfigError._statusCode,
            isOperational: true,
            timestamp: new Date(),
        };
        super({ ...defaultOptions, ...error }, BadConfigError._name);
    }
}
exports.BadConfigError = BadConfigError;
BadConfigError._statusCode = 500;
BadConfigError.CODES = constants_1.NetworkErrorCodes;
BadConfigError._name = constants_1.ErrorConstructorMap.BadConfigError;
function getErrorConstructor(constructor) {
    switch (constructor) {
        case constants_1.ErrorConstructorMap.ValidationError:
            return ValidationError;
        case constants_1.ErrorConstructorMap.ConflictError:
            return ConflictError;
        case constants_1.ErrorConstructorMap.ExternalServiceError:
            return ExternalServiceError;
        case constants_1.ErrorConstructorMap.DatabaseError:
            return DatabaseError;
        case constants_1.ErrorConstructorMap.InternalError:
            return InternalError;
        case constants_1.ErrorConstructorMap.NotFoundError:
            return NotFoundError;
        case constants_1.ErrorConstructorMap.AuthenticationError:
            return AuthenticationError;
        case constants_1.ErrorConstructorMap.AuthorizationError:
            return AuthorizationError;
        case constants_1.ErrorConstructorMap.NetworkError:
            return NetworkError;
        case constants_1.ErrorConstructorMap.BadConfigError:
            return BadConfigError;
    }
}
//# sourceMappingURL=Error.js.map