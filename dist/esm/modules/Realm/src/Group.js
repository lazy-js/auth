export class Group {
    constructor(name, isDefault) {
        this.name = name;
        this.isDefault = isDefault;
        this.roles = [];
        this.rolesFlaten = [];
        this.groupAttributes = {};
        this.clientName = '';
        this.clientPath = '';
    }
    setClientName(name) {
        this.clientName = name;
        return this;
    }
    setClientPath(parentPath) {
        this.clientPath = parentPath;
        return this;
    }
    addAttribute(key, value) {
        const _value = Array.isArray(value) ? value : [value];
        const preValue = this.groupAttributes[key] || [];
        this.groupAttributes[key] = [...preValue, ..._value];
        return this;
    }
    addRole(role) {
        this.rolesFlaten = [...this.rolesFlaten, ...role.rolesFlaten];
        this.roles.push(role);
        return this;
    }
    addRoles(roles) {
        roles.map((role) => this.addRole(role));
        return this;
    }
    toJson() {
        return {
            name: this.name,
            isDefault: this.isDefault,
            clientName: this.clientName,
            clientPath: this.clientPath,
        };
    }
}
//# sourceMappingURL=Group.js.map