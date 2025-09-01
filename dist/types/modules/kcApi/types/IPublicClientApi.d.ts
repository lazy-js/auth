import type ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import type RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
export interface IPublicClientApi {
    create(payload: {
        clientId: string;
        description?: string;
        name: string;
    }): Promise<{
        id?: string;
    }>;
    getOneByUuid(clientUuid: string): Promise<ClientRepresentation | undefined>;
    getOneByClientId(clientId: string): Promise<ClientRepresentation | undefined>;
    addRole(payload: {
        roleName: string;
        clientUuid: string;
        parentRoleId?: string;
    }): Promise<RoleRepresentation>;
    addChildRole(payload: {
        roleName: string;
        clientUuid: string;
        parentRoleId: string;
    }): Promise<RoleRepresentation>;
    getRoleById(payload: {
        roleId: string;
        clientUuid: string;
    }): Promise<RoleRepresentation | undefined>;
    getRolesByClientUuid(payload: {
        clientUuid: string;
    }): Promise<RoleRepresentation[]>;
    getRoleByName(payload: {
        roleName: string;
        clientUuid: string;
    }): Promise<RoleRepresentation | undefined>;
    getRolesByParentId(payload: {
        clientUuid: string;
        parentRoleId: string;
    }): Promise<RoleRepresentation[]>;
}
//# sourceMappingURL=IPublicClientApi.d.ts.map