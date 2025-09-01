import { AccessTokenPayload, IUserApi } from '../types';
import { KcAdmin } from './KcAdminApi';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { UserProfileConfig } from '@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata';

import {
  getToken,
  TokenResponse,
} from '@keycloak/keycloak-admin-client/lib/utils/auth';

import {
  jwtVerify,
  createRemoteJWKSet,
  JWTVerifyResult,
  ResolvedKey,
} from 'jose';
import { GroupRepresentation } from '../types/shared';

export class UserApi implements IUserApi {
  constructor(public kcAdmin: KcAdmin) {
    this.kcAdmin = kcAdmin;
  }

  async createUser(user: UserRepresentation) {
    return await this.kcAdmin.users.create({
      ...user,
      realmRoles: [],
      realm: this.kcAdmin.workingRealmName,
    });
  }

  async removeDefaultRealmRolesFromUser(userId: string) {
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
          id: roleId?.id,
          name: `default-roles-${this.kcAdmin.workingRealmName.toLowerCase()}`,
        },
      ],
    });

    return true;
  }

  async setUserPassword(payload: {
    userId: string;
    password: string;
  }): Promise<boolean> {
    await this.kcAdmin.users.resetPassword({
      id: payload.userId,

      credential: { value: payload.password, temporary: false },
      realm: this.kcAdmin.workingRealmName,
    });
    return true;
  }

  async deleteUser(userId: string): Promise<boolean> {
    await this.kcAdmin.users.del({
      id: userId,
      realm: this.kcAdmin.workingRealmName,
    });
    return true;
  }

  async getUserById(userId: string): Promise<UserRepresentation | undefined> {
    return await this.kcAdmin.users.findOne({
      id: userId,
      userProfileMetadata: true,
      realm: this.kcAdmin.workingRealmName,
    });
  }

  async getUsersByEmail(email: string): Promise<UserRepresentation[]> {
    return await this.kcAdmin.users.find({
      email: email,
      exact: true,
      realm: this.kcAdmin.workingRealmName,
    });
  }

  async getUserByUsername(
    username: string,
  ): Promise<UserRepresentation | undefined> {
    return (
      await this.kcAdmin.users.find({
        username: username,
        exact: true,
        realm: this.kcAdmin.workingRealmName,
      })
    )[0];
  }

  async addUserToGroup(paylaod: {
    userId: string;
    groupId: string;
  }): Promise<string> {
    return await this.kcAdmin.users.addToGroup({
      id: paylaod.userId,
      groupId: paylaod.groupId,
      realm: this.kcAdmin.workingRealmName,
    });
  }

  async getUserGroups(userId: string): Promise<GroupRepresentation[]> {
    return await this.kcAdmin.users.listGroups({
      id: userId,
      realm: this.kcAdmin.workingRealmName,
    });
  }

  async setUserVerified(userId: string): Promise<boolean> {
    await this.kcAdmin.users.update(
      { id: userId, realm: this.kcAdmin.workingRealmName },
      { emailVerified: true },
    );
    return true;
  }

  async getUserProfileConfig(): Promise<UserProfileConfig> {
    return await this.kcAdmin.users.getProfile({
      realm: this.kcAdmin.workingRealmName,
    });
  }

  async updateUserProileConfig(
    userProfileConfig: UserProfileConfig,
  ): Promise<UserProfileConfig> {
    return await this.kcAdmin.users.updateProfile({
      ...userProfileConfig,
      realm: this.kcAdmin.workingRealmName,
    });
  }

  async loginWithUsername(payload: {
    username: string;
    password: string;
    clientId: string;
  }): Promise<TokenResponse> {
    try {
      const { username, password, clientId } = payload;
      const token: TokenResponse = await getToken({
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
    } catch (err: unknown) {
      throw err;
    }
  }

  // T = clients names
  async validateAccessToken<T extends string>(
    accessToken: string,
  ): Promise<JWTVerifyResult<AccessTokenPayload<T>> & ResolvedKey> {
    const validatingEndpoint = `/realms/${this.kcAdmin.workingRealmName}/protocol/openid-connect/certs`;
    const fullUrl = this.kcAdmin.baseUrl + validatingEndpoint;
    const JWKS = createRemoteJWKSet(new URL(fullUrl));

    const payload = await jwtVerify<AccessTokenPayload<T>>(accessToken, JWKS, {
      issuer: `${this.kcAdmin.baseUrl}/realms/${this.kcAdmin.workingRealmName}`,
    });

    return payload;
  }

  async refreshAccessToken(payload: {
    refreshToken: string;
    clientId: string;
  }): Promise<TokenResponse> {
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
