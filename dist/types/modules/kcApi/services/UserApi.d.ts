import { AccessTokenPayload, IUserApi } from '../types';
import { KcAdmin } from './KcAdminApi';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { UserProfileConfig } from '@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata';
import { TokenResponse } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { JWTVerifyResult, ResolvedKey } from 'jose';
import { GroupRepresentation } from '../types/shared';
export declare class UserApi implements IUserApi {
    kcAdmin: KcAdmin;
    constructor(kcAdmin: KcAdmin);
    createUser(user: UserRepresentation): Promise<{
        id: string;
    }>;
    removeDefaultRealmRolesFromUser(userId: string): Promise<boolean>;
    setUserPassword(payload: {
        userId: string;
        password: string;
    }): Promise<boolean>;
    deleteUser(userId: string): Promise<boolean>;
    getUserById(userId: string): Promise<UserRepresentation | undefined>;
    getUsersByEmail(email: string): Promise<UserRepresentation[]>;
    getUserByUsername(username: string): Promise<UserRepresentation | undefined>;
    addUserToGroup(paylaod: {
        userId: string;
        groupId: string;
    }): Promise<string>;
    getUserGroups(userId: string): Promise<GroupRepresentation[]>;
    setUserVerified(userId: string): Promise<boolean>;
    getUserProfileConfig(): Promise<UserProfileConfig>;
    updateUserProileConfig(userProfileConfig: UserProfileConfig): Promise<UserProfileConfig>;
    loginWithUsername(payload: {
        username: string;
        password: string;
        clientId: string;
    }): Promise<TokenResponse>;
    validateAccessToken<T extends string>(accessToken: string): Promise<JWTVerifyResult<AccessTokenPayload<T>> & ResolvedKey>;
    refreshAccessToken(payload: {
        refreshToken: string;
        clientId: string;
    }): Promise<TokenResponse>;
}
//# sourceMappingURL=UserApi.d.ts.map