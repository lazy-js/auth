var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { KcAdmin } from "./KcAdminApi";
import { getToken } from "@keycloak/keycloak-admin-client/lib/utils/auth";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { ErrorTransformer } from "../../../error/src/ErrorTransformer";
import { AutoTransform } from "../../../error/src/decorators";
/**
 * @description UserApi class implements the IUserApi interface and is used to interact with the Keycloak User API
 * @implements IUserApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 */
let UserApi = class UserApi {
    constructor(kcAdmin, errorTransformer) {
        this.kcAdmin = kcAdmin;
        this.errorTransformer = errorTransformer;
        this.kcAdmin = kcAdmin;
        this.errorTransformer = errorTransformer;
    }
    /**
     * @description Create a user
     * @param CreateUserPayload required user - CreateUserPayload The user to create
     * @parm required user.username - The username to create the user with
     * @parm optional user.email - The email to create the user with
     * @parm optional user.firstName - The first name to create the user with
     * @parm optional user.lastName - The last name to create the user with
     * @parm optional user.verified - `default is true` The verified status to create the user with
     * @param optional user.password - The password to set for the user
     * @returns Promise<CreateUserReturn> - The user as { id: string }
     */
    async createUser(user) {
        const newKcUser = {
            username: user.username,
            credentials: user.password
                ? [{ type: "password", value: user.password, temporary: false }]
                : [],
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            enabled: true,
            emailVerified: typeof user.verified === "boolean" ? user.verified : true,
            realmRoles: [],
        };
        const userResponse = await this.kcAdmin.users.create({
            ...newKcUser,
            realm: this.kcAdmin.workingRealmName,
        });
        return { id: userResponse.id };
    }
    /**
     * @description Remove default realm roles from a user
     * @param required userId - The id (uuid) of the user to remove the default realm roles from
     * @returns Promise<void> - void
     */
    async removeDefaultRealmRolesFromUser(userId) {
        const roleId = await this.kcAdmin.roles.findOneByName({
            name: `default-roles-${this.kcAdmin.workingRealmName.toLowerCase()}`,
            realm: this.kcAdmin.workingRealmName,
        });
        if (!roleId || !roleId.id) {
            throw new Error("Default Realm Role Not Found");
        }
        return await this.kcAdmin.users.delRealmRoleMappings({
            id: userId,
            realm: this.kcAdmin.workingRealmName,
            roles: [
                {
                    id: roleId === null || roleId === void 0 ? void 0 : roleId.id,
                    name: `default-roles-${this.kcAdmin.workingRealmName.toLowerCase()}`,
                },
            ],
        });
    }
    /**
     * @description Set a user password
     * @param required payload - The payload for setting a user password
     * @params required payload.userId - The id of the user to set the password for
     * @params required payload.password - The password to set for the user
     * @returns Promise<void> - void
     */
    async setUserPassword(payload) {
        await this.kcAdmin.users.resetPassword({
            id: payload.userId,
            credential: { value: payload.password, temporary: false },
            realm: this.kcAdmin.workingRealmName,
        });
    }
    /**
     * @description Delete a user
     * @param required userId - The id of the user to delete
     * @returns Promise<void> - void
     */
    async deleteUser(userId) {
        await this.kcAdmin.users.del({
            id: userId,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    /**
     * @description Get a user by id
     * @param required userId - The id of the user to get
     * @returns Promise<UserRepresentation | undefined> - The user as UserRepresentation or undefined
     */
    async getUserById(userId) {
        return await this.kcAdmin.users.findOne({
            id: userId,
            userProfileMetadata: true,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    /**
     * @description Get users by email
     * @param required email - The email of the users to get
     * @returns Promise<UserRepresentation[]> - The users as UserRepresentation[]
     */
    async getUsersByEmail(email) {
        return await this.kcAdmin.users.find({
            email: email,
            exact: true,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    /**
     * @description Get a user by username
     * @param required username - The username of the user to get
     * @returns Promise<UserRepresentation | undefined> - The user as UserRepresentation or undefined
     */
    async getUserByUsername(username) {
        return (await this.kcAdmin.users.find({
            username: username,
            exact: true,
            realm: this.kcAdmin.workingRealmName,
        }))[0];
    }
    /**
     * @description Add a user to a group
     * @param required paylaod - The payload for adding a user to a group
     * @params required paylaod.userId - The id of the user to add to the group
     * @params required paylaod.groupId - The id of the group to add the user to
     * @returns Promise<string> - The id of the user as string
     */
    async addUserToGroup(paylaod) {
        return await this.kcAdmin.users.addToGroup({
            id: paylaod.userId,
            groupId: paylaod.groupId,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    /**
     * @description Get a user groups
     * @param required userId - The id of the user to get the groups for
     * @returns Promise<GroupRepresentation[]> - The groups as GroupRepresentation[]
     */
    async getUserGroups(userId) {
        return await this.kcAdmin.users.listGroups({
            id: userId,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    /**
     * @description Set a user verified
     * @param required userId - The id of the user to set the verified for
     * @returns Promise<void> - void
     */
    async setUserVerified(userId) {
        await this.kcAdmin.users.update({ id: userId, realm: this.kcAdmin.workingRealmName }, { emailVerified: true });
    }
    /**
     * @description Get a user profile config
     * @returns Promise<UserProfileConfig> - The user profile config as UserProfileConfig
     */
    async getUserProfileConfig() {
        return await this.kcAdmin.users.getProfile({
            realm: this.kcAdmin.workingRealmName,
        });
    }
    /**
     * @description Update a user profile config
     * @param required userProfileConfig - The user profile config to update
     * @returns Promise<UserProfileConfig> - The user profile config as UserProfileConfig
     */
    async updateUserProileConfig(userProfileConfig) {
        return await this.kcAdmin.users.updateProfile({
            ...userProfileConfig,
            realm: this.kcAdmin.workingRealmName,
        });
    }
    /**
     * @description Login with a username
     * @param required payload - The payload for logging in with a username
     * @params required payload.username - The username to login with
     * @params required payload.password - The password to login with
     * @params required payload.clientId - The client id to login with
     * @returns Promise<TokenResponse> - The token as TokenResponse
     */
    async loginWithUsername(payload) {
        const { username, password, clientId } = payload;
        const token = await getToken({
            realmName: this.kcAdmin.workingRealmName,
            baseUrl: this.kcAdmin.baseUrl,
            credentials: {
                username,
                password,
                clientId,
                grantType: "password",
            },
        });
        return token;
    }
    // T = clients names
    /**
     * @description Validate an access token
     * @param required accessToken - The access token to validate
     * @returns Promise<JWTVerifyResult<AccessTokenPayload<T>> & ResolvedKey> - The access token as JWTVerifyResult<AccessTokenPayload<T>> & ResolvedKey
     */
    async validateAccessToken(accessToken) {
        const validatingEndpoint = `/realms/${this.kcAdmin.workingRealmName}/protocol/openid-connect/certs`;
        const fullUrl = new URL(validatingEndpoint, this.kcAdmin.baseUrl);
        const JWKS = createRemoteJWKSet(fullUrl);
        // T are client names enum
        // AccessTokenPayload<T> is the type of the payload that keycloak returns
        // jwtVerfiy returns a promise that resolves to a JWTVerifyResult<AccessTokenPayload<T>> & ResolvedKey
        const verifyResult = await jwtVerify(accessToken, JWKS, {
            issuer: `${this.kcAdmin.baseUrl}/realms/${this.kcAdmin.workingRealmName}`,
        });
        return verifyResult;
    }
    /**
     * @description Refresh an access token
     * @param required payload - The payload for refreshing an access token
     * @params required payload.refreshToken - The refresh token to refresh
     * @params required payload.clientId - The client id to refresh the access token for
     * @returns Promise<TokenResponse> - The token as TokenResponse
     */
    async refreshAccessToken(payload) {
        const newToken = await getToken({
            realmName: this.kcAdmin.workingRealmName,
            baseUrl: this.kcAdmin.baseUrl,
            credentials: {
                clientId: payload.clientId,
                refreshToken: payload.refreshToken,
                grantType: "refresh_token",
            },
        });
        return newToken;
    }
};
UserApi = __decorate([
    AutoTransform(),
    __metadata("design:paramtypes", [KcAdmin, ErrorTransformer])
], UserApi);
export { UserApi };
/**
 * @description User template
 * @type {UserRepresentation}
 * @example
 * const _userTemplate: UserRepresentation = {
 *   id: "id",
 *   createdTimestamp: 123,
 *   username: "string",
 *   enabled: true,
 *   totp: true,
 *   emailVerified: true,
 *   disableableCredentialTypes: ["asdf"],
 *   requiredActions: ["asdf"],
 *   notBefore: 123,
 *   access: { asdf: true },
 *   attributes: { asdf: "asdf" },
 *   clientConsents: [{ clientId: "asdf" }],
 *   clientRoles: { asdf: "asdf" },
 *   credentials: [{ type: "password", value: "password", temporary: false }],
 *   email: "string",
 *   federatedIdentities: [{ identityProvider: "asdf" }],
 *   federationLink: "string",
 *   firstName: "string",
 *   groups: ["asdf"],
 *   lastName: "string",
 *   realmRoles: ["asdf"],
 *   self: "string",
 *   serviceAccountClientId: "string",
 *   userProfileMetadata: { attributes: [{ name: "asdf" }] },
 *  };
 */
//# sourceMappingURL=UserApi.js.map