import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { KeycloakCreateObject } from '../types/shared';

const ADMIN_CLIENT_ID = 'admin-cli';
const ADMIN_USERNAME = 'admin';
const MASTER_REALM_NAME = 'master';
const ADMIN_GRANT_TYPE = 'password';

interface KeycloakAadminConfig {
  url: string;
  masterRealmName: string;
  workingRealName: string;
}

export class KcAdmin extends KeycloakAdminClient {
  static async create({
    password,
    url,
    realmName,
    reAuthenticateIntervalMs = 5000,
  }: KeycloakCreateObject) {
    const client = new KcAdmin({
      url: url,
      workingRealName: realmName,
      masterRealmName: MASTER_REALM_NAME,
    });
    await client.authenticate(password);
    setInterval(async () => {
      await client.authenticate(password);
    }, reAuthenticateIntervalMs);
    return client;
  }

  public workingRealmName: string;
  private constructor(options: KeycloakAadminConfig) {
    super({
      baseUrl: options.url,
      realmName: options.masterRealmName,
    });
    this.workingRealmName = options.workingRealName;
  }

  async authenticate(password: string) {
    await this.auth({
      grantType: ADMIN_GRANT_TYPE,
      clientId: ADMIN_CLIENT_ID,
      username: ADMIN_USERNAME,
      password: password,
    });
  }
}
