import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { Logger } from '@lazy-js/utils';
import { createUserModel } from '../src/modules/User/model/UserModel';

const testLogger = new Logger();

describe('Testing User Model', () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('the mongodb should be connected', async () => {
    testLogger.info(mongoose.connection.id);
  });

  it('should create the user model', async () => {
    const { UserModel } = createUserModel();
    const user = await UserModel.insertOne({
      keycloakUserId: 'asdf',
    });
  });
});
