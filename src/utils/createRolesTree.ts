import { IRole, Role } from '../modules/Realm';

export interface RoleItem {
    name: string;
    childRoles?: RoleItem[];
}
export function createRolesTree(roles: RoleItem[]): IRole[] {
    const _roles: IRole[] = [];
    roles.forEach((role) => {
        const _role = new Role(role.name);
        if (role.childRoles && role.childRoles.length) {
            role.childRoles.forEach((cRole) => {
                const _cRole = new Role(cRole.name);
                _role.addChildRole(_cRole);
            });
        }
        _roles.push(_role);
    });
    return _roles;
}
