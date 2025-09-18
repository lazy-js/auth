import { IClient } from './IClient';
import type { Attribute, AttributeValue } from './shared';

export interface IApp {
    name: string;

    realmPath: string;
    setRealmPath(realmPath: string): IApp;
    realmName: string;
    setRealmName(name: string): IApp;

    clients: IClient[];
    addClient(client: IClient): IApp;
    addClients(clients: IClient[]): IApp;

    appAttributes: Attribute;
    addGlobalAttribute(key: string, value: AttributeValue): IApp;
}
