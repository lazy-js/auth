export default {
    UNKNOWN_ERROR_IN_KC_API: {
        code: 'UNKNOWN_ERROR_IN_KC_API',
        label: 'Unknown error in KC API',
        category: 'Keycloak',
    }, // when create a composite (sub) role and parent role id is invaled
    PARENT_ROLE_NOT_EXISTS: {
        code: 'PARENT_ROLE_NOT_EXISTS',
        label: 'Parent role not exists',
        category: 'Keycloak',
    }, // when create a composite (sub) role and parent role id is invaled
    SUB_GROUP_ALREADY_EXISTS: {
        code: 'SUB_GROUP_ALREADY_EXISTS',
        label: 'Sub group already exists',
        category: 'Keycloak',
    }, // if a group with same name is already exists in the same level
    TOP_LEVEL_GROUP_ALREADY_EXISTS: {
        code: 'TOP_LEVEL_GROUP_ALREADY_EXISTS',
        label: 'Top level group already exists',
        category: 'Database',
    }, // if a group with same name is already exists in the same level
    NO_GROUP_WITH_THAT_PATH: {
        code: 'NO_GROUP_WITH_THAT_PATH',
        label: 'No group with that path',
        category: 'Database',
    },
    NO_ROLE_WITH_THAT_ID: {
        code: 'NO_ROLE_WITH_THAT_ID',
        label: 'No role with that id',
        category: 'Database',
    },
    NO_GROUP_WITH_THAT_ID: {
        code: 'NO_GROUP_WITH_THAT_ID',
        label: 'No group with that id',
        category: 'Database',
    },
    USER_ALREADY_EXISTS: {
        code: 'USER_ALREADY_EXISTS',
        label: 'User already exists',
        category: 'Database',
    },
    MULTIPLE_DEFAULT_GROUPS: {
        code: 'MULTIPLE_DEFAULT_GROUPS',
        label: 'Multiple default groups',
        category: 'Configuration',
    },
    NO_GROUP_WITH_THAT_NAME: {
        code: 'NO_GROUP_WITH_THAT_NAME',
        label: 'No group with that name',
        category: 'Database',
    },
    INVALID_USERNAME_OR_PASSWORD: {
        code: 'INVALID_USERNAME_OR_PASSWORD',
        label: 'Invalid username or password',
        category: 'service',
    },
    INVALID_EMAIL_OR_PASSWORD: {
        code: 'INVALID_EMAIL_OR_PASSWORD',
        label: 'Invalid email or password',
        category: 'service',
    },
    INVALID_PHONE_OR_PASSWORD: {
        code: 'INVALID_PHONE_OR_PASSWORD',
        label: 'Invalid phone or password',
        category: 'service',
    },
    INVALID_ACCESS_TOKEN: {
        code: 'INVALID_ACCESS_TOKEN',
        label: 'Invalid access token',
        category: 'service',
    },
    EXPIRED_ACCESS_TOKEN: {
        code: 'EXPIRED_ACCESS_TOKEN',
        label: 'Expired access token',
        category: 'service',
    },
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        label: 'Unauthorized',
        category: 'service',
    },
    INVALID_REFRESH_TOKEN: {
        code: 'INVALID_REFRESH_TOKEN',
        label: 'Invalid refresh token',
        category: 'service',
    },
    REGISTER_METHOD_REQUIRED: {
        code: 'REGISTER_METHOD_REQUIRED',
        label: 'Register method is required',
        category: 'validation',
    },
    NOT_SUPPORTED_REGISTER_METHOD: {
        code: 'NOT_SUPPORTED_REGISTER_METHOD',
        label: 'Not supported register method',
    },
    EMAIL_REQUIRED: {
        code: 'EMAIL_REQUIRED',
        label: 'Email is required',
        category: 'validation',
    },
    PHONE_REQUIRED: {
        code: 'PHONE_REQUIRED',
        label: 'Phone is required',
        category: 'validation',
    },
    USERNAME_REQUIRED: {
        code: 'USERNAME_REQUIRED',
        label: 'Username is required',
        category: 'validation',
    },
    PASSWORD_REQUIRED: {
        code: 'PASSWORD_REQUIRED',
        label: 'Password is required',
        category: 'validation',
    },
    USERNAME_INVALID: {
        code: 'USERNAME_INVALID',
        label: 'Username is invalid',
        category: 'validation',
    },
    EMAIL_INVALID: {
        code: 'EMAIL_INVALID',
        label: 'Email is invalid',
        category: 'validation',
    },
    PHONE_INVALID: {
        code: 'PHONE_INVALID',
        label: 'Phone is invalid',
        category: 'validation',
    },
    PASSWORD_INVALID: {
        code: 'PASSWORD_INVALID',
        label: 'Password is invalid',
        category: 'validation',
    },
    INVALID_LOGIN_METHOD: {
        code: 'INVALID_LOGIN_METHOD',
        label: 'Invalid login method',
        category: 'validation',
    },
    INVALID_CODE: {
        code: 'INVALID_CODE',
        label: 'Invalid code',
        category: 'validation',
    },
    USER_NOT_FOUND: {
        code: 'USER_NOT_FOUND',
        label: 'User not found',
        category: 'Database',
    },
    EMAIL_ALREADY_VERIFIED: {
        code: 'EMAIL_ALREADY_VERIFIED',
        label: 'Email already verified',
        category: 'Database',
    },
    CODE_EXPIRED: {
        code: 'CODE_EXPIRED',
        label: 'Code expired',
        category: 'Database',
    },
    EMAIL_NOT_VERIFIED: {
        code: 'EMAIL_NOT_VERIFIED',
        label: 'Email not verified',
        category: 'Database',
    },
};
//# sourceMappingURL=errors.js.map