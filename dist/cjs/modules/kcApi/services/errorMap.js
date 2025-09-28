"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorTransformer = exports.MANUALLY_THROWN_ERROR_CODES = exports.rollbackError = void 0;
const error_guard_1 = require("@lazy-js/error-guard");
const jose_1 = require("jose");
exports.rollbackError = new error_guard_1.InternalError({
    code: 'UNKNOWN_KEYCLOAK_ERROR',
    message: 'Unknown error',
});
const errorMapBuilder = new error_guard_1.ErrorMapBuilder({
    globalProperty: 'message',
    rollbackError: exports.rollbackError,
});
var MANUALLY_THROWN_ERROR_CODES;
(function (MANUALLY_THROWN_ERROR_CODES) {
    MANUALLY_THROWN_ERROR_CODES["NO_GROUP_WITH_THAT_PATH"] = "NO_GROUP_WITH_THAT_PATH";
    MANUALLY_THROWN_ERROR_CODES["NO_ROLE_WITH_THAT_ID"] = "NO_ROLE_WITH_THAT_ID";
    MANUALLY_THROWN_ERROR_CODES["NO_GROUP_WITH_THAT_ID"] = "NO_GROUP_WITH_THAT_ID";
    MANUALLY_THROWN_ERROR_CODES["UNKNOWN_ERROR_IN_KC_API"] = "UNKNOWN_ERROR_IN_KC_API";
    MANUALLY_THROWN_ERROR_CODES["DEFAULT_REALM_ROLE_NOT_FOUND"] = "DEFAULT_REALM_ROLE_NOT_FOUND";
})(MANUALLY_THROWN_ERROR_CODES || (exports.MANUALLY_THROWN_ERROR_CODES = MANUALLY_THROWN_ERROR_CODES = {}));
var TRANSFORMER_THROWN_ERROR_CODES;
(function (TRANSFORMER_THROWN_ERROR_CODES) {
    TRANSFORMER_THROWN_ERROR_CODES["TOP_LEVEL_GROUP_ALREADY_EXISTS"] = "TOP_LEVEL_GROUP_ALREADY_EXISTS";
    TRANSFORMER_THROWN_ERROR_CODES["SUB_GROUP_ALREADY_EXISTS"] = "SUB_GROUP_ALREADY_EXISTS";
    TRANSFORMER_THROWN_ERROR_CODES["EXPIRED_ACCESS_TOKEN"] = "EXPIRED_ACCESS_TOKEN";
    TRANSFORMER_THROWN_ERROR_CODES["INVALID_ACCESS_TOKEN"] = "INVALID_ACCESS_TOKEN";
    TRANSFORMER_THROWN_ERROR_CODES["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    TRANSFORMER_THROWN_ERROR_CODES["REALM_ALREADY_EXISTS"] = "REALM_ALREADY_EXISTS";
    TRANSFORMER_THROWN_ERROR_CODES["USER_ALREADY_EXISTS"] = "USER_ALREADY_EXISTS";
    TRANSFORMER_THROWN_ERROR_CODES["NO_GROUP_WITH_THAT_ID"] = "NO_GROUP_WITH_THAT_ID";
    TRANSFORMER_THROWN_ERROR_CODES["KEYCLOAK_UNAUTHORIZED"] = "KEYCLOAK_UNAUTHORIZED";
})(TRANSFORMER_THROWN_ERROR_CODES || (TRANSFORMER_THROWN_ERROR_CODES = {}));
errorMapBuilder
    .instanceOf(error_guard_1.CustomError)
    .pass()
    .includes(['Top level group', 'already exists'])
    .throwErrorInstance(new error_guard_1.ConflictError(TRANSFORMER_THROWN_ERROR_CODES.TOP_LEVEL_GROUP_ALREADY_EXISTS))
    .includes(['sibling group', 'already exists'])
    .throwErrorInstance(new error_guard_1.ConflictError(TRANSFORMER_THROWN_ERROR_CODES.SUB_GROUP_ALREADY_EXISTS))
    .instanceOf(jose_1.errors.JWTExpired)
    .throwErrorInstance(new error_guard_1.AuthenticationError(TRANSFORMER_THROWN_ERROR_CODES.EXPIRED_ACCESS_TOKEN))
    .instanceOf(jose_1.errors.JWTInvalid)
    .throwErrorInstance(new error_guard_1.AuthenticationError(TRANSFORMER_THROWN_ERROR_CODES.INVALID_ACCESS_TOKEN))
    .instanceOf(jose_1.errors.JWSSignatureVerificationFailed)
    .throwErrorInstance(new error_guard_1.AuthenticationError(TRANSFORMER_THROWN_ERROR_CODES.INVALID_ACCESS_TOKEN))
    .includes(['invalid', 'grant'])
    .throwErrorInstance(new error_guard_1.AuthenticationError(TRANSFORMER_THROWN_ERROR_CODES.INVALID_CREDENTIALS))
    .includes(['Realm', 'already exists'])
    .throwErrorInstance(new error_guard_1.ConflictError(TRANSFORMER_THROWN_ERROR_CODES.REALM_ALREADY_EXISTS))
    .equals('User exists with same username')
    .throwErrorInstance(new error_guard_1.ConflictError(TRANSFORMER_THROWN_ERROR_CODES.USER_ALREADY_EXISTS))
    .includes(['Could not find group', 'by id'])
    .throwErrorInstance(new error_guard_1.NotFoundError(TRANSFORMER_THROWN_ERROR_CODES.NO_GROUP_WITH_THAT_ID))
    .instanceOf(error_guard_1.NotFoundError)
    .pass()
    .includes(['401', 'Unauthorized'])
    .throwErrorInstance(new error_guard_1.InternalError(TRANSFORMER_THROWN_ERROR_CODES.KEYCLOAK_UNAUTHORIZED))
    .instanceOf(jose_1.errors.JWSInvalid)
    .throwErrorInstance(new error_guard_1.AuthorizationError(TRANSFORMER_THROWN_ERROR_CODES.INVALID_ACCESS_TOKEN));
exports.errorTransformer = new error_guard_1.ErrorTransformer({ errorMap: errorMapBuilder }, { log: 'never' });
//# sourceMappingURL=errorMap.js.map