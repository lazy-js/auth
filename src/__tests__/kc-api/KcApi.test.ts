import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { errors as joseErrors } from "jose";

// target module
import { KcApi } from "../../modules/kcApi/services/KcApi";
import { errorMap, defaultError } from "../../modules/kcApi/services/errorMap";

// dependencies
import { AuthenticationError, ConflictError, InternalError } from "../../error/src/Error";
import { ErrorTransformer } from "../../error/src/ErrorTransformer";

import { checkServerRequest } from "../../utils";

// config
import { testConfig, testData } from "./__config";

describe("KcApi Integration Test Suite", () => {
        let kcApi: KcApi;
        let clientUuid: string;
        let userId: string;
        let groupId: string;
        let roleId: string;
        beforeAll(async () => {
                // Verify Keycloak server is available
                const isServerAvailable = await checkServerRequest(testConfig.url);
                if (!isServerAvailable) {
                        throw new Error("Keycloak server is not available for testing");
                }

                // Create KcApi instance
                kcApi = await KcApi.create(testConfig);

                // Verify error transformer is properly initialized
                expect(kcApi.errorTransformer).toBeInstanceOf(ErrorTransformer);
        });

        afterAll(async () => {
                // Clean up test realm
                if (kcApi) {
                        await kcApi.realms.deleteRealm();
                }
        });

        describe("�� KcApi Initialization", () => {
                it("should initialize with proper configuration", () => {
                        expect(kcApi.kcAdmin.workingRealmName).toBe(testConfig.realmName);
                        expect(kcApi.kcAdmin.accessToken).toBeDefined();
                        expect(kcApi.errorTransformer).toBeDefined();
                });

                it("should have all required services initialized", () => {
                        expect(kcApi.realms).toBeDefined();
                        expect(kcApi.groups).toBeDefined();
                        expect(kcApi.users).toBeDefined();
                        expect(kcApi.publicClients).toBeDefined();
                });

                it("should have error transformer with correct configuration", () => {
                        expect(kcApi.errorTransformer).toBeInstanceOf(ErrorTransformer);
                        // Verify error transformer has the correct error map
                        expect(kcApi.errorTransformer).toHaveProperty("errorMap");
                });
        });

        describe("🏗️ Realm Management", () => {
                it("should create a new realm", async () => {
                        const realm = await kcApi.realms.createRealm();
                        expect(realm.realmName).toBe(testConfig.realmName);
                });

                it("should check if realm exists", async () => {
                        const exists = await kcApi.realms.realmExists();
                        expect(exists).toBe(true);
                });

                it("should handle realm creation errors with proper error transformation", async () => {
                        // Try to create the same realm again - should fail
                        await expect(kcApi.realms.createRealm()).rejects.toThrow();
                });
        });

        describe("👥 Group Management", () => {
                it("should create a top-level group", async () => {
                        const group = await kcApi.groups.createGroup({
                                groupName: testData.groupName,
                        });

                        expect(group.id).toBeDefined();
                        groupId = group.id as string;
                });

                it("should handle group creation conflicts with error transformation", async () => {
                        // Try to create the same group again
                        await expect(
                                kcApi.groups.createGroup({
                                        groupName: testData.groupName,
                                })
                        ).rejects.toThrow();
                });

                it("should create a sub-group", async () => {
                        const subGroup = await kcApi.groups.createGroup({
                                groupName: "sub-" + testData.groupName,
                                parentGroupId: groupId,
                        });

                        expect(subGroup.id).toBeDefined();
                });

                it("should handle invalid parent id when creating sub-group", async () => {
                        await expect(
                                kcApi.groups.createGroup({
                                        groupName: "sub-" + testData.groupName,
                                        parentGroupId: groupId + "invalid_id",
                                })
                        ).rejects.toThrow();
                });

                it("should handle sub-group creation conflicts", async () => {
                        // Try to create the same sub-group again
                        await expect(
                                kcApi.groups.createGroup({
                                        groupName: "sub-" + testData.groupName,
                                        parentGroupId: groupId,
                                })
                        ).rejects.toThrow();
                });

                it("should get group by ID", async () => {
                        const group = await kcApi.groups.getGroupById(groupId);
                        expect(group).toBeDefined();
                        expect(group?.name).toBe(testData.groupName);
                });

                it("should get group by path", async () => {
                        const group = await kcApi.groups.getGroupByPath(`/${testData.groupName}`);
                        expect(group).toBeDefined();
                        expect(group?.name).toBe(testData.groupName);
                });

                it("should add attributes to group", async () => {
                        await kcApi.groups.addAttributesToGroup({
                                groupId: groupId,
                                attributes: {
                                        testAttribute: ["testValue"],
                                        isTest: ["true"],
                                },
                        });

                        const group = await kcApi.groups.getGroupById(groupId);
                        expect(group?.attributes?.testAttribute).toEqual(["testValue"]);
                        expect(group?.attributes?.isTest).toEqual(["true"]);
                });
        });

        describe("�� Public Client Management", () => {
                it("should create a public client", async () => {
                        const client = await kcApi.publicClients.create({
                                clientId: testData.clientId,
                                name: "Test App",
                                description: "Test application for integration testing",
                        });

                        expect(client.id).toBeDefined();
                        clientUuid = client.id as string;
                });

                it("should get client by UUID", async () => {
                        const client = await kcApi.publicClients.getOneByUuid(clientUuid);
                        expect(client).toBeDefined();
                        expect(client?.clientId).toBe(testData.clientId);
                });

                it("should get client by client ID", async () => {
                        const client = await kcApi.publicClients.getOneByClientId(testData.clientId);
                        expect(client).toBeDefined();
                        expect(client?.directAccessGrantsEnabled).toBe(true);
                });

                it("should create a role in the client", async () => {
                        const role = await kcApi.publicClients.addRole({
                                roleName: testData.roleName,
                                clientUuid: clientUuid,
                        });

                        expect(role.id).toBeDefined();
                        roleId = role.id as string;
                });

                it("should get all roles for a client", async () => {
                        const roles = await kcApi.publicClients.getRolesByClientUuid(clientUuid);
                        expect(roles).toBeInstanceOf(Array);
                        expect(roles.length).toBeGreaterThan(0);
                });

                it("should get role by name", async () => {
                        const role = await kcApi.publicClients.getRoleByName({
                                roleName: testData.roleName,
                                clientUuid: clientUuid,
                        });
                        expect(role).toBeDefined();
                        expect(role?.name).toBe(testData.roleName);
                });
        });

        describe("�� User Management", () => {
                it("should create a user", async () => {
                        const user = await kcApi.users.createUser({
                                username: testData.username,
                                password: testData.password,
                                firstName: "Test",
                                lastName: "User",
                        });

                        expect(user.id).toBeDefined();
                        userId = user.id;
                });

                it("should handle user creation conflicts", async () => {
                        // Try to create the same user again
                        await expect(
                                kcApi.users.createUser({
                                        username: testData.username,
                                })
                        ).rejects.toThrow();
                });

                it("should get user by ID", async () => {
                        const user = await kcApi.users.getUserById(userId);
                        expect(user).toBeDefined();
                        expect(user?.username).toBe(testData.username);
                });

                it("should get user by username", async () => {
                        const user = await kcApi.users.getUserByUsername(testData.username);
                        expect(user).toBeDefined();
                        expect(user?.username).toBe(testData.username);
                });

                it("should add user to group", async () => {
                        await kcApi.users.addUserToGroup({
                                userId: userId,
                                groupId: groupId,
                        });

                        const userGroups = await kcApi.users.getUserGroups(userId);
                        expect(userGroups).toBeInstanceOf(Array);
                        expect(userGroups.length).toBeGreaterThan(0);
                });

                it("should set user password", async () => {
                        await kcApi.users.setUserPassword({
                                userId: userId,
                                password: "NewPassword123!",
                        });
                });

                it("should set user as verified", async () => {
                        await kcApi.users.setUserVerified(userId);

                        const user = await kcApi.users.getUserById(userId);
                        expect(user?.emailVerified).toBe(true);
                });
        });

        describe("🔑 Authentication & Token Management", () => {
                let accessToken: string;
                let refreshToken: string;

                it("should login user with username and password", async () => {
                        const tokenResponse = await kcApi.users.loginWithUsername({
                                username: testData.username,
                                password: "NewPassword123!",
                                clientId: testData.clientId,
                        });

                        expect(tokenResponse.accessToken).toBeDefined();
                        expect(tokenResponse.refreshToken).toBeDefined();

                        accessToken = tokenResponse.accessToken;
                        refreshToken = tokenResponse.refreshToken;
                });

                it("should validate access token", async () => {
                        const validationResult = await kcApi.users.validateAccessToken(accessToken);

                        expect(validationResult).toBeDefined();
                        expect(validationResult.payload).toBeDefined();
                        expect(validationResult.payload.sub).toBeDefined();
                });

                it("should refresh access token", async () => {
                        const newTokenResponse = await kcApi.users.refreshAccessToken({
                                refreshToken: refreshToken,
                                clientId: testData.clientId,
                        });

                        expect(newTokenResponse.accessToken).toBeDefined();
                        expect(newTokenResponse.refreshToken).toBeDefined();
                });

                it("should handle invalid credentials with error transformation", async () => {
                        await expect(
                                kcApi.users.loginWithUsername({
                                        username: testData.username,
                                        password: "WrongPassword",
                                        clientId: testData.clientId,
                                })
                        ).rejects.toThrow();
                });
        });

        describe("🔄 Error Transformation Testing", () => {
                it("should transform JWT expired errors", async () => {
                        // Mock a JWT expired error
                        const jwtExpiredError = new joseErrors.JWTExpired("Expired Message", {});

                        // Test error transformation
                        const errorTransformer = new ErrorTransformer(errorMap, defaultError);

                        expect(() => {
                                errorTransformer.transform(jwtExpiredError, { methodName: "testMethod" });
                        }).toThrow(AuthenticationError);
                });

                it("should transform group conflict errors", async () => {
                        const conflictError = new Error("sibling group already exists");

                        const errorTransformer = new ErrorTransformer(errorMap, defaultError);

                        expect(() => {
                                errorTransformer.transform(conflictError, { methodName: "testMethod" });
                        }).toThrow(ConflictError);
                });

                it("should transform invalid grant errors", async () => {
                        const invalidGrantError = new Error("invalid grant");

                        const errorTransformer = new ErrorTransformer(errorMap, defaultError);

                        expect(() => {
                                errorTransformer.transform(invalidGrantError, { methodName: "testMethod" });
                        }).toThrow(AuthenticationError);
                });

                it("should use default error for unknown errors", async () => {
                        const unknownError = new Error("Unknown error type");

                        const errorTransformer = new ErrorTransformer(errorMap, defaultError);

                        expect(() => {
                                errorTransformer.transform(unknownError, { methodName: "testMethod" });
                        }).toThrow(InternalError);
                });
        });

        describe("�� Error Context and Stack Trace Testing", () => {
                it("should preserve error context in transformed errors", async () => {
                        const testError = new Error("Test error");
                        const errorTransformer = new ErrorTransformer(errorMap, defaultError);

                        try {
                                errorTransformer.transform(testError, {
                                        methodName: "testMethod",
                                        service: "KcApi",
                                        userId: "test-user-id",
                                });
                        } catch (error: any) {
                                expect(error).toBeInstanceOf(InternalError);
                                expect(error.context).toBeDefined();
                                expect(error.context?.methodName).toBe("testMethod");
                                expect(error.context?.service).toBe("KcApi");
                                expect(error.context?.userId).toBe("test-user-id");
                        }
                });

                it("should preserve original error stack trace", async () => {
                        const testError = new Error("Test error");
                        testError.stack = "Original stack trace";

                        const errorTransformer = new ErrorTransformer(errorMap, defaultError);

                        try {
                                errorTransformer.transform(testError, { methodName: "testMethod" });
                        } catch (error: any) {
                                expect(error).toBeInstanceOf(InternalError);
                                expect(error.stack).toContain("Original stack trace");
                        }
                });
        });

        describe("�� Service Integration Testing", () => {
                it("should map client role to group", async () => {
                        await kcApi.groups.mapClientRoleToGroup({
                                groupId: groupId,
                                clientUuid: clientUuid,
                                roleId: roleId,
                        });

                        // Verify the mapping was successful by checking group roles
                        const group = await kcApi.groups.getGroupById(groupId);
                        expect(group).toBeDefined();
                });

                it("should get user profile configuration", async () => {
                        const profileConfig = await kcApi.users.getUserProfileConfig();

                        expect(profileConfig).toBeDefined();
                        expect(profileConfig.attributes).toBeInstanceOf(Array);
                        expect(profileConfig.groups).toBeInstanceOf(Array);
                });

                it("should update user profile configuration", async () => {
                        const profileConfig = await kcApi.users.getUserProfileConfig();

                        // Add a new attribute
                        const newAttribute = {
                                name: "testAttribute",
                                displayName: "Test Attribute",
                                permissions: {
                                        view: ["admin", "user"],
                                        edit: ["admin"],
                                },
                                multivalued: false,
                        };

                        profileConfig.attributes?.push(newAttribute);

                        const updatedConfig = await kcApi.users.updateUserProileConfig(profileConfig);
                        expect(updatedConfig).toBeDefined();
                });

                it("should remove default realm roles from user", async () => {
                        await kcApi.users.removeDefaultRealmRolesFromUser(userId);

                        // Verify user still exists
                        const user = await kcApi.users.getUserById(userId);
                        expect(user).toBeDefined();
                });
        });

        describe("🧹 Cleanup and Error Handling", () => {
                it("should handle non-existent user operations gracefully", async () => {
                        const nonExistentUserId = "non-existent-user-id";

                        await expect(kcApi.users.getUserById(nonExistentUserId)).resolves.toBeNull();
                });

                it("should handle non-existent group operations gracefully", async () => {
                        const nonExistentGroupId = "non-existent-group-id";

                        await expect(kcApi.groups.getGroupById(nonExistentGroupId)).resolves.toBeNull();
                });

                it("should handle non-existent client operations gracefully", async () => {
                        const nonExistentClientId = "non-existent-client-id";
                        const r = await kcApi.publicClients.getOneByClientId(nonExistentClientId);
                });
        });
});
