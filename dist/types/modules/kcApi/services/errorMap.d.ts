import { InternalError, ErrorTransformer } from '@lazy-js/error-guard';
export declare const rollbackError: InternalError;
export declare enum MANUALLY_THROWN_ERROR_CODES {
    'NO_GROUP_WITH_THAT_PATH' = "NO_GROUP_WITH_THAT_PATH",
    'NO_ROLE_WITH_THAT_ID' = "NO_ROLE_WITH_THAT_ID",
    'NO_GROUP_WITH_THAT_ID' = "NO_GROUP_WITH_THAT_ID",
    'UNKNOWN_ERROR_IN_KC_API' = "UNKNOWN_ERROR_IN_KC_API",
    'DEFAULT_REALM_ROLE_NOT_FOUND' = "DEFAULT_REALM_ROLE_NOT_FOUND"
}
export declare const errorTransformer: ErrorTransformer;
//# sourceMappingURL=errorMap.d.ts.map