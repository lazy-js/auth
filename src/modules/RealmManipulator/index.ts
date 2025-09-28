import { BadConfigError } from '@lazy-js/error-guard';
import { IRealm, IApp, IClient } from '../Realm';

interface IRealmManipulatorConfig {
    realm: IRealm;
    port: string;
    routerPrefix: string;
}

export class RealmManipulator {
    private realm: IRealm;
    private port: string;
    private routerPrefix: string;

    constructor(config: IRealmManipulatorConfig) {
        this.realm = config.realm;
        this.port = config.port;
        this.routerPrefix = config.routerPrefix;
    }

    /**
     * Get the realm name from the realm object
     */
    getRealmName(): string {
        return this.realm.name;
    }

    /**
     * Get all apps from the realm
     */
    getApps(): IApp[] {
        return this.realm.apps;
    }

    /**
     * Get all app names from the realm
     */
    getAppNames(): string[] {
        return this.getApps().map((app) => app.name);
    }

    /**
     * Get a specific app by name
     */
    getAppByName(appName: string): IApp | undefined {
        if (!this.getAppNames().includes(appName)) {
            throw new BadConfigError(`Unknown App Name: ${appName}`);
        }
        return this.getApps().find((app) => app.name === appName);
    }

    /**
     * Get all clients for a specific app
     */
    getAppClients(appName: string): IClient[] {
        return this.getAppByName(appName)?.clients || [];
    }

    /**
     * Alias for getAppClients - maintained for backward compatibility
     */
    getClients(): IClient[] {
        return this.getApps().flatMap((app) => app.clients);
    }

    /**
     * Get all client names for a specific app
     */
    getAppClientNames(appName: string): string[] {
        const appClients = this.getAppClients(appName);
        return appClients.map((client: IClient) => client.name);
    }

    /**
     * Get a specific client by name for a specific app
     */
    getAppClientByClientName(appName: string, clientName: string): IClient {
        if (!this.getAppClientNames(appName).includes(clientName)) {
            throw new BadConfigError(
                `Unknown Client Name for ${appName}. Client name: ${clientName}`,
            );
        }

        const requiredClient = this.getAppClients(appName).filter(
            (client: IClient) => {
                return client.name === clientName;
            },
        );

        return requiredClient[0];
    }

    /**
     * Alias for getAppClientByClientName - maintained for backward compatibility
     */
    getClientByName(appName: string, clientName: string): IClient {
        return this.getAppClientByClientName(appName, clientName);
    }

    /**
     * Check if an app exists in the realm
     */
    hasApp(appName: string): boolean {
        return this.getAppNames().includes(appName);
    }

    /**
     * Check if a client exists in a specific app
     */
    hasClient(appName: string, clientName: string): boolean {
        if (!this.hasApp(appName)) {
            return false;
        }
        return this.getAppClientNames(appName).includes(clientName);
    }

    /**
     * Get all clients across all apps
     */
    getAllClients(): { appName: string; client: IClient }[] {
        const allClients: { appName: string; client: IClient }[] = [];

        for (const appName of this.getAppNames()) {
            const clients = this.getAppClients(appName);
            for (const client of clients) {
                allClients.push({
                    appName,
                    client,
                });
            }
        }

        return allClients;
    }

    /**
     * Get realm configuration summary
     */
    getRealmSummary() {
        const realmName = this.getRealmName();
        console.log(`Realm: ${realmName}`);
        console.log('--------------------------------');
        console.log('Apps: ');
        const apps = this.getApps();
        apps.forEach((app) => {
            const clientsSummary = app.clients.map((client) => {
                const name = client.name;
                const verified =
                    client.clientAuthConfiguration.registerConfig.status ===
                        'public' &&
                    client.clientAuthConfiguration.registerConfig.verified;
                const registerStatus =
                    client.clientAuthConfiguration.registerConfig.status;
                const loginStatus =
                    client.clientAuthConfiguration.loginConfig.status;
                const clientUrl = `${this.routerPrefix}${client.appPath}/${client.name}`;
                const primaryFields =
                    client.clientAuthConfiguration.primaryFields.join(', ');
                return {
                    appName: app.name,
                    name,
                    primaryFields,
                    verified,
                    registerStatus,
                    registerUrl: `${clientUrl}/register`,
                    loginStatus,
                    loginUrl: `${clientUrl}/login`,
                };
            });

            clientsSummary.forEach((client) => {
                console.log('---------------' + client.name + ' ------------');
                console.log('name: ', client.name);
                console.log('methods', client.primaryFields);
                console.log(
                    'verified by default: ',
                    client.verified ? 'yes' : 'no',
                );
                console.log('login status: ', client.loginStatus);
                console.log('login url: ', client.loginUrl);
                console.log('register status: ', client.registerStatus);
                console.log('login url: ', client.registerUrl);
                console.log('---------------end of client ------------');
            });
            console.log('--------------------------------');
        });
    }
}
