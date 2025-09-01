"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KcAdmin = void 0;
const keycloak_admin_client_1 = __importDefault(require("@keycloak/keycloak-admin-client"));
const ADMIN_CLIENT_ID = 'admin-cli';
const ADMIN_USERNAME = 'admin';
const MASTER_REALM_NAME = 'master';
const ADMIN_GRANT_TYPE = 'password';
class KcAdmin extends keycloak_admin_client_1.default {
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
exports.KcAdmin = KcAdmin;
//# sourceMappingURL=KcAdminApi.js.map