import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
const ADMIN_CLIENT_ID = 'admin-cli';
const ADMIN_USERNAME = 'admin';
const MASTER_REALM_NAME = 'master';
const ADMIN_GRANT_TYPE = 'password';
export class KcAdmin extends KeycloakAdminClient {
    static async create({ password, url, realmName, reAuthenticateIntervalMs = 5000, }) {
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
    constructor(options) {
        super({
            baseUrl: options.url,
            realmName: options.masterRealmName,
        });
        this.workingRealmName = options.workingRealName;
    }
    async authenticate(password) {
        await this.auth({
            grantType: ADMIN_GRANT_TYPE,
            clientId: ADMIN_CLIENT_ID,
            username: ADMIN_USERNAME,
            password: password,
        });
    }
}
//# sourceMappingURL=KcAdminApi.js.map