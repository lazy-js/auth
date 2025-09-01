import { App } from '@lazy-js/server';
import { Database } from '@lazy-js/mongo-db';
import { RealmBuilder } from './modules/RealmBuilder/index';
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
}
export declare class LazyAuth {
    private readonly keycloakConfig;
    private readonly serviceConfig;
    private realm;
    private notificationSdk;
    constructor(keycloakConfig: KeycloakConfig, serviceConfig: ServiceConfig, realm: IRealm, notificationSdk: INotificationClientSdk);
    _isKeycloakServiceAvailable(): Promise<boolean>;
    buildRealm(): Promise<RealmBuilder>;
    connectDatabase(): Promise<Database>;
    prepareApp(): Promise<App>;
    start(): Promise<void>;
}
export declare function checkServerRequest(url: string): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map