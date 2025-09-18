import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { Logger } from "@lazy-js/utils";
import { createUserModel } from "../modules/User/model/UserModel";
import { defineConfig } from "vitest/config";

const testLogger = new Logger();

// disable testing for this file
export default defineConfig({
        test: {
                exclude: ["tests/UserModel.test.ts"],
        },
});

describe("Testing User Model", () => {
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

        it("the mongodb should be connected", async () => {
                testLogger.info(mongoose.connection.id);
        });

        it("should create the user model", async () => {
                const { UserModel } = createUserModel();
                const user = await UserModel.insertOne({
                        keycloakUserId: "asdf",
                });
        });
});
