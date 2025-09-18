import type GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import type { Attributes } from './shared';
export interface CreateGroupPayload {
    groupName: string;
    parentGroupId?: string;
    attributes?: Attributes;
}
export interface CreateGroupReturn {
    id: string;
}
export interface MapClientRoleToGroupPayload {
    groupId: string;
    clientUuid: string;
    roleId: string;
}
export interface AddAttributesToGroupPayload {
    groupId: string;
    attributes: Attributes;
}
export interface IGroupApi {
    createGroup(payload: CreateGroupPayload): Promise<CreateGroupReturn>;
    createChildGroup(paylaod: Required<CreateGroupPayload>): Promise<CreateGroupReturn>;
    getSubGroupsByParentId(parentId: string): Promise<GroupRepresentation[]>;
    getGroupByPath(path: string): Promise<GroupRepresentation | undefined>;
    getGroupsByParentPath(parentPath: string): Promise<GroupRepresentation[]>;
    getGroupById(groupId: string): Promise<GroupRepresentation | undefined>;
    groupExists(groupId: string): Promise<boolean>;
    getTopLevelGroupByName(groupName: string): Promise<GroupRepresentation | undefined>;
    mapClientRoleToGroup(paylaod: MapClientRoleToGroupPayload): Promise<void>;
    addAttributesToGroup(payload: AddAttributesToGroupPayload): Promise<void>;
}
//# sourceMappingURL=IGroupApi.d.ts.map