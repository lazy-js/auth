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
const server_1 = require("@lazy-js/server");
const database_1 = require("./database");
const error_guard_1 = require("@lazy-js/error-guard");
// modules
const index_1 = require("./modules/RealmBuilder/index");
const index_2 = require("./modules/RealmManipulator/index");
const utils_1 = require("./utils");
const constants_1 = require("./modules/User/constants");
// exports
__exportStar(require("./modules/Realm"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./types"), exports);
function getErrorHandler({ serviceName, traceIdHeader }) {
    const expressErrorHandler = new error_guard_1.ExpressErrorHandlerMiddleware({
        serviceName,
        traceIdHeader,
    });
    const handler = expressErrorHandler.getHandler();
    return handler.bind(expressErrorHandler);
}
class LazyAuth {
    constructor(keycloakConfig, appConfig, realm, notificationSdk) {
        // default options for app
        appConfig.config.globalErrorHandler = getErrorHandler({
            serviceName: appConfig.config.serviceName,
            traceIdHeader: appConfig.config.traceIdHeader,
        });
        appConfig.config.parseJson = true;
        this.app = new server_1.App(appConfig);
        this.logger = this.app.log.logger;
        this.keycloakConfig = keycloakConfig;
        this.realm = realm;
        this.notificationSdk = notificationSdk;
    }
    async _isKeycloakServiceAvailable() {
        return await (0, utils_1.checkServerRequest)(this.keycloakConfig.keycloakServiceUrl);
    }
    async buildRealm() {
        try {
            const realmBuilderModule = await index_1.RealmBuilder.create(this.realm, {
                url: this.keycloakConfig.keycloakServiceUrl,
                password: this.keycloakConfig.keycloakAdminPassword,
                reAuthenticateIntervalMs: this.keycloakConfig.keycloakAdminReAuthenticateIntervalMs || 30000,
            }, this.notificationSdk);
            await realmBuilderModule.build();
            // this is alternative router for the realmBuilderModule
            // instead of sending request to /<realm-name>/<app-name>/<client-name>/<action>
            // we send request to /<action>
            // and put client and app in the body
            // and the router will redirect to the /<realm-name>/<app-name>/<client-name>/<action> route
            realmBuilderModule.post('/:action', (req, res, next) => {
                console.log('get a request', req.url);
                try {
                    const action = req.params.action;
                    const client = req.body.client;
                    const app = req.body.app;
                    if (!client) {
                        throw new error_guard_1.ValidationError(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.CLIENT_IS_REQUIRED);
                    }
                    if (!app) {
                        throw new error_guard_1.ValidationError(constants_1.USER_VALIDATOR_OPERATIONAL_ERRORS.APP_IS_REQUIRED);
                    }
                    // do not add prefix because the router is mounted on the /<realm-name> route
                    const redirectUrl = `/${this.realm.name}/${app}/${client}/${action}`;
                    req.url = redirectUrl;
                    // because router.handle is private, we need to cast it to any
                    if (realmBuilderModule.router && realmBuilderModule.router.handle) {
                        realmBuilderModule.router.handle(req, res, next);
                    }
                    else {
                        next(new error_guard_1.InternalError('INTERNAL_ERROR').updateContext({
                            methodName: 'buildRealm',
                            service: 'LazyAuth',
                            message: 'router.handle is not found',
                        }));
                    }
                }
                catch (error) {
                    next(error);
                }
            });
            return realmBuilderModule;
        }
        catch (error) {
            this.logger.error('Error building realm: \n', console.log(error));
            throw error;
        }
    }
    async connectDatabase() {
        const database = new database_1.Database(this.keycloakConfig.localMongoDbURL);
        database.on('connected', () => {
            this.logger.info('Mongo database connected successfully');
        });
        database.on('disconnected', () => {
            this.logger.info('Mongo database disconnected successfully');
        });
        database.on('error', (err) => {
            this.logger.error('Mongo database error \n', JSON.stringify(err, null, 4));
        });
        await database.connect();
        return database;
    }
    async prepareApp() {
        this.app.on('err-in-global-handler', (err) => {
            this.logger.error('EVENT:err-in-global-handler \n', JSON.stringify(err, null, 4));
            this.logger.error('END OF EVENT:err-in-global-handler \n');
        });
        this.app.on('started', () => {
            this.logger.info('App service started successfully');
        });
        return this.app;
    }
    logSummary() {
        const realmManipulator = new index_2.RealmManipulator({
            realm: this.realm,
            port: this.app.config.port.toString(),
            routerPrefix: this.app.config.routerPrefix,
        });
        realmManipulator.getRealmSummary();
    }
    async start() {
        if (!(await this._isKeycloakServiceAvailable())) {
            this.logger.error(`Keycloak on url ${this.keycloakConfig.keycloakServiceUrl} is DOWN`);
            return;
        }
        else {
            this.logger.info(`Keycloak on url ${this.keycloakConfig.keycloakServiceUrl} is UP`);
        }
        await this.connectDatabase();
        const realmBuilderModule = await this.buildRealm();
        if (this.keycloakConfig.logKeycloakInfo) {
            this.logSummary();
        }
        await this.prepareApp();
        this.app.mountModule(realmBuilderModule);
        this.app.start();
    }
}
exports.LazyAuth = LazyAuth;
//# sourceMappingURL=index.js.map