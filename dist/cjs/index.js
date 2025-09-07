"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyAuth = void 0;
exports.checkServerRequest = checkServerRequest;
const server_1 = require("@lazy-js/server");
const mongo_db_1 = require("@lazy-js/mongo-db");
const index_1 = require("./modules/RealmBuilder/index");
const index_2 = require("./modules/RealmManipulator/index");
const utils_1 = require("@lazy-js/utils");
__exportStar(require("./modules/Realm"), exports);
__exportStar(require("./utils"), exports);
class LazyAuth {
    constructor(keycloakConfig, serviceConfig, realm, notificationSdk) {
        this.keycloakConfig = keycloakConfig;
        this.serviceConfig = serviceConfig;
        this.realm = realm;
        this.notificationSdk = notificationSdk;
        const disable = this.serviceConfig.disableServiceLogging;
        this.stateLogger = new utils_1.Logger({
            module: 'Lazy Auth - ',
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
        const realmBuilderModule = await index_1.RealmBuilder.create(this.realm, {
            url: this.keycloakConfig.keycloakServiceUrl,
            password: this.keycloakConfig.keycloakAdminPassword,
        }, this.notificationSdk);
        await realmBuilderModule.build();
        return realmBuilderModule;
    }
    async connectDatabase() {
        const database = new mongo_db_1.Database(this.serviceConfig.mongoDbUrl);
        database.on('connected', () => {
            this.stateLogger.info('Monogo database connected successfully');
        });
        database.on('disconnected', () => {
            this.stateLogger.info('Monogo database disconnected successfully');
        });
        database.on('error', (err) => {
            this.stateLogger.error('Monogo database error \n', JSON.stringify(err, null, 4));
        });
        await database.connect();
        return database;
    }
    async prepareApp() {
        const app = new server_1.App({
            port: this.serviceConfig.port,
            prefix: this.serviceConfig.routerPrefix,
            allowedOrigins: this.serviceConfig.allowedOrigins,
            disableRequestLogging: this.serviceConfig.disableRequestLogging,
            disableSecurityHeaders: this.serviceConfig.disableSecurityHeaders,
            enableRoutesLogging: this.serviceConfig.enableRoutesLogging,
            serviceName: this.serviceConfig.serviceName,
        });
        app.on('error', (err) => {
            this.stateLogger.error('App Service Request Error \n', JSON.stringify(err, null, 4));
        });
        app.on('started', () => {
            this.stateLogger.info('App service started successfully');
        });
        return app;
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
            const realmManipulator = new index_2.RealmManipulator({
                realm: this.realm,
                port: this.serviceConfig.port.toString(),
                routerPrefix: this.serviceConfig.routerPrefix,
            });
            if (this.serviceConfig.logRealmSummary)
                realmManipulator.getRealmSummary();
            const app = await this.prepareApp();
            app.mountModule(realmBuilderModule);
            app.start();
        }
        catch (err) {
            const error = await (0, server_1.handleMainException)(err, this.start.bind(this), 2);
            this.stateLogger.error('Error Starting App: \n', JSON.stringify(error, null, 4));
        }
    }
}
exports.LazyAuth = LazyAuth;
async function checkServerRequest(url) {
    try {
        const res = await fetch(url);
        return true;
    }
    catch (err) {
        return false;
    }
}
//# sourceMappingURL=index.js.map