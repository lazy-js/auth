"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorTransformer = exports.defaultError = exports.errorMap = void 0;
const Error_1 = require("../../../error/src/Error");
const ErrorTransformer_1 = require("../../../error/src/ErrorTransformer");
const jose_1 = require("jose");
exports.errorMap = [
    {
        input: {
            condition: "includes",
            messageParts: ["Top level group", "already exists"],
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.ConflictError({
                code: "TOP_LEVEL_GROUP_ALREADY_EXISTS",
                label: "top level group already exists",
            }),
        },
    },
    {
        input: {
            condition: "includes",
            messageParts: ["sibling group", "already exists"],
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.ConflictError({
                code: "SUB_GROUP_ALREADY_EXISTS",
                label: "Sub group already exists",
            }),
        },
    },
    {
        input: {
            condition: "instanceOf",
            error: Error_1.ConflictError,
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.ConflictError({
                code: "SUB_GROUP_ALREADY_EXISTS",
                label: "Sub group already exists",
            }),
        },
    },
    {
        input: {
            condition: "instanceOf",
            error: jose_1.errors.JWTExpired,
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.AuthenticationError({
                code: "EXPIRED_ACCESS_TOKEN",
                label: "Expired access token",
            }),
        },
    },
    {
        input: {
            condition: "instanceOf",
            error: jose_1.errors.JWTInvalid,
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.AuthenticationError({
                code: "INVALID_ACCESS_TOKEN",
                label: "Invalid access token",
            }),
        },
    },
    {
        input: {
            condition: "instanceOf",
            error: jose_1.errors.JWSSignatureVerificationFailed,
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.AuthenticationError({
                code: "INVALID_ACCESS_TOKEN",
                label: "Invalid access token",
            }),
        },
    },
    {
        input: {
            condition: "includes",
            messageParts: ["invalid", "grant"],
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.AuthenticationError({
                code: "INVALID_GRANT",
                label: "Invalid grant",
            }),
        },
    },
    {
        input: {
            condition: "includes",
            messageParts: ["Realm", "already exists"],
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.ConflictError({
                code: "REALM_ALREADY_EXISTS",
                label: "REALM ALREADY EXISTS",
            }),
        },
    },
    {
        input: {
            condition: "equals",
            message: "User exists with same username",
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.ConflictError({
                code: "USER_ALREADY_EXISTS",
                label: "user with that username already exists",
            }),
        },
    },
    {
        input: {
            condition: "includes",
            messageParts: ["Could not find group", "by id"],
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.NotFoundError({
                code: "GROUP_NOT_FOUND",
                label: "no group with that id",
            }),
        },
    },
    {
        input: {
            condition: "instanceOf",
            error: Error_1.NotFoundError,
        },
        output: "pass",
    },
    {
        input: {
            condition: "includes",
            messageParts: ["401", "Unauthorized"],
        },
        output: {
            type: "ErrorInstance",
            error: new Error_1.AuthorizationError({
                code: "KEYCLOAK_UNAUTHORIZED",
                label: "keycloak unthorized",
            })
        }
    },
];
exports.defaultError = new Error_1.InternalError({
    code: "UNKNOWN_KEYCLOAK_ERROR",
    label: "Unknown error",
});
exports.errorTransformer = new ErrorTransformer_1.ErrorTransformer(exports.errorMap, exports.defaultError, {
    messagePropertyName: "message",
    log: "all",
});
//# sourceMappingURL=errorMap.js.map