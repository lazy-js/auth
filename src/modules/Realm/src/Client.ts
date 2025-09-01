import {
  IClient,
  IRole,
  IGroup,
  IClientAuthConfig,
  Attribute,
  AttributeValue,
} from '../types';

export class Client implements IClient {
  public name: string;
  public clientId: string;
  public appPath: string;
  public appName: string;
  public clientDescription: string;

  public rolesTree: IRole[];
  public groups: IGroup[];
  public globalRoles: IRole[];

  public clientAuthConfiguration: IClientAuthConfig;
  public clientAttributes: Attribute;

  constructor(name: string, clientAuthConfiguration: IClientAuthConfig) {
    this.name = name;
    this.clientId = '';
    this.clientAuthConfiguration = clientAuthConfiguration;
    this.appPath = ''; // will be set by parent
    this.appName = ''; // will be set by parent
    this.clientDescription = '';
    this.groups = [];
    this.rolesTree = [];
    this.globalRoles = [];
    this.clientAttributes = {};
  }

  addGroup(group: IGroup): IClient {
    if (group.isDefault) {
      const defaultGroup = this.groups.find((g) => g.isDefault);
      if (defaultGroup)
        throw new Error('Each client should contain only one default group');
    }
    group.setClientName(this.name);
    group.setClientPath(this.appPath + '/' + this.appName);
    this.groups.push(group);
    return this;
  }

  setAppName(name: string): IClient {
    this.appName = name;
    this.clientId = this.appName + '-' + this.name;
    return this;
  }

  setAppPath(parentPath: string): IClient {
    this.appPath = parentPath;
    this.groups.forEach((group) => {
      group.setClientPath(this.appPath + '/' + this.name);
    });
    return this;
  }

  setClientDescription(descrioption: string): IClient {
    this.clientDescription = descrioption;
    return this;
  }

  setGroupAttributesSchema(schema: any): IClient {
    return this;
  }

  setClientAttributesSchema(schema: any): IClient {
    return this;
  }

  addGlobalAttribute(key: string, value: AttributeValue): IClient {
    const _value = Array.isArray(value) ? value : [value];

    const preValue = this.clientAttributes[key] || [];
    this.clientAttributes[key] = [...preValue, ..._value];

    return this;
  }

  registerRole(role: IRole): IClient {
    this.rolesTree.push(role);
    return this;
  }

  registerRoles(roles: IRole[]): IClient {
    roles.map((role) => {
      this.registerRole(role);
    });

    return this;
  }

  applyGlobalRole(role: IRole): IClient {
    this.globalRoles.push(role);
    return this;
  }
}
