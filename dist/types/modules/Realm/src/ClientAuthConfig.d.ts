import { IClientAuthConfig, PrimaryField, IUser, RegisterConfig, LoginConfig } from '../types';
export declare class ClientAuthConfig implements IClientAuthConfig {
    readonly primaryFields: PrimaryField[];
    registerConfig: RegisterConfig;
    loginConfig: LoginConfig;
    builtInUser?: IUser;
    constructor(primaryFields: PrimaryField[]);
    setRegisterConfig(registerConfig: RegisterConfig): IClientAuthConfig;
    setLoginConfig(loginConfig: LoginConfig): IClientAuthConfig;
    setBuiltInUser(user: IUser): IClientAuthConfig;
}
//# sourceMappingURL=ClientAuthConfig.d.ts.map