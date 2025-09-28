import { RealmBuilder } from '../modules/RealmBuilder';
import { testRealm as realm } from './utils/realm';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MockNotificationClientSdk } from './utils/MockNotificationSdkClient';
//         "mongodb-memory-server": "^10.2.0",

import { MongoMemoryServer } from 'mongodb-memory-server';
import { Database } from '../database';

const kcApiOptions = {
    url: 'http://localhost:8080',
    password: 'admin',
    reAuthenticateIntervalMs: 5000,
};

const notificationClientSdk = new MockNotificationClientSdk();

describe('Realm Builder Testing Suite', () => {
    let realmBuilder: RealmBuilder;
    let realmId: string;
    let appId: string;
    let mongoServer: MongoMemoryServer;
    let db: Database;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        db = new Database(mongoUri);
        await db.connect();
        realmBuilder = await RealmBuilder.create(
            realm,
            kcApiOptions,
            notificationClientSdk,
        );

        await realmBuilder.kcApi.realms.deleteRealm();
    });

    afterAll(async () => {
        await db.disconnect();
        await mongoServer.stop();
        await realmBuilder.kcApi.realms.deleteRealm();
    });

    it('the realm should not be existed for first time', async () => {
        const realmExists = await realmBuilder.kcApi.realms.realmExists();
        expect(realmExists).toBe(false);
    });

    it('should init the realm', async () => {
        const realm = await realmBuilder._initRealm();
        expect(realm?.id).toBeDefined();
        realmId = realm?.id as string;
        expect(realm?.realmAttributes).toBeDefined();
    });

    it('should create the applications of realm', async () => {
        const app = realmBuilder.realm.apps[0];
        const createdApp = await realmBuilder._initApp({
            app,
            realmId,
        });
        appId = createdApp.id;
        expect(createdApp.id).toBeDefined();
    });

    it('should init clients of the application', async () => {
        const client = realmBuilder.realm.apps[0].clients[0];
        const createdClient = await realmBuilder._initClient({
            client,
            appId,
        });
        expect(createdClient.clientUuid).toBeDefined();
    });

    it('should delete the realm', async () => {
        const doesExistBeforeDelete =
            await realmBuilder.kcApi.realms.realmExists();
        expect(doesExistBeforeDelete).toBe(true);
        await realmBuilder.kcApi.realms.deleteRealm();
        const doesExistAfterDelete =
            await realmBuilder.kcApi.realms.realmExists();
        expect(doesExistAfterDelete).toBe(false);
    });

    it('should initialize the realm', async () => {
        await realmBuilder.build();
    });
});
