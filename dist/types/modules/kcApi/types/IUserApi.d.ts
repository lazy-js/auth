import type UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import type { UserProfileConfig } from '@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata';
import type { TokenResponse } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import type { JWTVerifyResult, ResolvedKey } from 'jose';
import type { GroupRepresentation } from './shared';
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
/**
 * Standard and Keycloak-specific claims in an Access Token payload.
 * Reference: OpenID Connect Core, JWT, and Keycloak extensions.
 */
export interface AccessTokenPayload<T extends string> {
    /** Authentication Context Class Reference (e.g., "1" or "urn:mace:incommon:iap:silver"). */
    acr?: string;
    /** End-User's preferred postal address (structured claim). */
    address?: string;
    /** List of allowed CORS origins for this token. */
    'allowed-origins'?: string[];
    /** Access Token hash, used in hybrid flows for validation. */
    at_hash?: string;
    /** Time of authentication (seconds since epoch). */
    auth_time?: number;
    /** Authorized party - the client ID that was issued the token. */
    azp?: string;
    /** End-User's birthday in ISO 8601:2000 format (YYYY-MM-DD). */
    birthdate?: string;
    /** Code hash, used in hybrid flows for validation. */
    c_hash?: string;
    /** End-User's preferred languages and scripts for claims (e.g. "en-US"). */
    claims_locales?: string;
    /** End-User's email address. */
    email?: string;
    /** True if the End-User's email has been verified. */
    email_verified?: boolean;
    /** Expiration time (seconds since epoch). */
    exp?: number;
    /** End-User's family name (surname). */
    family_name?: string;
    /** End-User's gender (e.g., "male", "female", "other"). */
    gender: string;
    /** End-User's given name (first name). */
    given_name?: string;
    /** Issued At time (seconds since epoch). */
    iat?: number;
    /** Issuer identifier (usually Keycloak realm URL). */
    iss?: string;
    /** JWT ID - unique identifier for this token. */
    jti?: string;
    /** End-User's locale (e.g., "en-US"). */
    locale?: string;
    /** End-User's middle name. */
    middle_name?: string;
    /** End-User's full name (display name). */
    name?: string;
    /** Not Before - token is not valid before this time (seconds since epoch). */
    nbf?: number;
    /** End-User's nickname. */
    nickname?: string;
    /** String value used to associate a client session with an ID Token. */
    nonce?: string;
    /** Custom claims added by Keycloak or extensions. */
    otherClaims?: {
        [index: string]: string;
    };
    /** End-User's phone number (E.164 format). */
    phone_number?: string;
    /** True if the End-User's phone number has been verified. */
    phone_number_verified?: boolean;
    /** URL of End-User's profile picture. */
    picture?: string;
    /** Shorthand name by which the End-User wishes to be referred (often username). */
    preferred_username?: string;
    /** URL of End-User's profile page. */
    profile?: string;
    /** Realm-level role mappings. */
    realm_access?: Roles;
    /** State hash, used in hybrid flows for validation. */
    s_hash?: string;
    /** Space-delimited list of OAuth 2.0 scopes granted. */
    scope?: string;
    /** Session identifier associated with this token. */
    session_state?: string;
    /** Subject - unique identifier for the End-User. */
    sub?: string;
    /** List of trusted certificates associated with the user. */
    'trusted-certs'?: string[];
    /** Type of token (usually "Bearer"). */
    typ?: string;
    /** Last time the End-User's information was updated (seconds since epoch). */
    updated_at?: number;
    /** End-User's personal web page URL. */
    website?: string;
    /** End-User's time zone (e.g., "Europe/Berlin"). */
    zoneinfo?: string;
    /** Client-level role mappings, keyed by client ID. */
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