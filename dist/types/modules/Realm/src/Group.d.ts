import { IRole, IGroup, Attribute, AttributeValue } from '../types';
export declare class Group implements IGroup {
    name: string;
    clientPath: string;
    clientName: string;
    groupAttributes: Attribute;
    roles: IRole[];
    rolesFlaten: string[];
    isDefault: boolean;
    constructor(name: string, isDefualt: boolean);
    setClientName(name: string): IGroup;
    setClientPath(parentPath: string): IGroup;
    addAttribute(key: string, value: AttributeValue): IGroup;
    addRole(role: IRole): IGroup;
    addRoles(roles: IRole[]): IGroup;
    toDto(): {
        name: string;
        isDefault: boolean;
        clientName: string;
        clientPath: string;
    };
}
//# sourceMappingURL=Group.d.ts.map