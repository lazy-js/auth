import { getToken, } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { jwtVerify, createRemoteJWKSet, } from 'jose';
export class UserApi {
    constructor(kcAdmin) {
        this.kcAdmin = kcAdmin;
        this.kcAdmin = kcAdmin;
    }
    async createUser(user) {
        return await this.kcAdmin.users.create({
            ...user,
            realmRoles: [],
            realm: this.kcAdmin.workingRealmName,
        });
    }
    async removeDefaultRealmRolesFromUser(userId) {
        const roleId = await this.kcAdmin.roles.findOneByName({
            name: `default-roles-${this.kcAdmin.workingRealmName.toLowerCase()}`,
            realm: this.kcAdmin.workingRealmName,
        });
        if (!roleId || !roleId.id) {
            throw new Error('Default Realm Role Not Found');
        }
        await this.kcAdmin.users.delRealmRoleMappings({
            id: userId,
            realm: this.kcAdmin.workingRealmName,
            roles: [
                {
                    id: roleId === null || roleId === void 0 ? void 0 : roleId.id,
                    name: `default-roles-${this.kcAdmin.workingRealmName.toLowerCase()}`,
                },
            ],
        });
        return true;
    }
    async setUserPassword(payload) {
        await this.kcAdmin.users.resetPassword({
            id: payload.userId,
            credential: { value: payload.password, temporary: false },
            realm: this.kcAdmin.workingRealmName,
        });
        return true;
    }
    async deleteUser(userId) {
        await this.kcAdmin.users.del({
            id: userId,
            realm: this.kcAdmin.workingRealmName,
        });
        return true;
    }
    async getUserById(userId) {
        return await this.kcAdmin.users.findOne({
            id: userId,
            userProfileMetadata: true,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    async getUsersByEmail(email) {
        return await this.kcAdmin.users.find({
            email: email,
            exact: true,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    async getUserByUsername(username) {
        return (await this.kcAdmin.users.find({
            username: username,
            exact: true,
            realm: this.kcAdmin.workingRealmName,
        }))[0];
    }
    async addUserToGroup(paylaod) {
        return await this.kcAdmin.users.addToGroup({
            id: paylaod.userId,
            groupId: paylaod.groupId,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    async getUserGroups(userId) {
        return await this.kcAdmin.users.listGroups({
            id: userId,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    async setUserVerified(userId) {
        await this.kcAdmin.users.update({ id: userId, realm: this.kcAdmin.workingRealmName }, { emailVerified: true });
        return true;
    }
    async getUserProfileConfig() {
        return await this.kcAdmin.users.getProfile({
            realm: this.kcAdmin.workingRealmName,
        });
    }
    async updateUserProileConfig(userProfileConfig) {
        return await this.kcAdmin.users.updateProfile({
            ...userProfileConfig,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    async loginWithUsername(payload) {
        try {
            const { username, password, clientId } = payload;
            const token = await getToken({
                realmName: this.kcAdmin.workingRealmName,
                baseUrl: this.kcAdmin.baseUrl,
                credentials: {
                    username,
                    password,
                    clientId,
                    grantType: 'password',
                },
            });
            return token;
        }
        catch (err) {
            throw err;
        }
    }
    // T = clients names
    async validateAccessToken(accessToken) {
        const validatingEndpoint = `/realms/${this.kcAdmin.workingRealmName}/protocol/openid-connect/certs`;
        const fullUrl = this.kcAdmin.baseUrl + validatingEndpoint;
        const JWKS = createRemoteJWKSet(new URL(fullUrl));
        const payload = await jwtVerify(accessToken, JWKS, {
            issuer: `${this.kcAdmin.baseUrl}/realms/${this.kcAdmin.workingRealmName}`,
        });
        return payload;
    }
    async refreshAccessToken(payload) {
        const newToken = await getToken({
            realmName: this.kcAdmin.workingRealmName,
            baseUrl: this.kcAdmin.baseUrl,
            credentials: {
                clientId: payload.clientId,
                refreshToken: payload.refreshToken,
                grantType: 'refresh_token',
            },
        });
        return newToken;
    }
}
//# sourceMappingURL=UserApi.js.map