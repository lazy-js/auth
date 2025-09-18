/**
 * @description this is thr client Constructor for creating clients that are parts of apps
 * let us suppose we have an app that has a mobile app and a dashboard app
 * both of mobile and dashboard will have seperate clients becuase of seperate roles and groups
 */
export class Client {
    constructor(name, clientAuthConfiguration) {
        this.name = name;
        this.clientId = "";
        this.clientAuthConfiguration = clientAuthConfiguration;
        this.appPath = ""; // will be set by parent
        this.appName = ""; // will be set by parent
        this.clientDescription = "";
        this.groups = [];
        this.rolesTree = [];
        this.globalRoles = [];
        this.clientAttributes = {};
    }
    addGroup(group) {
        if (group.isDefault) {
            const defaultGroup = this.groups.find((g) => g.isDefault);
            if (defaultGroup)
                throw new Error("Each client should contain only one default group");
        }
        group.setClientName(this.name);
        group.setClientPath(this.appPath + "/" + this.appName);
        this.groups.push(group);
        return this;
    }
    setAppName(name) {
        this.appName = name;
        this.clientId = this.appName + "-" + this.name;
        return this;
    }
    setAppPath(parentPath) {
        this.appPath = parentPath;
        this.groups.forEach((group) => {
            group.setClientPath(this.appPath + "/" + this.name);
        });
        return this;
    }
    setClientDescription(descrioption) {
        this.clientDescription = descrioption;
        return this;
    }
    setGroupAttributesSchema(schema) {
        return this;
    }
    setClientAttributesSchema(schema) {
        return this;
    }
    addGlobalAttribute(key, value) {
        const _value = Array.isArray(value) ? value : [value];
        const preValue = this.clientAttributes[key] || [];
        this.clientAttributes[key] = [...preValue, ..._value];
        return this;
    }
    registerRole(role) {
        this.rolesTree.push(role);
        return this;
    }
    registerRoles(roles) {
        roles.map((role) => {
            this.registerRole(role);
        });
        return this;
    }
    applyGlobalRole(role) {
        this.globalRoles.push(role);
        return this;
    }
}
//# sourceMappingURL=Client.js.map