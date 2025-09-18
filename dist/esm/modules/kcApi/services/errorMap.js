import { AuthenticationError, AuthorizationError, ConflictError, InternalError, NotFoundError, } from '../../../error/src/Error';
import { ErrorTransformer, } from '../../../error/src/ErrorTransformer';
import { errors as joseErrors } from 'jose';
export const errorMap = [
    {
        input: {
            condition: 'includes',
            messageParts: ['Top level group', 'already exists'],
        },
        output: {
            type: 'ErrorInstance',
            error: new ConflictError({
                code: 'TOP_LEVEL_GROUP_ALREADY_EXISTS',
                label: 'top level group already exists',
            }),
        },
    },
    {
        input: {
            condition: 'includes',
            messageParts: ['sibling group', 'already exists'],
        },
        output: {
            type: 'ErrorInstance',
            error: new ConflictError({
                code: 'SUB_GROUP_ALREADY_EXISTS',
                label: 'Sub group already exists',
            }),
        },
    },
    {
        input: {
            condition: 'instanceOf',
            error: ConflictError,
        },
        output: {
            type: 'ErrorInstance',
            error: new ConflictError({
                code: 'SUB_GROUP_ALREADY_EXISTS',
                label: 'Sub group already exists',
            }),
        },
    },
    {
        input: {
            condition: 'instanceOf',
            error: joseErrors.JWTExpired,
        },
        output: {
            type: 'ErrorInstance',
            error: new AuthenticationError({
                code: 'EXPIRED_ACCESS_TOKEN',
                label: 'Expired access token',
            }),
        },
    },
    {
        input: {
            condition: 'instanceOf',
            error: joseErrors.JWTInvalid,
        },
        output: {
            type: 'ErrorInstance',
            error: new AuthenticationError({
                code: 'INVALID_ACCESS_TOKEN',
                label: 'Invalid access token',
            }),
        },
    },
    {
        input: {
            condition: 'instanceOf',
            error: joseErrors.JWSSignatureVerificationFailed,
        },
        output: {
            type: 'ErrorInstance',
            error: new AuthenticationError({
                code: 'INVALID_ACCESS_TOKEN',
                label: 'Invalid access token',
            }),
        },
    },
    {
        input: {
            condition: 'includes',
            messageParts: ['invalid', 'grant'],
        },
        output: {
            type: 'ErrorInstance',
            error: new AuthenticationError({
                code: 'INVALID_CREDENTIALS',
                label: 'Invalid credentials',
            }),
        },
    },
    {
        input: {
            condition: 'includes',
            messageParts: ['Realm', 'already exists'],
        },
        output: {
            type: 'ErrorInstance',
            error: new ConflictError({
                code: 'REALM_ALREADY_EXISTS',
                label: 'REALM ALREADY EXISTS',
            }),
        },
    },
    {
        input: {
            condition: 'equals',
            message: 'User exists with same username',
        },
        output: {
            type: 'ErrorInstance',
            error: new ConflictError({
                code: 'USER_ALREADY_EXISTS',
                label: 'user with that username already exists',
            }),
        },
    },
    {
        input: {
            condition: 'includes',
            messageParts: ['Could not find group', 'by id'],
        },
        output: {
            type: 'ErrorInstance',
            error: new NotFoundError({
                code: 'GROUP_NOT_FOUND',
                label: 'no group with that id',
            }),
        },
    },
    {
        input: {
            condition: 'instanceOf',
            error: NotFoundError,
        },
        output: 'pass',
    },
    {
        input: {
            condition: 'includes',
            messageParts: ['401', 'Unauthorized'],
        },
        output: {
            type: 'ErrorInstance',
            error: new AuthorizationError({
                code: 'KEYCLOAK_UNAUTHORIZED',
                label: 'keycloak unthorized',
            }),
        },
    },
    {
        input: {
            condition: 'instanceOf',
            error: joseErrors.JWSInvalid,
        },
        output: {
            type: 'ErrorInstance',
            error: new AuthorizationError({
                code: 'INVALID_ACCESS_TOKEN',
                label: 'invalid access token',
            }),
        },
    },
];
export const defaultError = new InternalError({
    code: 'UNKNOWN_KEYCLOAK_ERROR',
    label: 'Unknown error',
});
export const errorTransformer = new ErrorTransformer(errorMap, defaultError, {
    messagePropertyName: 'message',
    log: 'all',
});
//# sourceMappingURL=errorMap.js.map