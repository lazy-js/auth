import type ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import type RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import type GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import type UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import type { UserProfileConfig } from '@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata';
import type { TokenResponse } from '@keycloak/keycloak-admin-client/lib/utils/auth';
export interface KeycloakCreateObject {
    url: string;
    password: string;
    realmName: string;
    reAuthenticateIntervalMs?: number;
}
export type Attributes = {
    [key: string]: string[];
};
export type { ClientRepresentation, GroupRepresentation, RoleRepresentation, UserRepresentation, UserProfileConfig, TokenResponse, };
//# sourceMappingURL=shared.d.ts.map