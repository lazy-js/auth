import {
  IRole,
  IClientAuthConfig,
  PrimaryField,
  RegisterStatus,
  LoginStatus,
  IUser,
} from '../types';

export class ClientAuthConfig implements IClientAuthConfig {
  public primaryField: PrimaryField[];
  public registerStatus: RegisterStatus;
  public loginStatus: LoginStatus;
  public privateRegisterAccessRoles: IRole[];
  public verifiedByDefault: boolean;
  public builtInUser?: IUser;

  constructor(primaryField: PrimaryField[]) {
    this.primaryField = primaryField;
    this.registerStatus = 'public';
    this.loginStatus = 'enabled';
    this.privateRegisterAccessRoles = [];
    this.verifiedByDefault = false;
    this.builtInUser = undefined;
  }

  setRegisterConfig(
    status: RegisterStatus,
    verified?: boolean,
    privateAccessRoles?: IRole | IRole[],
  ): IClientAuthConfig {
    this.registerStatus = status;
    this.verifiedByDefault = !!verified;
    if (status === 'private' && privateAccessRoles) {
      this.privateRegisterAccessRoles = Array.isArray(privateAccessRoles)
        ? privateAccessRoles
        : [privateAccessRoles];
    }
    return this;
  }

  setLoginConfig(status: LoginStatus): IClientAuthConfig {
    this.loginStatus = status;
    return this;
  }

  setBuiltInUser(user: IUser): IClientAuthConfig {
    this.builtInUser = user;
    return this;
  }
}
