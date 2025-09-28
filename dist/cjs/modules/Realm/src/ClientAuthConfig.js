"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAuthConfig = void 0;
const error_guard_1 = require("@lazy-js/error-guard");
class ClientAuthConfig {
    constructor(primaryFields) {
        if (!primaryFields || primaryFields.length === 0) {
            throw new error_guard_1.BadConfigError('At least one primary field must be specified');
        }
        this.primaryFields = primaryFields;
        this.registerConfig = {
            status: 'public',
            verified: false,
        };
        this.loginConfig = {
            status: 'enabled',
        };
        this.builtInUser = undefined;
    }
    setRegisterConfig(registerConfig) {
        this.registerConfig = registerConfig;
        return this;
    }
    setLoginConfig(loginConfig) {
        this.loginConfig = loginConfig;
        return this;
    }
    setBuiltInUser(user) {
        this.builtInUser = user;
        return this;
    }
}
exports.ClientAuthConfig = ClientAuthConfig;
//# sourceMappingURL=ClientAuthConfig.js.map