"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRolesTree = createRolesTree;
const Realm_1 = require("../modules/Realm");
function createRolesTree(roles) {
    const _roles = [];
    roles.forEach((role) => {
        const _role = new Realm_1.Role(role.name);
        if (role.childRoles && role.childRoles.length) {
            role.childRoles.forEach((cRole) => {
                const _cRole = new Realm_1.Role(cRole.name);
                _role.addChildRole(_cRole);
            });
        }
        _roles.push(_role);
    });
    return _roles;
}
//# sourceMappingURL=createRolesTree.js.map