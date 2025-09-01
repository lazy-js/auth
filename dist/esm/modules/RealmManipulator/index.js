export class RealmManipulator {
    constructor(config) {
        this.realm = config.realm;
        this.port = config.port;
        this.routerPrefix = config.routerPrefix;
    }
    /**
     * Get the realm name from the realm object
     */
    getRealmName() {
        return this.realm.name;
    }
    /**
     * Get all apps from the realm
     */
    getApps() {
        return this.realm.apps;
    }
    /**
     * Get all app names from the realm
     */
    getAppNames() {
        return this.getApps().map((app) => app.name);
    }
    /**
     * Get a specific app by name
     */
    getAppByName(appName) {
        if (!this.getAppNames().includes(appName)) {
            throw new Error(`Unknown App Name: ${appName}`);
        }
        return this.getApps().find((app) => app.name === appName);
    }
    /**
     * Get all clients for a specific app
     */
    getAppClients(appName) {
        var _a;
        return ((_a = this.getAppByName(appName)) === null || _a === void 0 ? void 0 : _a.clients) || [];
    }
    /**
     * Alias for getAppClients - maintained for backward compatibility
     */
    getClients() {
        return this.getApps().flatMap((app) => app.clients);
    }
    /**
     * Get all client names for a specific app
     */
    getAppClientNames(appName) {
        const appClients = this.getAppClients(appName);
        return appClients.map((client) => client.name);
    }
    /**
     * Get a specific client by name for a specific app
     */
    getAppClientByClientName(appName, clientName) {
        if (!this.getAppClientNames(appName).includes(clientName)) {
            throw new Error(`Unknown Client Name for ${appName}. Client name: ${clientName}`);
        }
        const requiredClient = this.getAppClients(appName).filter((client) => {
            return client.name === clientName;
        });
        return requiredClient[0];
    }
    /**
     * Alias for getAppClientByClientName - maintained for backward compatibility
     */
    getClientByName(appName, clientName) {
        return this.getAppClientByClientName(appName, clientName);
    }
    /**
     * Check if an app exists in the realm
     */
    hasApp(appName) {
        return this.getAppNames().includes(appName);
    }
    /**
     * Check if a client exists in a specific app
     */
    hasClient(appName, clientName) {
        if (!this.hasApp(appName)) {
            return false;
        }
        return this.getAppClientNames(appName).includes(clientName);
    }
    /**
     * Get all clients across all apps
     */
    getAllClients() {
        const allClients = [];
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
                const verified = client.clientAuthConfiguration.verifiedByDefault;
                const registerStatus = client.clientAuthConfiguration.registerStatus;
                const loginStatus = client.clientAuthConfiguration.loginStatus;
                const clientUrl = `http://localhost:${this.port}${this.routerPrefix}${client.appPath}/${client.name}`;
                const primaryFields = client.clientAuthConfiguration.primaryField.join(', ');
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
            console.table(clientsSummary);
            console.log('--------------------------------');
        });
    }
}
//# sourceMappingURL=index.js.map