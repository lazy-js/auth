import errors from '../../../config/errors';
import { kcErrorHandler } from '../../../utils/kcApiErrorHandler';
export class GroupApi {
    constructor(kcAdmin) {
        this.kcAdmin = kcAdmin;
        this.kcAdmin = kcAdmin;
    }
    async createGroup(payload) {
        try {
            if (payload.parentGroupId) {
                return await this.createChildGroup({
                    parentGroupId: payload.parentGroupId,
                    groupName: payload.groupName,
                    attributes: payload.attributes,
                });
            }
            return await this.kcAdmin.groups.create({
                name: payload.groupName,
                realm: this.kcAdmin.workingRealmName,
                attributes: payload.attributes,
            });
        }
        catch (err) {
            kcErrorHandler(err);
        }
    }
    async createChildGroup(paylaod) {
        return await this.kcAdmin.groups.createChildGroup({
            id: paylaod.parentGroupId,
            realm: this.kcAdmin.workingRealmName,
        }, {
            name: paylaod.groupName,
            attributes: paylaod.attributes,
        });
    }
    async getSubGroupsByParentId(parentId) {
        const result = await this.kcAdmin.groups.listSubGroups({
            parentId,
            realm: this.kcAdmin.workingRealmName,
            populateHierarchy: true,
        });
        return result;
    }
    async getGroupByPath(path) {
        const parentGroup = await this.kcAdmin.realms.getGroupByPath({
            path: path,
            realm: this.kcAdmin.workingRealmName,
        });
        return parentGroup;
    }
    async getGroupsByParentPath(parentPath) {
        const parentGroup = await this.getGroupByPath(parentPath);
        if (!parentGroup || !parentGroup.id) {
            throw new Error(errors.NO_GROUP_WITH_THAT_PATH.code);
        }
        return await this.getSubGroupsByParentId(parentGroup.id);
    }
    async getGroupById(groupId) {
        const result = await this.kcAdmin.groups.findOne({
            id: groupId,
            realm: this.kcAdmin.workingRealmName,
        });
        return result;
    }
    async groupExists(groupId) {
        return !!(await this.kcAdmin.groups.findOne({
            id: groupId,
            realm: this.kcAdmin.workingRealmName,
        }));
    }
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
    async mapClientRoleToGroup(paylaod) {
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
        return true;
    }
    async addAttributesToGroup(payload) {
        const { groupId, attributes } = payload;
        const group = await this.getGroupById(groupId);
        if (!group) {
            throw new Error(errors.NO_GROUP_WITH_THAT_ID.code);
        }
        await this.kcAdmin.groups.update({ id: groupId, realm: this.kcAdmin.workingRealmName }, {
            ...group,
            attributes: {
                ...group === null || group === void 0 ? void 0 : group.attributes,
                ...attributes,
            },
        });
        return true;
    }
}
//# sourceMappingURL=GroupApi.js.map