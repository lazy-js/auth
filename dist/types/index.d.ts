import { IRealm } from "./modules/Realm";
import { INotificationClientSdk, KeycloakConfig, ServiceConfig } from "./types";
export * from "./modules/Realm";
export * from "./utils";
export * from "./types";
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
    private logSummary;
    start(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map