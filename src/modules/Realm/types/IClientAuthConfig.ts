import { IRole } from './IRole';
import type { PrimaryField, RegisterStatus, LoginStatus } from './shared';
import { IUser } from './IUser';

export interface IClientAuthConfig {
  primaryField: PrimaryField[];
  builtInUser?: IUser;
  registerStatus: RegisterStatus;
  verifiedByDefault: boolean;
  privateRegisterAccessRoles: IRole[];

  setRegisterConfig(
    status: RegisterStatus,
    verified: boolean,
    privateAccessRoles: IRole | IRole[],
  ): IClientAuthConfig;

  loginStatus: LoginStatus;
  setLoginConfig(status: LoginStatus): IClientAuthConfig;
  setBuiltInUser(user: IUser): IClientAuthConfig;
}
