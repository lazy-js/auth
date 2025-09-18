import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import { IPublicClientApi, CreateClientPayload, CreateClientReturn, GetRoleByIdReturn, GetRolesByClientUuidReturn, GetRoleByNameReturn, GetRolesByParentIdReturn, GetRoleByNamePayload, GetRolesByParentIdPayload, AddRolePayload, AddRoleReturn, GetRoleByIdPayload } from '../types';
import { KcAdmin } from './KcAdminApi';
import { ErrorTransformer } from '../../../error/src/ErrorTransformer';
/**
 * @description PublicClientApi class implements the IPublicClientApi interface and is used to interact with the Keycloak Public Client API
 * @implements IPublicClientApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 */
export declare class PublicClientApi implements IPublicClientApi {
    kcAdmin: KcAdmin;
    errorTransformer: ErrorTransformer;
    constructor(kcAdmin: KcAdmin, errorTransformer: ErrorTransformer);
    /**
     * @description Create a public client
     * @param required paylaod - The payload for creating a public client
     * @params required paylaod.clientId - The id of the client to create
     * @description The id is different from the uuid of the client
     * @params required paylaod.description - The description of the client to create
     * @params required paylaod.name - The name of the client to create
     * @returns Promise<CreateClientReturn> - The uuid of the client as { id: string }
     * @example
     * {
     *  clientId: "unique-slug-for-the-client",
     *  description: "this app is used to authenticate users",
     *  name: "app name",
     * }
     */
    create(paylaod: CreateClientPayload): Promise<CreateClientReturn>;
    /**
     * @description Get a public client by uuid
     * @param required clientUuid - The uuid of the client to get
     * @returns Promise<ClientRepresentation | undefined> - The public client
     */
    getOneByUuid(clientUuid: string): Promise<ClientRepresentation | undefined>;
    /**
     * @description Get a public client by client id
     * @param required clientId - The client id (the slug name of the client) to get
     * @returns Promise<ClientRepresentation | undefined> - The public client
     */
    getOneByClientId(clientId: string): Promise<ClientRepresentation | undefined>;
    /**
     * @description Add a role to a public client
     * @param required payload - The payload for adding a role to a public client
     * @params required payload.roleName - The name of the role to add
     * @params required payload.clientUuid - The uuid of the client to add the role to
     * @params optional payload.parentRoleId - The id of the parent role to add the role to
     * @returns Promise<AddRoleReturn> - The role as { id: string }
     * @example
     * {
     *  roleName: "role name",
     *  clientUuid: "abc123-456789-012345-678901",
     *  parentRoleId: "abc123-456789-012345-678901",
     * }
     */
    addRole(payload: AddRolePayload): Promise<AddRoleReturn>;
    /**
     * @description Add a child role to a public client
     * @param payload - The payload for adding a child role to a public client
     * @params required payload.roleName - The name of the child role to add
     * @params required payload.clientUuid - The uuid of the client to add the child role to
     * @params required payload.parentRoleId - The id of the parent role to add the child role to
     * @returns Promise<AddRoleReturn> - The child role as { id: string }
     * @example
     * {
     *  roleName: "role name",
     *  clientUuid: "abc123-456789-012345-678901",
     *  parentRoleId: "abc123-456789-012345-678901",
     * }
     * @returns Promise<AddRoleReturn> - The child role as { id: string }
     */
    addChildRole(payload: Required<AddRolePayload>): Promise<AddRoleReturn>;
    /**
     * @description Get a role by id
     * @param paylaod - The payload for getting a role by id
     * @params required paylaod.roleId - The id of the role to get
     * @params required paylaod.clientUuid - The uuid of the client to get the role from
     * @returns Promise<RoleRepresentation | undefined> - The role as RoleRepresentation or undefined
     * @example
     * {
     *  roleId: "abc123-456789-012345-678901",
     *  clientUuid: "abc123-456789-012345-678901",
     * }
     */
    getRoleById(paylaod: GetRoleByIdPayload): Promise<GetRoleByIdReturn>;
    /**
     * @description Get all roles by client uuid
     * @param payload - The payload for getting all roles by client uuid
     * @params required payload.clientUuid - The uuid of the client to get the roles from
     * @returns Promise<GetRolesByClientUuidReturn> - The roles as RoleRepresentation[]
     */
    getRolesByClientUuid(clientUuid: string): Promise<GetRolesByClientUuidReturn>;
    /**
     * @description Get a role by name from a public client
     * @param paylaod - The payload for getting a role by name
     * @params required paylaod.roleName - The name of the role to get
     * @params required paylaod.clientUuid - The uuid of the client to get the role from
     * @returns Promise<GetRoleByNameReturn> - The role as RoleRepresentation
     * @example
     * {
     *  roleName: "role name",
     *  clientUuid: "abc123-456789-012345-678901",
     * }
     * @returns Promise<GetRoleByNameReturn | undefined> - The role as RoleRepresentation or undefined
     */
    getRoleByName(paylaod: GetRoleByNamePayload): Promise<GetRoleByNameReturn>;
    /**
     * @description Get all roles by parent id from a public client
     * @param payload - The payload for getting all roles by parent id
     * @params required payload.parentRoleId - The id of the parent role to get the roles from
     * @params required payload.clientUuid - The uuid of the client to get the roles from
     * @returns Promise<GetRolesByParentIdReturn> - The roles as RoleRepresentation[]
     * @example
     * {
     *  parentRoleId: "abc123-456789-012345-678901",
     *  clientUuid: "abc123-456789-012345-678901",
     * }
     */
    getRolesByParentId(payload: GetRolesByParentIdPayload): Promise<GetRolesByParentIdReturn>;
}
//# sourceMappingURL=PublicClientApi.d.ts.map