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
const loggers_1 = require("./config/loggers");
__exportStar(require("./modules/Realm"), exports);
__exportStar(require("./utils"), exports);
class LazyAuth {
    constructor(keycloakConfig, serviceConfig, realm, notificationSdk) {
        this.keycloakConfig = keycloakConfig;
        this.serviceConfig = serviceConfig;
        this.realm = realm;
        this.notificationSdk = notificationSdk;
    }
    async _isKeycloakServiceAvailable() {
        return await checkServerRequest(this.keycloakConfig.keycloakServiceUrl);
    }
    async buildRealm() {
        console.log(this.keycloakConfig);
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
            loggers_1.appLogger.info('Connected to database');
        });
        database.on('disconnected', () => {
            loggers_1.appLogger.info('Disconnected from database successfully');
        });
        database.on('error', (err) => {
            loggers_1.appLogger.error('Error happened when connecting to database');
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
            console.log(err);
        });
        app.on('started', () => {
            loggers_1.appLogger.info('App started');
        });
        return app;
    }
    async start() {
        try {
            if (!(await this._isKeycloakServiceAvailable())) {
                console.log('Keycloak server is down');
                return;
            }
            await this.connectDatabase();
            const realmBuilderModule = await this.buildRealm();
            const realmManipulator = new index_2.RealmManipulator({
                realm: this.realm,
                port: this.serviceConfig.port.toString(),
                routerPrefix: this.serviceConfig.routerPrefix,
            });
            if (this.serviceConfig.logRealmSummary) {
                realmManipulator.getRealmSummary();
            }
            const app = await this.prepareApp();
            app.mountModule(realmBuilderModule);
            app.start();
        }
        catch (err) {
            const error = await (0, server_1.handleMainException)(err, this.start.bind(this), 2);
            loggers_1.appLogger.error(error);
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