import {
    AuthenticationError,
    AuthorizationError,
    ConflictError,
    InternalError,
    NotFoundError,
    ErrorMapBuilder,
    ErrorTransformer,
    CustomError,
} from '@lazy-js/error-guard';

import { errors as JOSE_ERRORS } from 'jose';

export const rollbackError = new InternalError({
    code: 'UNKNOWN_KEYCLOAK_ERROR',
    message: 'Unknown error',
});

const errorMapBuilder = new ErrorMapBuilder({
    globalProperty: 'message',
    rollbackError,
});

export enum MANUALLY_THROWN_ERROR_CODES {
    'NO_GROUP_WITH_THAT_PATH' = 'NO_GROUP_WITH_THAT_PATH',
    'NO_ROLE_WITH_THAT_ID' = 'NO_ROLE_WITH_THAT_ID',
    'NO_GROUP_WITH_THAT_ID' = 'NO_GROUP_WITH_THAT_ID',
    'UNKNOWN_ERROR_IN_KC_API' = 'UNKNOWN_ERROR_IN_KC_API',
    'DEFAULT_REALM_ROLE_NOT_FOUND' = 'DEFAULT_REALM_ROLE_NOT_FOUND',
}

enum TRANSFORMER_THROWN_ERROR_CODES {
    TOP_LEVEL_GROUP_ALREADY_EXISTS = 'TOP_LEVEL_GROUP_ALREADY_EXISTS',
    SUB_GROUP_ALREADY_EXISTS = 'SUB_GROUP_ALREADY_EXISTS',
    EXPIRED_ACCESS_TOKEN = 'EXPIRED_ACCESS_TOKEN',
    INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    REALM_ALREADY_EXISTS = 'REALM_ALREADY_EXISTS',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    NO_GROUP_WITH_THAT_ID = 'NO_GROUP_WITH_THAT_ID',
    KEYCLOAK_UNAUTHORIZED = 'KEYCLOAK_UNAUTHORIZED',
}
errorMapBuilder
    .instanceOf(CustomError)
    .pass()

    .includes(['Top level group', 'already exists'])
    .throwErrorInstance(
        new ConflictError(
            TRANSFORMER_THROWN_ERROR_CODES.TOP_LEVEL_GROUP_ALREADY_EXISTS,
        ),
    )

    .includes(['sibling group', 'already exists'])
    .throwErrorInstance(
        new ConflictError(
            TRANSFORMER_THROWN_ERROR_CODES.SUB_GROUP_ALREADY_EXISTS,
        ),
    )

    .instanceOf(JOSE_ERRORS.JWTExpired)
    .throwErrorInstance(
        new AuthenticationError(
            TRANSFORMER_THROWN_ERROR_CODES.EXPIRED_ACCESS_TOKEN,
        ),
    )

    .instanceOf(JOSE_ERRORS.JWTInvalid)
    .throwErrorInstance(
        new AuthenticationError(
            TRANSFORMER_THROWN_ERROR_CODES.INVALID_ACCESS_TOKEN,
        ),
    )

    .instanceOf(JOSE_ERRORS.JWSSignatureVerificationFailed)
    .throwErrorInstance(
        new AuthenticationError(
            TRANSFORMER_THROWN_ERROR_CODES.INVALID_ACCESS_TOKEN,
        ),
    )

    .includes(['invalid', 'grant'])
    .throwErrorInstance(
        new AuthenticationError(
            TRANSFORMER_THROWN_ERROR_CODES.INVALID_CREDENTIALS,
        ),
    )

    .includes(['Realm', 'already exists'])
    .throwErrorInstance(
        new ConflictError(TRANSFORMER_THROWN_ERROR_CODES.REALM_ALREADY_EXISTS),
    )

    .equals('User exists with same username')
    .throwErrorInstance(
        new ConflictError(TRANSFORMER_THROWN_ERROR_CODES.USER_ALREADY_EXISTS),
    )

    .includes(['Could not find group', 'by id'])
    .throwErrorInstance(
        new NotFoundError(TRANSFORMER_THROWN_ERROR_CODES.NO_GROUP_WITH_THAT_ID),
    )

    .instanceOf(NotFoundError)
    .pass()

    .includes(['401', 'Unauthorized'])
    .throwErrorInstance(
        new InternalError(TRANSFORMER_THROWN_ERROR_CODES.KEYCLOAK_UNAUTHORIZED),
    )

    .instanceOf(JOSE_ERRORS.JWSInvalid)
    .throwErrorInstance(
        new AuthorizationError(
            TRANSFORMER_THROWN_ERROR_CODES.INVALID_ACCESS_TOKEN,
        ),
    );

export const errorTransformer = new ErrorTransformer(
    { errorMap: errorMapBuilder },
    { log: 'never' },
);
