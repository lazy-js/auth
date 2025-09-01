import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { KeycloakCreateObject } from '../types/shared';
export declare class KcAdmin extends KeycloakAdminClient {
    static create({ password, url, realmName, reAuthenticateIntervalMs, }: KeycloakCreateObject): Promise<KcAdmin>;
    workingRealmName: string;
    private constructor();
    authenticate(password: string): Promise<void>;
}
//# sourceMappingURL=KcAdminApi.d.ts.map