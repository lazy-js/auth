"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkError = exports.InternalError = exports.DatabaseError = exports.ExternalServiceError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.CustomError = void 0;
exports.getErrorConstructor = getErrorConstructor;
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const utils_2 = require("./utils");
const stackConfig = {
    removeWorkingDirectoryPrefix: true,
    clean: ["node_modules", "internal/", "generateStack", "updateStack"],
};
class CustomError extends Error {
    constructor(error, name) {
        var _a;
        super(error.label || error.code);
        this.code = error.code;
        this.context = error.context;
        this.name = name;
        this.label = (_a = error.label) !== null && _a !== void 0 ? _a : "";
        this.stack = error.stack ? error.stack : (0, utils_1.generateStack)({ ...stackConfig, errorName: name });
        this.category = error.category;
        this.statusCode = error.statusCode;
        this.isOperational = error.isOperational;
        this.timestamp = error.timestamp;
    }
    getStack(clean = true) {
        var _a, _b, _c, _d;
        if (clean && stackConfig.clean && stackConfig.clean.length > 0) {
            return (_c = (_a = this.stack) !== null && _a !== void 0 ? _a : (0, utils_2.cleanStack)((_b = this.stack) !== null && _b !== void 0 ? _b : "", ...stackConfig.clean)) !== null && _c !== void 0 ? _c : "";
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
        this.stack = (0, utils_1.generateStack)({ ...stackConfig, errorName: this.name });
        this.stack = this.stack + "\n";
        this.stack = this.stack + stack;
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
    }
}
//# sourceMappingURL=Error.js.map