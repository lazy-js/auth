import { IUserApi, CreateUserReturn, LoginWithUsernamePayload, RefreshAccessTokenPayload, ValidateAccessTokenReturn, CreateUserPayload } from '../types';
import { KcAdmin } from './KcAdminApi';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { UserProfileConfig } from '@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata';
import { TokenResponse } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { GroupRepresentation } from '../types/shared';
import { ErrorTransformer } from '@lazy-js/error-guard';
/**
 * @description UserApi class implements the IUserApi interface and is used to interact with the Keycloak User API
 * @implements IUserApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 */
export declare class UserApi implements IUserApi {
    kcAdmin: KcAdmin;
    errorTransformer: ErrorTransformer;
    constructor(kcAdmin: KcAdmin, errorTransformer: ErrorTransformer);
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
    createUser(user: CreateUserPayload): Promise<CreateUserReturn>;
    /**
     * @description Remove default realm roles from a user
     * @param required userId - The id (uuid) of the user to remove the default realm roles from
     * @returns Promise<void> - void
     */
    removeDefaultRealmRolesFromUser(userId: string): Promise<void>;
    /**
     * @description Set a user password
     * @param required payload - The payload for setting a user password
     * @params required payload.userId - The id of the user to set the password for
     * @params required payload.password - The password to set for the user
     * @returns Promise<void> - void
     */
    setUserPassword(payload: {
        userId: string;
        password: string;
    }): Promise<void>;
    /**
     * @description Delete a user
     * @param required userId - The id of the user to delete
     * @returns Promise<void> - void
     */
    deleteUser(userId: string): Promise<void>;
    /**
     * @description Get a user by id
     * @param required userId - The id of the user to get
     * @returns Promise<UserRepresentation | undefined> - The user as UserRepresentation or undefined
     */
    getUserById(userId: string): Promise<UserRepresentation | undefined>;
    /**
     * @description Get users by email
     * @param required email - The email of the users to get
     * @returns Promise<UserRepresentation[]> - The users as UserRepresentation[]
     */
    getUsersByEmail(email: string): Promise<UserRepresentation[]>;
    /**
     * @description Get a user by username
     * @param required username - The username of the user to get
     * @returns Promise<UserRepresentation | undefined> - The user as UserRepresentation or undefined
     */
    getUserByUsername(username: string): Promise<UserRepresentation | undefined>;
    /**
     * @description Add a user to a group
     * @param required paylaod - The payload for adding a user to a group
     * @params required paylaod.userId - The id of the user to add to the group
     * @params required paylaod.groupId - The id of the group to add the user to
     * @returns Promise<string> - The id of the user as string
     */
    addUserToGroup(paylaod: {
        userId: string;
        groupId: string;
    }): Promise<string>;
    /**
     * @description Get a user groups
     * @param required userId - The id of the user to get the groups for
     * @returns Promise<GroupRepresentation[]> - The groups as GroupRepresentation[]
     */
    getUserGroups(userId: string): Promise<GroupRepresentation[]>;
    /**
     * @description Set a user verified
     * @param required userId - The id of the user to set the verified for
     * @returns Promise<void> - void
     */
    setUserVerified(userId: string): Promise<void>;
    /**
     * @description Get a user profile config
     * @returns Promise<UserProfileConfig> - The user profile config as UserProfileConfig
     */
    getUserProfileConfig(): Promise<UserProfileConfig>;
    /**
     * @description Update a user profile config
     * @param required userProfileConfig - The user profile config to update
     * @returns Promise<UserProfileConfig> - The user profile config as UserProfileConfig
     */
    updateUserProileConfig(userProfileConfig: UserProfileConfig): Promise<UserProfileConfig>;
    /**
     * @description Login with a username
     * @param required payload - The payload for logging in with a username
     * @params required payload.username - The username to login with
     * @params required payload.password - The password to login with
     * @params required payload.clientId - The client id to login with
     * @returns Promise<TokenResponse> - The token as TokenResponse
     */
    loginWithUsername(payload: LoginWithUsernamePayload): Promise<TokenResponse>;
    /**
     * @description Validate an access token
     * @param required accessToken - The access token to validate
     * @returns Promise<JWTVerifyResult<AccessTokenPayload<T>> & ResolvedKey> - The access token as JWTVerifyResult<AccessTokenPayload<T>> & ResolvedKey
     */
    validateAccessToken<T extends string>(accessToken: string): Promise<ValidateAccessTokenReturn<T>>;
    /**
     * @description Refresh an access token
     * @param required payload - The payload for refreshing an access token
     * @params required payload.refreshToken - The refresh token to refresh
     * @params required payload.clientId - The client id to refresh the access token for
     * @returns Promise<TokenResponse> - The token as TokenResponse
     */
    refreshAccessToken(payload: RefreshAccessTokenPayload): Promise<TokenResponse>;
}
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
//# sourceMappingURL=UserApi.d.ts.map