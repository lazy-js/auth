import { Role } from "../modules/Realm";
export function createRolesTree(roles) {
    const _roles = [];
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
//# sourceMappingURL=createRolesTree.js.map