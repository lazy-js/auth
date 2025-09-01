import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { IPublicClientApi } from '../types';
import { KcAdmin } from './KcAdminApi';
export declare class PublicClientApi implements IPublicClientApi {
    kcAdmin: KcAdmin;
    constructor(kcAdmin: KcAdmin);
    create(paylaod: {
        clientId: string;
        description?: string;
        name: string;
    }): Promise<{
        id: string;
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
    getRoleById(paylaod: {
        roleId: string;
        clientUuid: string;
    }): Promise<RoleRepresentation | undefined>;
    getRolesByClientUuid(payload: {
        clientUuid: string;
    }): Promise<RoleRepresentation[]>;
    getRoleByName(paylaod: {
        roleName: string;
        clientUuid: string;
    }): Promise<RoleRepresentation | undefined>;
    getRolesByParentId(payload: {
        clientUuid: string;
        parentRoleId: string;
    }): Promise<RoleRepresentation[]>;
}
//# sourceMappingURL=PublicClientApi.d.ts.map