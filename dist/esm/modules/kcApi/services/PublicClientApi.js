import errors from '../../../config/errors';
export class PublicClientApi {
    constructor(kcAdmin) {
        this.kcAdmin = kcAdmin;
        this.kcAdmin = kcAdmin;
    }
    async create(paylaod) {
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
    async getOneByUuid(clientUuid) {
        return await this.kcAdmin.clients.findOne({
            id: clientUuid,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    async getOneByClientId(clientId) {
        return (await this.kcAdmin.clients.find({
            clientId,
            search: true,
            realm: this.kcAdmin.workingRealmName,
        }))[0];
    }
    async addRole(payload) {
        if (payload.parentRoleId) {
            return await this.addChildRole({
                roleName: payload.roleName,
                clientUuid: payload.clientUuid,
                parentRoleId: payload.parentRoleId,
            });
        }
        await this.kcAdmin.clients.createRole({
            id: payload.clientUuid,
            realm: this.kcAdmin.workingRealmName,
            name: payload.roleName,
        });
        const childRole = await this.getRoleByName(payload);
        if (!childRole)
            throw new Error(errors.UNKNOWN_ERROR_IN_KC_API.code);
        return childRole;
    }
    async addChildRole(payload) {
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
            throw new Error('addChildRole Error');
        }
        await this.kcAdmin.roles.createComposite({
            roleId: payload.parentRoleId,
            realm: this.kcAdmin.workingRealmName,
        }, [
            {
                id: childRole.id,
                clientRole: true,
            },
        ]);
        return childRole;
    }
    async getRoleById(paylaod) {
        const roles = await this.getRolesByClientUuid(paylaod);
        return roles.find((role) => role.id === paylaod.roleId);
    }
    async getRolesByClientUuid(payload) {
        return await this.kcAdmin.clients.listRoles({
            id: payload.clientUuid,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    async getRoleByName(paylaod) {
        return (await this.getRolesByClientUuid(paylaod)).find((el) => el.name === paylaod.roleName);
    }
    async getRolesByParentId(payload) {
        return await this.kcAdmin.roles.getCompositeRolesForClient({
            id: payload.parentRoleId,
            clientId: payload.clientUuid,
            realm: this.kcAdmin.workingRealmName,
        });
    }
}
//# sourceMappingURL=PublicClientApi.js.map