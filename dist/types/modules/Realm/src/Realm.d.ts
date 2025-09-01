import { IRealm, IApp, Attribute, AttributeValue } from '../types';
export declare class Realm implements IRealm {
    name: string;
    apps: IApp[];
    realmAttributes: Attribute;
    seperatedUserCollections: boolean;
    constructor(name: string, seperatedUserCollections?: boolean);
    addApp(app: IApp): IRealm;
    setIsSeperatedUserCollections(v: boolean): IRealm;
    addGlobalAttribute(key: string, value: AttributeValue): IRealm;
}
//# sourceMappingURL=Realm.d.ts.map