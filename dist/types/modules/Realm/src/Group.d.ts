import { IRole, IGroup, Attribute, AttributeValue, GroupJson } from '../types';
export declare class Group implements IGroup {
    name: string;
    clientPath: string;
    clientName: string;
    groupAttributes: Attribute;
    roles: IRole[];
    rolesFlaten: string[];
    isDefault: boolean;
    constructor(name: string, isDefault: boolean);
    setClientName(name: string): IGroup;
    setClientPath(parentPath: string): IGroup;
    addAttribute(key: string, value: AttributeValue): IGroup;
    addRole(role: IRole): IGroup;
    addRoles(roles: IRole[]): IGroup;
    toJson(): GroupJson;
}
//# sourceMappingURL=Group.d.ts.map