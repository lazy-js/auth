import { IClientAuthConfig, PrimaryField, IUser, RegisterConfig, LoginConfig } from "../types";

export class ClientAuthConfig implements IClientAuthConfig {
    public readonly primaryFields: PrimaryField[];
    public registerConfig: RegisterConfig;
    public loginConfig: LoginConfig;
    public builtInUser?: IUser;

    constructor(primaryFields: PrimaryField[]) {
        if (!primaryFields || primaryFields.length === 0) {
            throw new Error("At least one primary field must be specified");
        }
        this.primaryFields = primaryFields;
        this.registerConfig = {
            status: "public",
            verified: false,
        };
        this.loginConfig = {
            status: "enabled",
        };
        this.builtInUser = undefined;
    }

    setRegisterConfig(registerConfig: RegisterConfig): IClientAuthConfig {
        this.registerConfig = registerConfig;
        return this;
    }

    setLoginConfig(loginConfig: LoginConfig): IClientAuthConfig {
        this.loginConfig = loginConfig;
        return this;
    }

    setBuiltInUser(user: IUser): IClientAuthConfig {
        this.builtInUser = user;
        return this;
    }
}
