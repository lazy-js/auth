import { App, handleMainException } from "@lazy-js/server";
import { Database } from "@lazy-js/mongo-db";
// modules
import { RealmBuilder } from "./modules/RealmBuilder/index";
import { RealmManipulator } from "./modules/RealmManipulator/index";
import { Logger } from "@lazy-js/utils";
import { checkServerRequest } from "./utils";
// exports
export * from "./modules/Realm";
export * from "./utils";
export * from "./types";
export class LazyAuth {
    constructor(keycloakConfig, serviceConfig, realm, notificationSdk) {
        this.keycloakConfig = keycloakConfig;
        this.serviceConfig = serviceConfig;
        this.realm = realm;
        this.notificationSdk = notificationSdk;
        const disable = this.serviceConfig.disableServiceLogging;
        this.stateLogger = new Logger({
            module: "Lazy Auth - ",
            disableDebug: disable,
            disableError: disable,
            disableInfo: disable,
            disableWarn: disable,
        });
    }
    async _isKeycloakServiceAvailable() {
        return await checkServerRequest(this.keycloakConfig.keycloakServiceUrl);
    }
    async buildRealm() {
        const realmBuilderModule = await RealmBuilder.create(this.realm, {
            url: this.keycloakConfig.keycloakServiceUrl,
            password: this.keycloakConfig.keycloakAdminPassword,
            reAuthenticateIntervalMs: this.keycloakConfig.keycloakAdminReAuthenticateIntervalMs || 30000,
        }, this.notificationSdk);
        await realmBuilderModule.build();
        return realmBuilderModule;
    }
    async connectDatabase() {
        const database = new Database(this.serviceConfig.mongoDbUrl);
        database.on("connected", () => {
            this.stateLogger.info("Monogo database connected successfully");
        });
        database.on("disconnected", () => {
            this.stateLogger.info("Monogo database disconnected successfully");
        });
        database.on("error", (err) => {
            this.stateLogger.error("Monogo database error \n", JSON.stringify(err, null, 4));
        });
        await database.connect();
        return database;
    }
    async prepareApp() {
        const app = new App({
            port: this.serviceConfig.port,
            prefix: this.serviceConfig.routerPrefix,
            allowedOrigins: this.serviceConfig.allowedOrigins,
            disableRequestLogging: this.serviceConfig.disableRequestLogging,
            disableSecurityHeaders: this.serviceConfig.disableSecurityHeaders,
            enableRoutesLogging: this.serviceConfig.enableRoutesLogging,
            serviceName: this.serviceConfig.serviceName,
        });
        app.on("error", (err) => {
            this.stateLogger.error("App Service Request Error \n", JSON.stringify(err, null, 4));
        });
        app.on("started", () => {
            this.stateLogger.info("App service started successfully");
        });
        return app;
    }
    logSummary() {
        const realmManipulator = new RealmManipulator({
            realm: this.realm,
            port: this.serviceConfig.port.toString(),
            routerPrefix: this.serviceConfig.routerPrefix,
        });
        realmManipulator.getRealmSummary();
    }
    async start() {
        try {
            if (!(await this._isKeycloakServiceAvailable())) {
                this.stateLogger.error(`Keycloak on url ${this.keycloakConfig.keycloakServiceUrl} is DOWN`);
                return;
            }
            else {
                this.stateLogger.info(`Keycloak on url ${this.keycloakConfig.keycloakServiceUrl} is UP`);
            }
            await this.connectDatabase();
            const realmBuilderModule = await this.buildRealm();
            if (this.serviceConfig.logRealmSummary) {
                this.logSummary();
            }
            const app = await this.prepareApp();
            app.mountModule(realmBuilderModule);
            app.start();
        }
        catch (err) {
            const error = await handleMainException(err, this.start.bind(this), 2);
            this.stateLogger.error("Error Starting App: \n", JSON.stringify(error, null, 4));
        }
    }
}
//# sourceMappingURL=index.js.map