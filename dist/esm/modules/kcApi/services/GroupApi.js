var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { KcAdmin } from './KcAdminApi';
import { AutoTransform, ErrorTransformer, NotFoundError, } from '@lazy-js/error-guard';
import { MANUALLY_THROWN_ERROR_CODES } from './errorMap';
/**
 * @description GroupApi class
 * @implements IGroupApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 */
let GroupApi = class GroupApi {
    constructor(kcAdmin, errorTransformer) {
        this.kcAdmin = kcAdmin;
        this.errorTransformer = errorTransformer;
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
    async createGroup(payload) {
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
    async createChildGroup(paylaod) {
        return await this.kcAdmin.groups.createChildGroup({
            id: paylaod.parentGroupId,
            realm: this.kcAdmin.workingRealmName,
        }, {
            name: paylaod.groupName,
            attributes: paylaod.attributes,
        });
    }
    /**
     * @description Get the sub groups by parent id
     * @param required parentId - The parent group id of the sub groups to get
     * @returns Promise<GroupRepresentation[]> - The sub groups
     */
    async getSubGroupsByParentId(parentId) {
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
    async getGroupByPath(path) {
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
    async getGroupsByParentPath(parentPath) {
        const parentGroup = await this.getGroupByPath(parentPath);
        if (!parentGroup || !parentGroup.id) {
            throw new NotFoundError(MANUALLY_THROWN_ERROR_CODES.NO_GROUP_WITH_THAT_PATH);
        }
        return await this.getSubGroupsByParentId(parentGroup.id);
    }
    /**
     * @description Get the group by id
     * @param required groupId - The id (uuid) of the group to get
     * @returns Promise<GroupRepresentation | undefined> - The group
     */
    async getGroupById(groupId) {
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
    async groupExists(groupId) {
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
    async getTopLevelGroupByName(groupName) {
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
    async mapClientRoleToGroup(paylaod) {
        const { groupId, clientUuid, roleId } = paylaod;
        const allRoles = await this.kcAdmin.clients.listRoles({
            id: clientUuid,
            realm: this.kcAdmin.workingRealmName,
        });
        const role = allRoles.find((role) => role.id === roleId);
        if (!role || !role.name) {
            throw new NotFoundError(MANUALLY_THROWN_ERROR_CODES.NO_ROLE_WITH_THAT_ID);
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
    async addAttributesToGroup(payload) {
        const { groupId, attributes } = payload;
        const group = await this.getGroupById(groupId);
        if (!group) {
            throw new NotFoundError(MANUALLY_THROWN_ERROR_CODES.NO_GROUP_WITH_THAT_ID);
        }
        await this.kcAdmin.groups.update({ id: groupId, realm: this.kcAdmin.workingRealmName }, {
            ...group,
            attributes: {
                ...group === null || group === void 0 ? void 0 : group.attributes,
                ...attributes,
            },
        });
    }
};
GroupApi = __decorate([
    AutoTransform(),
    __metadata("design:paramtypes", [KcAdmin,
        ErrorTransformer])
], GroupApi);
export { GroupApi };
//# sourceMappingURL=GroupApi.js.map