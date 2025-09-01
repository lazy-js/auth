"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
class Role {
    constructor(name) {
        this.name = name;
        this.description = '';
        this.roles = [];
        this.rolesFlaten = [name];
    }
    hasChildren() {
        return !!this.roles.length;
    }
    addChildRole(role) {
        this.rolesFlaten = [...this.rolesFlaten, ...role.rolesFlaten];
        this.roles.push(role);
        return this;
    }
    setDescription(desc) {
        this.description = desc;
        return this;
    }
    addChildRoles(roles) {
        roles.map((role) => this.addChildRole(role));
        return this;
    }
}
exports.Role = Role;
//# sourceMappingURL=Role.js.map