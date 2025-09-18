import ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import errors from "../../../config/errors";
import {
        IPublicClientApi,
        CreateClientPayload,
        CreateClientReturn,
        GetRoleByIdReturn,
        GetRolesByClientUuidReturn,
        GetRoleByNameReturn,
        GetRolesByParentIdReturn,
        GetRolesByClientUuidPayload,
        GetRoleByNamePayload,
        GetRolesByParentIdPayload,
        AddRolePayload,
        AddRoleReturn,
        GetRoleByIdPayload,
} from "../types";
import { KcAdmin } from "./KcAdminApi";
import { AutoTransform } from "../../../error/src/decorators";
import { ErrorTransformer } from "../../../error/src/ErrorTransformer";

/**
 * @description PublicClientApi class implements the IPublicClientApi interface and is used to interact with the Keycloak Public Client API
 * @implements IPublicClientApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 */

@AutoTransform()
export class PublicClientApi implements IPublicClientApi {
        constructor(public kcAdmin: KcAdmin, public errorTransformer: ErrorTransformer) {
                this.kcAdmin = kcAdmin;
        }

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
        async create(paylaod: CreateClientPayload): Promise<CreateClientReturn> {
                const newClient = await this.kcAdmin.clients.create({
                        clientId: paylaod.clientId,
                        directAccessGrantsEnabled: true,
                        publicClient: true,
                        realm: this.kcAdmin.workingRealmName,
                        description: paylaod.description,
                        name: paylaod.name,
                });

                return { id: newClient.id };
        }

        /**
         * @description Get a public client by uuid
         * @param required clientUuid - The uuid of the client to get
         * @returns Promise<ClientRepresentation | undefined> - The public client
         */
        async getOneByUuid(clientUuid: string): Promise<ClientRepresentation | undefined> {
                return await this.kcAdmin.clients.findOne({
                        id: clientUuid,
                        realm: this.kcAdmin.workingRealmName,
                });
        }

        /**
         * @description Get a public client by client id
         * @param required clientId - The client id (the slug name of the client) to get
         * @returns Promise<ClientRepresentation | undefined> - The public client
         */
        async getOneByClientId(clientId: string): Promise<ClientRepresentation | undefined> {
                return (
                        await this.kcAdmin.clients.find({
                                clientId,
                                search: true,
                                realm: this.kcAdmin.workingRealmName,
                        })
                )[0];
        }

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
        async addRole(payload: AddRolePayload): Promise<AddRoleReturn> {
                if (payload.parentRoleId) {
                        return await this.addChildRole(payload as Required<AddRolePayload>);
                }
                await this.kcAdmin.clients.createRole({
                        id: payload.clientUuid,
                        realm: this.kcAdmin.workingRealmName,
                        name: payload.roleName,
                });
                const addedRole = await this.getRoleByName(payload);
                if (!addedRole || !addedRole.id) throw new Error(errors.UNKNOWN_ERROR_IN_KC_API.code);
                return addedRole;
        }

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
        async addChildRole(payload: Required<AddRolePayload>): Promise<AddRoleReturn> {
                const doesParentRoleExists = await this.getRoleById({
                        roleId: payload.parentRoleId,
                        clientUuid: payload.clientUuid,
                });
                if (!doesParentRoleExists) {
                        throw new Error(errors.PARENT_ROLE_NOT_EXISTS.code);
                }

                await this.kcAdmin.clients.createRole({
                        id: payload.clientUuid,
                        realm: this.kcAdmin.workingRealmName,
                        name: payload.roleName,
                });

                const childRole = await this.getRoleByName(payload);

                if (!childRole || !childRole.id) {
                        throw new Error("addChildRole Error");
                }
                await this.kcAdmin.roles.createComposite(
                        {
                                roleId: payload.parentRoleId,
                                realm: this.kcAdmin.workingRealmName,
                        },
                        [
                                {
                                        id: childRole.id,
                                        clientRole: true,
                                },
                        ]
                );

                return childRole;
        }

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
        async getRoleById(paylaod: GetRoleByIdPayload): Promise<GetRoleByIdReturn> {
                const roles = await this.getRolesByClientUuid(paylaod.clientUuid);
                return roles.find((role) => role.id === paylaod.roleId);
        }

        /**
         * @description Get all roles by client uuid
         * @param payload - The payload for getting all roles by client uuid
         * @params required payload.clientUuid - The uuid of the client to get the roles from
         * @returns Promise<GetRolesByClientUuidReturn> - The roles as RoleRepresentation[]
         */
        async getRolesByClientUuid(clientUuid: string): Promise<GetRolesByClientUuidReturn> {
                return await this.kcAdmin.clients.listRoles({
                        id: clientUuid,
                        realm: this.kcAdmin.workingRealmName,
                });
        }

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
        async getRoleByName(paylaod: GetRoleByNamePayload): Promise<GetRoleByNameReturn> {
                return (await this.getRolesByClientUuid(paylaod.clientUuid)).find((el) => el.name === paylaod.roleName);
        }

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
        async getRolesByParentId(payload: GetRolesByParentIdPayload): Promise<GetRolesByParentIdReturn> {
                return await this.kcAdmin.roles.getCompositeRolesForClient({
                        id: payload.parentRoleId,
                        clientId: payload.clientUuid,
                        realm: this.kcAdmin.workingRealmName,
                });
        }
}
