export class Realm {
    constructor(name, seperatedUserCollections) {
        this.name = name;
        this.realmAttributes = {};
        this.seperatedUserCollections = !!seperatedUserCollections;
        this.apps = [];
    }
    addApp(app) {
        app.setRealmName(this.name);
        app.setRealmPath('/' + this.name);
        this.apps.push(app);
        return this;
    }
    setIsSeperatedUserCollections(v) {
        this.seperatedUserCollections = v;
        return this;
    }
    addGlobalAttribute(key, value) {
        const _value = Array.isArray(value) ? value : [value];
        const preValue = this.realmAttributes[key] || [];
        this.realmAttributes[key] = [...preValue, ..._value];
        return this;
    }
}
//# sourceMappingURL=Realm.js.map