import { IRole } from './IRole';
import { IGroup } from './IGroup';
import { IClientAuthConfig } from './IClientAuthConfig';
import type { Attribute, AttributeValue } from './shared';

export interface IClient {
  name: string;
  clientId: string;
  clientAuthConfiguration: IClientAuthConfig;

  appPath: string;
  setAppPath(parentPath: string): IClient;
  appName: string;
  setAppName(name: string): IClient;
  clientDescription: string;
  setClientDescription(descrioption: string): IClient;

  rolesTree: IRole[];
  registerRole(role: IRole): IClient;
  registerRoles(roles: IRole[]): IClient;

  groups: IGroup[];
  addGroup(group: IGroup): IClient;
  globalRoles: IRole[];
  applyGlobalRole(role: IRole): IClient;

  clientAttributes: Attribute;
  addGlobalAttribute(key: string, value: AttributeValue): IClient;

  setClientAttributesSchema(schema: any): IClient;

  setGroupAttributesSchema(schema: any): IClient;
}
