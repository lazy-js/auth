import { IClient, IRole, IGroup, IClientAuthConfig, Attribute, AttributeValue } from '../types';
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