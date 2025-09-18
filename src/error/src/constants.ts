export enum ErrorCategory {
    VALIDATION = 'validation',
    AUTHENTICATION = 'authentication',
    AUTHORIZATION = 'authorization',
    NOT_FOUND = 'not_found',
    CONFLICT = 'conflict',
    EXTERNAL_SERVICE = 'external_service',
    DATABASE = 'database',
    NETWORK = 'network',
    CONFIGURATION = 'configuration',
    INTERNAL = 'internal',
    BAD_CONFIG = 'bad_config',
}

export enum ErrorLayer {
    APP = 'app',
    ROUTER = 'router',
    SERVICE = 'service',
    CONTROLLER = 'controller',
    REPOSITORY = 'repository',
    UTILITY = 'utility',
}

export enum ErrorConstructorMap {
    ValidationError = 'ValidationError',
    ConflictError = 'ConflictError',
    ExternalServiceError = 'ExternalServiceError',
    DatabaseError = 'DatabaseError',
    InternalError = 'InternalError',
    NotFoundError = 'NotFoundError',
    NetworkError = 'NetworkError',
    AuthorizationError = 'AuthorizationError',
    AuthenticationError = 'AuthenticationError',
    BadConfigError = 'BadConfigError',
}

export enum NetworkErrorCodes {
    NETWORK_CONNECTION_ERROR = 'NETWORK_CONNECTION_ERROR',
    NETWORK_TIMEOUT_ERROR = 'NETWORK_TIMEOUT_ERROR',
    NETWORK_REQUEST_ERROR = 'NETWORK_REQUEST_ERROR',
}

export enum DatabaseErrorCodes {
    DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
    DATABASE_QUERY_ERROR = 'DATABASE_QUERY_ERROR',
    DATABASE_TRANSACTION_ERROR = 'DATABASE_TRANSACTION_ERROR',
    DATABASE_VALIDATION_ERROR = 'DATABASE_VALIDATION_ERROR',
    DATABASE_TIMEOUT_ERROR = 'DATABASE_TIMEOUT_ERROR',
}
