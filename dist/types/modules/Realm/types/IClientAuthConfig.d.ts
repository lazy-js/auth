import { IRole } from './IRole';
import type { PrimaryField, RegisterStatus, LoginStatus } from './shared';
import { IUser } from './IUser';
interface RegisterConfigBase {
    status: RegisterStatus;
}
interface PrivateRegisterConfig extends RegisterConfigBase {
    status: 'private';
    privateAccessRoles: IRole[];
}
interface PublicRegisterConfig extends RegisterConfigBase {
    status: 'public';
    verified: boolean;
}
interface DisabledRegisterConfig extends RegisterConfigBase {
    status: 'disabled';
}
export type RegisterConfig = PrivateRegisterConfig | PublicRegisterConfig | DisabledRegisterConfig;
export interface LoginConfig {
    status: LoginStatus;
}
export interface IClientAuthConfig {
    primaryFields: PrimaryField[];
    builtInUser?: IUser;
    registerConfig: RegisterConfig;
    loginConfig: LoginConfig;
    setRegisterConfig(registerConfig: RegisterConfig): IClientAuthConfig;
    setLoginConfig(loginConfig: LoginConfig): IClientAuthConfig;
    setBuiltInUser(user: IUser): IClientAuthConfig;
}
export {};
//# sourceMappingURL=IClientAuthConfig.d.ts.map