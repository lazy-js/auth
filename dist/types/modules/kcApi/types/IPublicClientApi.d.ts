import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
export interface CreateClientPayload {
    clientId: string;
    description?: string;
    name: string;
}
export interface CreateClientReturn {
    id: string;
}
export interface AddRolePayload {
    roleName: string;
    clientUuid: string;
    parentRoleId?: string;
}
export type AddRoleReturn = RoleRepresentation;
export interface GetRoleByIdPayload {
    roleId: string;
    clientUuid: string;
}
export type GetRoleByIdReturn = RoleRepresentation | undefined;
export interface GetRolesByClientUuidPayload {
    clientUuid: string;
}
export type GetRolesByClientUuidReturn = RoleRepresentation[];
export interface GetRoleByNamePayload {
    roleName: string;
    clientUuid: string;
}
export type GetRoleByNameReturn = RoleRepresentation | undefined;
export interface GetRolesByParentIdPayload {
    clientUuid: string;
    parentRoleId: string;
}
export type GetRolesByParentIdReturn = RoleRepresentation[];
export interface IPublicClientApi {
    create(payload: CreateClientPayload): Promise<CreateClientReturn>;
    getOneByUuid(clientUuid: string): Promise<ClientRepresentation | undefined>;
    getOneByClientId(clientId: string): Promise<ClientRepresentation | undefined>;
    addRole(payload: AddRolePayload): Promise<AddRoleReturn>;
    addChildRole(payload: AddRolePayload): Promise<AddRoleReturn>;
    getRoleById(payload: GetRoleByIdPayload): Promise<GetRoleByIdReturn>;
    getRolesByClientUuid(clientUuid: string): Promise<GetRolesByClientUuidReturn>;
    getRoleByName(payload: GetRoleByNamePayload): Promise<GetRoleByNameReturn>;
    getRolesByParentId(payload: GetRolesByParentIdPayload): Promise<GetRolesByParentIdReturn>;
}
//# sourceMappingURL=IPublicClientApi.d.ts.map