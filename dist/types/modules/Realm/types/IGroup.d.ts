import { IRole } from './IRole';
import type { Attribute, AttributeValue } from './shared';
export interface GroupJson {
    name: string;
    isDefault: boolean;
    clientPath: string;
    clientName: string;
}
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
    toJson(): GroupJson;
}
//# sourceMappingURL=IGroup.d.ts.map