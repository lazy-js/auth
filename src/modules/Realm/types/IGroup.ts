import { IRole } from './IRole';
import type { Attribute, AttributeValue } from './shared';

export interface IGroup {
  name: string;
  isDefault: boolean;
  clientName: string;
  setClientName(name: string): IGroup;

  clientPath: string;
  setClientPath(parentPath: string): IGroup;

  rolesFlaten: string[];
  roles: IRole[];
  addRole(role: IRole): IGroup;
  addRoles(roles: IRole[]): IGroup;

  groupAttributes: Attribute;
  addAttribute(key: string, value: AttributeValue): IGroup;

  toDto(): {
    name: string;
    isDefault: boolean;
    clientPath: string;
  };
}
