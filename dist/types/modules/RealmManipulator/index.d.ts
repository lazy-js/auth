import { IRealm, IApp, IClient } from '../Realm';
interface IRealmManipulatorConfig {
    realm: IRealm;
    port: string;
    routerPrefix: string;
}
export declare class RealmManipulator {
    private realm;
    private port;
    private routerPrefix;
    constructor(config: IRealmManipulatorConfig);
    /**
     * Get the realm name from the realm object
     */
    getRealmName(): string;
    /**
     * Get all apps from the realm
     */
    getApps(): IApp[];
    /**
     * Get all app names from the realm
     */
    getAppNames(): string[];
    /**
     * Get a specific app by name
     */
    getAppByName(appName: string): IApp | undefined;
    /**
     * Get all clients for a specific app
     */
    getAppClients(appName: string): IClient[];
    /**
     * Alias for getAppClients - maintained for backward compatibility
     */
    getClients(): IClient[];
    /**
     * Get all client names for a specific app
     */
    getAppClientNames(appName: string): string[];
    /**
     * Get a specific client by name for a specific app
     */
    getAppClientByClientName(appName: string, clientName: string): IClient;
    /**
     * Alias for getAppClientByClientName - maintained for backward compatibility
     */
    getClientByName(appName: string, clientName: string): IClient;
    /**
     * Check if an app exists in the realm
     */
    hasApp(appName: string): boolean;
    /**
     * Check if a client exists in a specific app
     */
    hasClient(appName: string, clientName: string): boolean;
    /**
     * Get all clients across all apps
     */
    getAllClients(): {
        appName: string;
        client: IClient;
    }[];
    /**
     * Get realm configuration summary
     */
    getRealmSummary(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map