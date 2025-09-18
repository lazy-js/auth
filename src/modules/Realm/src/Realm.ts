import { IRealm, IApp, Attribute, AttributeValue } from '../types';

export class Realm implements IRealm {
    public name: string;
    public apps: IApp[];
    public realmAttributes: Attribute;
    public seperatedUserCollections: boolean;

    constructor(name: string, seperatedUserCollections?: boolean) {
        this.name = name;
        this.realmAttributes = {};
        this.seperatedUserCollections = !!seperatedUserCollections;
        this.apps = [];
    }

    addApp(app: IApp): IRealm {
        app.setRealmName(this.name);
        app.setRealmPath('/' + this.name);
        this.apps.push(app);
        return this;
    }

    setIsSeperatedUserCollections(v: boolean): IRealm {
        this.seperatedUserCollections = v;
        return this;
    }

    addGlobalAttribute(key: string, value: AttributeValue): IRealm {
        const _value = Array.isArray(value) ? value : [value];
        const preValue = this.realmAttributes[key] || [];
        this.realmAttributes[key] = [...preValue, ..._value];

        return this;
    }
}
