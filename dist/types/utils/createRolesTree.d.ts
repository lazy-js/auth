import { IRole } from "../modules/Realm";
export interface RoleItem {
    name: string;
    childRoles?: RoleItem[];
}
export declare function createRolesTree(roles: RoleItem[]): IRole[];
//# sourceMappingURL=createRolesTree.d.ts.map