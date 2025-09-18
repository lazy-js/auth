import { IClient, IApp, Attribute, AttributeValue } from "../types";

export class App implements IApp {
    public name: string;
    public clients: IClient[];
    public realmName: string;
    public realmPath: string;
    public appAttributes: Attribute;
    constructor(name: string) {
        this.name = name;
        this.realmName = "";
        this.realmPath = "";
        this.appAttributes = {};
        this.clients = [];
    }

    setRealmPath(realmPath: string): IApp {
        this.realmPath = realmPath;
        this.clients.forEach((client) => {
            client.setAppPath(this.realmPath + "/" + this.name);
        });
        return this;
    }

    setRealmName(name: string): IApp {
        this.realmName = name;
        return this;
    }

    addClient(client: IClient): IApp {
        client.setAppName(this.name);
        client.setAppPath(this.realmPath + "/" + this.name);

        if (!client.groups.some((group) => group.isDefault)) {
            throw new Error("Each Client must contain a default group");
        }

        this.clients.push(client);
        return this;
    }

    addClients(clients: IClient[]): IApp {
        clients.map((client) => this.addClient(client));
        return this;
    }
    addGlobalAttribute(key: string, value: AttributeValue): IApp {
        const _value = Array.isArray(value) ? value : [value];

        const preValue = this.appAttributes[key] || [];
        this.appAttributes[key] = [...preValue, ..._value];

        return this;
    }
}
