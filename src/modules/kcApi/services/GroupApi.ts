import errors from "../../../config/errors";
import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { KcAdmin } from "./KcAdminApi";
import {
        IGroupApi,
        CreateGroupPayload,
        CreateGroupReturn,
        MapClientRoleToGroupPayload,
        AddAttributesToGroupPayload,
} from "../types/IGroupApi";
import { AutoTransform } from "../../../error/src/decorators";
import { ErrorTransformer } from "../../../error/src/ErrorTransformer";

/**
 * @description GroupApi class
 * @implements IGroupApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 */
@AutoTransform()
export class GroupApi implements IGroupApi {
        constructor(public kcAdmin: KcAdmin, public errorTransformer: ErrorTransformer) {
                this.kcAdmin = kcAdmin;
                this.errorTransformer = errorTransformer;
        }
        /**
         * @description Create a group
         * @param required payload - The payload for creating a group
         * @params required payload.groupName - The name of the group to create
         * @params optional payload.attributes - The attributes of the group to create
         * @params optional payload.parentGroupId - The parent group id of the group to create
         * @returns Promise<CreateGroupReturn> - The created group
         */
        async createGroup(payload: CreateGroupPayload): Promise<CreateGroupReturn> {
                if (payload.parentGroupId) {
                        return await this.createChildGroup({
                                parentGroupId: payload.parentGroupId,
                                groupName: payload.groupName,
                                attributes: payload.attributes || {},
                        });
                }

                return await this.kcAdmin.groups.create({
                        name: payload.groupName,
                        realm: this.kcAdmin.workingRealmName,
                        attributes: payload.attributes,
                });
        }

        /**
         * @description Create a child group
         * @param required paylaod - The payload for creating a child group
         * @params required paylaod.parentGroupId - The parent group id of the child group to create
         * @params required paylaod.groupName - The name of the child group to create
         * @params optional paylaod.attributes - The attributes of the child group to create
         * @returns Promise<CreateGroupReturn> - The created child group
         */
        async createChildGroup(paylaod: Required<CreateGroupPayload>): Promise<CreateGroupReturn> {
                return await this.kcAdmin.groups.createChildGroup(
                        {
                                id: paylaod.parentGroupId,
                                realm: this.kcAdmin.workingRealmName,
                        },
                        {
                                name: paylaod.groupName,
                                attributes: paylaod.attributes,
                        }
                );
        }

        /**
         * @description Get the sub groups by parent id
         * @param required parentId - The parent group id of the sub groups to get
         * @returns Promise<GroupRepresentation[]> - The sub groups
         */
        async getSubGroupsByParentId(parentId: string): Promise<GroupRepresentation[]> {
                const result = await this.kcAdmin.groups.listSubGroups({
                        parentId,
                        realm: this.kcAdmin.workingRealmName,
                        populateHierarchy: true,
                });

                return result;
        }

        /**
         * @description Get the group by path
         * @param required path - The path of the group to get
         * @returns Promise<GroupRepresentation | undefined> - The group
         */
        async getGroupByPath(path: string): Promise<GroupRepresentation | undefined> {
                const parentGroup = await this.kcAdmin.realms.getGroupByPath({
                        path: path,
                        realm: this.kcAdmin.workingRealmName,
                });
                return parentGroup;
        }

        /**
         * @description Get the groups by parent path
         * @param required parentPath - The parent path of the groups to get
         * @returns Promise<GroupRepresentation[]> - The groups
         */
        async getGroupsByParentPath(parentPath: string): Promise<GroupRepresentation[]> {
                const parentGroup = await this.getGroupByPath(parentPath);
                if (!parentGroup || !parentGroup.id) {
                        throw new Error(errors.NO_GROUP_WITH_THAT_PATH.code);
                }

                return await this.getSubGroupsByParentId(parentGroup.id);
        }

        /**
         * @description Get the group by id
         * @param required groupId - The id (uuid) of the group to get
         * @returns Promise<GroupRepresentation | undefined> - The group
         */
        async getGroupById(groupId: string): Promise<GroupRepresentation | undefined> {
                const result = await this.kcAdmin.groups.findOne({
                        id: groupId,
                        realm: this.kcAdmin.workingRealmName,
                });

                return result;
        }

        /**
         * @description Check if the group exists
         * @param required groupId - The id (uuid) of the group to check
         * @returns Promise<boolean> - True if the group exists, false otherwise
         */
        async groupExists(groupId: string): Promise<boolean> {
                return !!(await this.kcAdmin.groups.findOne({
                        id: groupId,
                        realm: this.kcAdmin.workingRealmName,
                }));
        }

        /**
         * @description Get the top level group by name
         * @param required groupName - The name of the top level group to get
         * @returns Promise<GroupRepresentation | undefined> - The top level group
         */
        async getTopLevelGroupByName(groupName: string): Promise<GroupRepresentation | undefined> {
                const results = await this.kcAdmin.groups.find({
                        q: `name`,
                        search: groupName,
                        realm: this.kcAdmin.workingRealmName,
                        exact: true,
                });
                const group = results.find((el) => el.name === groupName);
                return group;
        }

        /**
         * @description Map a client role to a group
         * @param required paylaod - The payload for mapping a client role to a group
         * @params required paylaod.groupId - The id (uuid) of the group to map the client role to
         * @params required paylaod.clientUuid - The uuid of the client to map the client role to
         * @params required paylaod.roleId - The id (uuid) of the role to map to the group
         */
        async mapClientRoleToGroup(paylaod: MapClientRoleToGroupPayload): Promise<void> {
                const { groupId, clientUuid, roleId } = paylaod;

                const allRoles = await this.kcAdmin.clients.listRoles({
                        id: clientUuid,
                        realm: this.kcAdmin.workingRealmName,
                });
                const role = allRoles.find((role) => role.id === roleId);
                if (!role || !role.name) {
                        throw new Error(errors.NO_ROLE_WITH_THAT_ID.code);
                }

                await this.kcAdmin.groups.addClientRoleMappings({
                        id: groupId,
                        clientUniqueId: clientUuid,
                        realm: this.kcAdmin.workingRealmName,
                        roles: [{ id: roleId, name: role.name }],
                });
        }

        /**
         * @description Add attributes to a group
         * @param required payload - The payload for adding attributes to a group
         * @params required payload.groupId - The id (uuid) of the group to add attributes to
         * @params required payload.attributes - The attributes to add to the group
         */
        async addAttributesToGroup(payload: AddAttributesToGroupPayload): Promise<void> {
                const { groupId, attributes } = payload;
                const group = await this.getGroupById(groupId);
                if (!group) {
                        throw new Error(errors.NO_GROUP_WITH_THAT_ID.code);
                }
                await this.kcAdmin.groups.update(
                        { id: groupId, realm: this.kcAdmin.workingRealmName },
                        {
                                ...group,
                                attributes: {
                                        ...group?.attributes,
                                        ...attributes,
                                },
                        }
                );
        }
}
