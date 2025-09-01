import { IRole } from '../types';
export declare class Role implements IRole {
    name: string;
    description: string;
    roles: IRole[];
    rolesFlaten: string[];
    constructor(name: string);
    hasChildren(): boolean;
    addChildRole(role: IRole): IRole;
    setDescription(desc: string): IRole;
    addChildRoles(roles: IRole[]): IRole;
}
//# sourceMappingURL=Role.d.ts.map