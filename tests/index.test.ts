import { LazyAuth, KeycloakConfig, ServiceConfig } from '../src';
import { realm } from './utils/realm';
import { MockNotificationClientSdk } from './utils/MockNotificationSdkClient';
import { beforeAll, describe, it, afterAll, expect } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { KcApi } from '../src/modules/kcApi';

describe('Lazy Auth Testing Suite', () => {
  let mongoServer: MongoMemoryServer;
  let lazyAuthService: LazyAuth;
  let kcApi: KcApi;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoDbUrl = mongoServer.getUri();

    const keycloakConfig: KeycloakConfig = {
      keycloakServiceUrl: 'http://localhost:8080',
      keycloakAdminPassword: 'admin',
    };

    const serverConfig: ServiceConfig = {
      port: 8081,
      allowedOrigins: ['*'],
      routerPrefix: '/api/v1',
      mongoDbUrl,
    };

    const notificationSdk = new MockNotificationClientSdk();

    lazyAuthService = new LazyAuth(
      keycloakConfig,
      serverConfig,
      realm,
      notificationSdk,
    );

    kcApi = await KcApi.create({
      url: keycloakConfig.keycloakServiceUrl,
      password: keycloakConfig.keycloakAdminPassword,
      realmName: realm.name,
    });
    await kcApi.realms.deleteRealm();
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('should start the server', async () => {
    await lazyAuthService.start();
    expect(1).toBe(1);
  });
});
