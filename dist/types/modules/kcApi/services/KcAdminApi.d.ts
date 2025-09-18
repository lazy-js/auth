import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import { KeycloakCreateObject } from "../types/shared";
/**
 * @description KcAdmin class extends the KeycloakAdminClient and is used to authenticate, add `workingRealmName` property and interact with the Keycloak Admin API
 * @extends KeycloakAdminClient
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 */
export declare class KcAdmin extends KeycloakAdminClient {
    /**
     * @description Create a KcAdmin instance authenticate it, assign interval for re-authenticating it and return the instance
     * @async
     * @param required createKcAdminConfig - The configuration for creating a KcAdmin instance
     * @params required createKcAdminConfig.password - The password for the KcAdmin instance
     * @params number required createKcAdminConfig.reAuthenticateIntervalMs - The interval for re-authenticating the KcAdmin instance
     * @params required createKcAdminConfig.url - The url for the KcAdmin instance
     * @params required createKcAdminConfig.realmName - The realm name for the KcAdmin instance
     * @returns Promise<KcAdmin> - The KcAdmin instance
     */
    static create(createKcAdminConfig: KeycloakCreateObject): Promise<KcAdmin>;
    workingRealmName: string;
    expiresIn: number;
    refreshExpiresIn: number;
    /**
     * @description Create a KcAdmin instance
     * @param required options - The options for creating a KcAdmin instance
     * @params required options.url - The url for the KcAdmin instance
     * @params required options.masterRealmName - The master realm name for the KcAdmin instance
     * @params required options.workingRealmName - The working realm name for the KcAdmin instance
     */
    private constructor();
    /**
     * @description Authenticate the KcAdmin instance
     * @async
     * @param required password - The password for the KcAdmin instance
     * @private
     */
    authenticate(password: string): Promise<void>;
}
//# sourceMappingURL=KcAdminApi.d.ts.map