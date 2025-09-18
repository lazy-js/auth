import { IClient, IRole, IGroup, IClientAuthConfig, Attribute, AttributeValue } from '../types';
/**
 * @description this is thr client Constructor for creating clients that are parts of apps
 * let us suppose we have an app that has a mobile app and a dashboard app
 * both of mobile and dashboard will have seperate clients becuase of seperate roles and groups
 */
export declare class Client implements IClient {
    name: string;
    clientId: string;
    appPath: string;
    appName: string;
    clientDescription: string;
    rolesTree: IRole[];
    groups: IGroup[];
    globalRoles: IRole[];
    clientAuthConfiguration: IClientAuthConfig;
    clientAttributes: Attribute;
    constructor(name: string, clientAuthConfiguration: IClientAuthConfig);
    addGroup(group: IGroup): IClient;
    setAppName(name: string): IClient;
    setAppPath(parentPath: string): IClient;
    setClientDescription(descrioption: string): IClient;
    setGroupAttributesSchema(schema: any): IClient;
    setClientAttributesSchema(schema: any): IClient;
    addGlobalAttribute(key: string, value: AttributeValue): IClient;
    registerRole(role: IRole): IClient;
    registerRoles(roles: IRole[]): IClient;
    applyGlobalRole(role: IRole): IClient;
}
//# sourceMappingURL=Client.d.ts.map