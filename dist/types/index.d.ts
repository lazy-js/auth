import { IRealm } from './modules/Realm';
import { INotificationClientSdk } from './types';
export * from './modules/Realm';
export * from './utils';
export { INotificationClientSdk };
export interface KeycloakConfig {
    keycloakServiceUrl: string;
    keycloakAdminPassword: string;
}
export interface ServiceConfig {
    allowedOrigins: string[];
    port: number;
    routerPrefix: string;
    disableRequestLogging?: boolean;
    disableSecurityHeaders?: boolean;
    enableRoutesLogging?: boolean;
    serviceName?: string;
    mongoDbUrl: string;
    logRealmSummary?: boolean;
    disableServiceLogging?: boolean;
}
export declare class LazyAuth {
    private readonly keycloakConfig;
    private readonly serviceConfig;
    private realm;
    private notificationSdk;
    private stateLogger;
    constructor(keycloakConfig: KeycloakConfig, serviceConfig: ServiceConfig, realm: IRealm, notificationSdk: INotificationClientSdk);
    _isKeycloakServiceAvailable(): Promise<boolean>;
    private buildRealm;
    private connectDatabase;
    private prepareApp;
    start(): Promise<void>;
}
export declare function checkServerRequest(url: string): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map