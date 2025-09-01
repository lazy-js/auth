export class ClientAuthConfig {
    constructor(primaryField) {
        this.primaryField = primaryField;
        this.registerStatus = 'public';
        this.loginStatus = 'enabled';
        this.privateRegisterAccessRoles = [];
        this.verifiedByDefault = false;
        this.builtInUser = undefined;
    }
    setRegisterConfig(status, verified, privateAccessRoles) {
        this.registerStatus = status;
        this.verifiedByDefault = !!verified;
        if (status === 'private' && privateAccessRoles) {
            this.privateRegisterAccessRoles = Array.isArray(privateAccessRoles)
                ? privateAccessRoles
                : [privateAccessRoles];
        }
        return this;
    }
    setLoginConfig(status) {
        this.loginStatus = status;
        return this;
    }
    setBuiltInUser(user) {
        this.builtInUser = user;
        return this;
    }
}
//# sourceMappingURL=ClientAuthConfig.js.map