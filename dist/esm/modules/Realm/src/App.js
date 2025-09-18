export class App {
    constructor(name) {
        this.name = name;
        this.realmName = "";
        this.realmPath = "";
        this.appAttributes = {};
        this.clients = [];
    }
    setRealmPath(realmPath) {
        this.realmPath = realmPath;
        this.clients.forEach((client) => {
            client.setAppPath(this.realmPath + "/" + this.name);
        });
        return this;
    }
    setRealmName(name) {
        this.realmName = name;
        return this;
    }
    addClient(client) {
        client.setAppName(this.name);
        client.setAppPath(this.realmPath + "/" + this.name);
        if (!client.groups.some((group) => group.isDefault)) {
            throw new Error("Each Client must contain a default group");
        }
        this.clients.push(client);
        return this;
    }
    addClients(clients) {
        clients.map((client) => this.addClient(client));
        return this;
    }
    addGlobalAttribute(key, value) {
        const _value = Array.isArray(value) ? value : [value];
        const preValue = this.appAttributes[key] || [];
        this.appAttributes[key] = [...preValue, ..._value];
        return this;
    }
}
//# sourceMappingURL=App.js.map