import { IRole, IClientAuthConfig, PrimaryField, RegisterStatus, LoginStatus, IUser } from '../types';
export declare class ClientAuthConfig implements IClientAuthConfig {
    primaryField: PrimaryField[];
    registerStatus: RegisterStatus;
    loginStatus: LoginStatus;
    privateRegisterAccessRoles: IRole[];
    verifiedByDefault: boolean;
    builtInUser?: IUser;
    constructor(primaryField: PrimaryField[]);
    setRegisterConfig(status: RegisterStatus, verified?: boolean, privateAccessRoles?: IRole | IRole[]): IClientAuthConfig;
    setLoginConfig(status: LoginStatus): IClientAuthConfig;
    setBuiltInUser(user: IUser): IClientAuthConfig;
}
//# sourceMappingURL=ClientAuthConfig.d.ts.map