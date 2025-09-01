import { IClient, IApp, Attribute, AttributeValue } from '../types';
export declare class App implements IApp {
    name: string;
    clients: IClient[];
    realmName: string;
    realmPath: string;
    appAttributes: Attribute;
    constructor(name: string);
    setRealmPath(realmPath: string): IApp;
    setRealmName(name: string): IApp;
    addClient(client: IClient): IApp;
    addClients(clients: IClient[]): IApp;
    addGlobalAttribute(key: string, value: AttributeValue): IApp;
}
//# sourceMappingURL=App.d.ts.map