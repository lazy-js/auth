import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import type { UserProfileConfig } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import type { TokenResponse } from "@keycloak/keycloak-admin-client/lib/utils/auth";
import type { JWTVerifyResult, ResolvedKey } from "jose";
import type { GroupRepresentation } from "./shared";
export interface CreateUserPayload {
    username: string;
    password?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    verified?: boolean;
}
export interface ResetPasswordPayload {
    userId: string;
    password: string;
}
export interface AddUserToGroupPayload {
    userId: string;
    groupId: string;
}
export interface CreateUserReturn {
    id: string;
}
export interface LoginWithUsernamePayload {
    username: string;
    password: string;
    clientId: string;
}
export interface RefreshAccessTokenPayload {
    refreshToken: string;
    clientId: string;
}
type Roles = {
    roles?: string[];
};
type ResouceAccess<T extends string> = Record<T, Roles>;
export interface AccessTokenPayload<T extends string> {
    acr?: string;
    address?: string;
    "allowed-origins"?: string[];
    at_hash?: string;
    auth_time?: number;
    azp?: string;
    birthdate?: string;
    c_hash?: string;
    claims_locales?: string;
    email?: string;
    email_verified?: boolean;
    exp?: number;
    family_name?: string;
    gender: string;
    given_name?: string;
    iat?: number;
    iss?: string;
    jti?: string;
    locale?: string;
    middle_name?: string;
    name?: string;
    nbf?: number;
    nickname?: string;
    nonce?: string;
    otherClaims?: {
        [index: string]: string;
    };
    phone_number?: string;
    phone_number_verified?: boolean;
    picture?: string;
    preferred_username?: string;
    profile?: string;
    realm_access?: Roles;
    s_hash?: string;
    scope?: string;
    session_state?: string;
    sub?: string;
    "trusted-certs"?: string[];
    typ?: string;
    updated_at?: number;
    website?: string;
    zoneinfo?: string;
    resource_access: ResouceAccess<T>;
}
export type ValidateAccessTokenReturn<T extends string> = JWTVerifyResult<AccessTokenPayload<T>> & ResolvedKey;
export interface IUserApi {
    createUser(user: CreateUserPayload): Promise<CreateUserReturn>;
    removeDefaultRealmRolesFromUser(userId: string): Promise<void>;
    setUserPassword(payload: ResetPasswordPayload): Promise<void>;
    deleteUser(userId: string): Promise<void>;
    getUserById(userId: string): Promise<UserRepresentation | undefined>;
    getUsersByEmail(email: string): Promise<UserRepresentation[]>;
    getUserByUsername(username: string): Promise<UserRepresentation | undefined>;
    addUserToGroup(paylaod: AddUserToGroupPayload): Promise<string>;
    setUserVerified(userId: string): Promise<void>;
    getUserProfileConfig(): Promise<UserProfileConfig>;
    getUserGroups(userId: string): Promise<GroupRepresentation[]>;
    updateUserProileConfig(userProfileConfig: UserProfileConfig): Promise<UserProfileConfig>;
    loginWithUsername(payload: LoginWithUsernamePayload): Promise<TokenResponse>;
    validateAccessToken<T extends string>(accessToken: string): Promise<ValidateAccessTokenReturn<T>>;
    refreshAccessToken(payload: RefreshAccessTokenPayload): Promise<TokenResponse>;
}
export {};
//# sourceMappingURL=IUserApi.d.ts.map