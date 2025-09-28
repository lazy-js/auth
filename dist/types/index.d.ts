import { App, AppParams } from '@lazy-js/server';
import { IRealm } from './modules/Realm';
import { INotificationClientSdk, KeycloakConfig } from './types';
export * from './modules/Realm';
export * from './utils';
export * from './types';
export { AppParams } from '@lazy-js/server';
export declare class LazyAuth {
    app: App;
    private logger;
    private readonly keycloakConfig;
    private realm;
    private notificationSdk;
    constructor(keycloakConfig: KeycloakConfig, appConfig: AppParams, realm: IRealm, notificationSdk: INotificationClientSdk);
    _isKeycloakServiceAvailable(): Promise<boolean>;
    private buildRealm;
    private connectDatabase;
    private prepareApp;
    private logSummary;
    start(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map