export interface IRole {
    name: string;

    description: string;
    setDescription(desc: string): IRole;

    roles: IRole[];
    rolesFlaten: string[];
    addChildRole(role: IRole): IRole;
    addChildRoles(roles: IRole[]): IRole;

    hasChildren(): boolean;
}
