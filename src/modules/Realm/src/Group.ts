import { IRole, IGroup, Attribute, AttributeValue } from '../types';

export class Group implements IGroup {
  public name: string;
  public clientPath: string;
  public clientName: string;

  public groupAttributes: Attribute;
  public roles: IRole[];
  public rolesFlaten: string[];
  public isDefault: boolean;

  constructor(name: string, isDefualt: boolean) {
    this.name = name;
    this.isDefault = isDefualt;
    this.roles = [];
    this.rolesFlaten = [];
    this.groupAttributes = {};
    this.clientName = '';
    this.clientPath = '';
  }

  setClientName(name: string): IGroup {
    this.clientName = name;
    return this;
  }

  setClientPath(parentPath: string): IGroup {
    this.clientPath = parentPath;
    return this;
  }

  addAttribute(key: string, value: AttributeValue): IGroup {
    const _value = Array.isArray(value) ? value : [value];

    const preValue = this.groupAttributes[key] || [];
    this.groupAttributes[key] = [...preValue, ..._value];

    return this;
  }

  addRole(role: IRole): IGroup {
    this.rolesFlaten = [...this.rolesFlaten, ...role.rolesFlaten];
    this.roles.push(role);
    return this;
  }

  addRoles(roles: IRole[]): IGroup {
    roles.map((role) => this.addRole(role));
    return this;
  }

  toDto(): {
    name: string;
    isDefault: boolean;
    clientName: string;
    clientPath: string;
  } {
    return {
      name: this.name,
      isDefault: this.isDefault,
      clientName: this.clientName,
      clientPath: this.clientPath,
    };
  }
}
