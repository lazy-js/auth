import type GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import { KcAdmin } from './KcAdminApi';
import { IGroupApi, CreateGroupPayload, CreateGroupReturn, MapClientRoleToGroupPayload, AddAttributesToGroupPayload } from '../types/IGroupApi';
import { ErrorTransformer } from '../../../error/src/ErrorTransformer';
/**
 * @description GroupApi class
 * @implements IGroupApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 */
export declare class GroupApi implements IGroupApi {
    kcAdmin: KcAdmin;
    errorTransformer: ErrorTransformer;
    constructor(kcAdmin: KcAdmin, errorTransformer: ErrorTransformer);
    /**
     * @description Create a group
     * @param required payload - The payload for creating a group
     * @params required payload.groupName - The name of the group to create
     * @params optional payload.attributes - The attributes of the group to create
     * @params optional payload.parentGroupId - The parent group id of the group to create
     * @returns Promise<CreateGroupReturn> - The created group
     */
    createGroup(payload: CreateGroupPayload): Promise<CreateGroupReturn>;
    /**
     * @description Create a child group
     * @param required paylaod - The payload for creating a child group
     * @params required paylaod.parentGroupId - The parent group id of the child group to create
     * @params required paylaod.groupName - The name of the child group to create
     * @params optional paylaod.attributes - The attributes of the child group to create
     * @returns Promise<CreateGroupReturn> - The created child group
     */
    createChildGroup(paylaod: Required<CreateGroupPayload>): Promise<CreateGroupReturn>;
    /**
     * @description Get the sub groups by parent id
     * @param required parentId - The parent group id of the sub groups to get
     * @returns Promise<GroupRepresentation[]> - The sub groups
     */
    getSubGroupsByParentId(parentId: string): Promise<GroupRepresentation[]>;
    /**
     * @description Get the group by path
     * @param required path - The path of the group to get
     * @returns Promise<GroupRepresentation | undefined> - The group
     */
    getGroupByPath(path: string): Promise<GroupRepresentation | undefined>;
    /**
     * @description Get the groups by parent path
     * @param required parentPath - The parent path of the groups to get
     * @returns Promise<GroupRepresentation[]> - The groups
     */
    getGroupsByParentPath(parentPath: string): Promise<GroupRepresentation[]>;
    /**
     * @description Get the group by id
     * @param required groupId - The id (uuid) of the group to get
     * @returns Promise<GroupRepresentation | undefined> - The group
     */
    getGroupById(groupId: string): Promise<GroupRepresentation | undefined>;
    /**
     * @description Check if the group exists
     * @param required groupId - The id (uuid) of the group to check
     * @returns Promise<boolean> - True if the group exists, false otherwise
     */
    groupExists(groupId: string): Promise<boolean>;
    /**
     * @description Get the top level group by name
     * @param required groupName - The name of the top level group to get
     * @returns Promise<GroupRepresentation | undefined> - The top level group
     */
    getTopLevelGroupByName(groupName: string): Promise<GroupRepresentation | undefined>;
    /**
     * @description Map a client role to a group
     * @param required paylaod - The payload for mapping a client role to a group
     * @params required paylaod.groupId - The id (uuid) of the group to map the client role to
     * @params required paylaod.clientUuid - The uuid of the client to map the client role to
     * @params required paylaod.roleId - The id (uuid) of the role to map to the group
     */
    mapClientRoleToGroup(paylaod: MapClientRoleToGroupPayload): Promise<void>;
    /**
     * @description Add attributes to a group
     * @param required payload - The payload for adding attributes to a group
     * @params required payload.groupId - The id (uuid) of the group to add attributes to
     * @params required payload.attributes - The attributes to add to the group
     */
    addAttributesToGroup(payload: AddAttributesToGroupPayload): Promise<void>;
}
//# sourceMappingURL=GroupApi.d.ts.map