import { randomHex } from "@lazy-js/utils";

// Test configuration
export const testConfig = {
        url: "http://localhost:8080",
        password: "admin",
        realmName: "kcApiTestTs" + randomHex(10),
        reAuthenticateIntervalMs: 39999,
};

// Test data
export const testData = {
        clientId: "integration-test-client",
        username: "testuser",
        email: "test@example.com",
        password: "TestPassword123!",
        groupName: "test-group",
        roleName: "test-role",
};
