import type GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import type { Attributes } from './shared';
export interface IGroupApi {
    createGroup(payload: {
        groupName: string;
        parentGroupId?: string;
        attributes?: Attributes;
    }): Promise<{
        id: string;
    }>;
    createChildGroup(paylaod: {
        parentGroupId: string;
        groupName: string;
        attributes?: Attributes;
    }): Promise<{
        id: string;
    }>;
    getSubGroupsByParentId(parentId: string): Promise<GroupRepresentation[]>;
    getGroupByPath(path: string): Promise<GroupRepresentation | undefined>;
    getGroupsByParentPath(parentPath: string): Promise<GroupRepresentation[]>;
    getGroupById(groupId: string): Promise<GroupRepresentation | undefined>;
    groupExists(groupId: string): Promise<boolean>;
    getTopLevelGroupByName(groupName: string): Promise<GroupRepresentation | undefined>;
    mapClientRoleToGroup(paylaod: {
        groupId: string;
        clientUuid: string;
        roleId: string;
    }): Promise<boolean>;
    addAttributesToGroup(payload: {
        groupId: string;
        attributes: Attributes;
    }): Promise<boolean>;
}
//# sourceMappingURL=IGroupApi.d.ts.map