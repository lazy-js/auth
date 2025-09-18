"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseErrorCodes = exports.NetworkErrorCodes = exports.ErrorConstructorMap = exports.ErrorLayer = exports.ErrorCategory = void 0;
var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["VALIDATION"] = "validation";
    ErrorCategory["AUTHENTICATION"] = "authentication";
    ErrorCategory["AUTHORIZATION"] = "authorization";
    ErrorCategory["NOT_FOUND"] = "not_found";
    ErrorCategory["CONFLICT"] = "conflict";
    ErrorCategory["EXTERNAL_SERVICE"] = "external_service";
    ErrorCategory["DATABASE"] = "database";
    ErrorCategory["NETWORK"] = "network";
    ErrorCategory["CONFIGURATION"] = "configuration";
    ErrorCategory["INTERNAL"] = "internal";
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}));
var ErrorLayer;
(function (ErrorLayer) {
    ErrorLayer["APP"] = "app";
    ErrorLayer["ROUTER"] = "router";
    ErrorLayer["SERVICE"] = "service";
    ErrorLayer["CONTROLLER"] = "controller";
    ErrorLayer["REPOSITORY"] = "repository";
    ErrorLayer["UTILITY"] = "utility";
})(ErrorLayer || (exports.ErrorLayer = ErrorLayer = {}));
var ErrorConstructorMap;
(function (ErrorConstructorMap) {
    ErrorConstructorMap["ValidationError"] = "ValidationError";
    ErrorConstructorMap["ConflictError"] = "ConflictError";
    ErrorConstructorMap["ExternalServiceError"] = "ExternalServiceError";
    ErrorConstructorMap["DatabaseError"] = "DatabaseError";
    ErrorConstructorMap["InternalError"] = "InternalError";
    ErrorConstructorMap["NotFoundError"] = "NotFoundError";
    ErrorConstructorMap["NetworkError"] = "NetworkError";
    ErrorConstructorMap["AuthorizationError"] = "AuthorizationError";
    ErrorConstructorMap["AuthenticationError"] = "AuthenticationError";
})(ErrorConstructorMap || (exports.ErrorConstructorMap = ErrorConstructorMap = {}));
var NetworkErrorCodes;
(function (NetworkErrorCodes) {
    NetworkErrorCodes["NETWORK_CONNECTION_ERROR"] = "NETWORK_CONNECTION_ERROR";
    NetworkErrorCodes["NETWORK_TIMEOUT_ERROR"] = "NETWORK_TIMEOUT_ERROR";
    NetworkErrorCodes["NETWORK_REQUEST_ERROR"] = "NETWORK_REQUEST_ERROR";
})(NetworkErrorCodes || (exports.NetworkErrorCodes = NetworkErrorCodes = {}));
var DatabaseErrorCodes;
(function (DatabaseErrorCodes) {
    DatabaseErrorCodes["DATABASE_CONNECTION_ERROR"] = "DATABASE_CONNECTION_ERROR";
    DatabaseErrorCodes["DATABASE_QUERY_ERROR"] = "DATABASE_QUERY_ERROR";
    DatabaseErrorCodes["DATABASE_TRANSACTION_ERROR"] = "DATABASE_TRANSACTION_ERROR";
    DatabaseErrorCodes["DATABASE_VALIDATION_ERROR"] = "DATABASE_VALIDATION_ERROR";
    DatabaseErrorCodes["DATABASE_TIMEOUT_ERROR"] = "DATABASE_TIMEOUT_ERROR";
})(DatabaseErrorCodes || (exports.DatabaseErrorCodes = DatabaseErrorCodes = {}));
//# sourceMappingURL=constants.js.map