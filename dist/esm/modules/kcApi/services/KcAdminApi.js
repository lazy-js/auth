import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { getToken, } from '@keycloak/keycloak-admin-client/lib/utils/auth';
const ADMIN_CLIENT_ID = 'admin-cli';
const ADMIN_USERNAME = 'admin';
const MASTER_REALM_NAME = 'master';
const ADMIN_GRANT_TYPE = 'password';
/**
 * @description KcAdmin class extends the KeycloakAdminClient and is used to authenticate, add `workingRealmName` property and interact with the Keycloak Admin API
 * @extends KeycloakAdminClient
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 */
export class KcAdmin extends KeycloakAdminClient {
    /**
     * @description Create a KcAdmin instance authenticate it, assign interval for re-authenticating it and return the instance
     * @async
     * @param required createKcAdminConfig - The configuration for creating a KcAdmin instance
     * @params required createKcAdminConfig.password - The password for the KcAdmin instance
     * @params number required createKcAdminConfig.reAuthenticateIntervalMs - The interval for re-authenticating the KcAdmin instance
     * @params required createKcAdminConfig.url - The url for the KcAdmin instance
     * @params required createKcAdminConfig.realmName - The realm name for the KcAdmin instance
     * @returns Promise<KcAdmin> - The KcAdmin instance
     */
    static async create(createKcAdminConfig) {
        const { password, reAuthenticateIntervalMs, url, realmName } = createKcAdminConfig;
        const client = new KcAdmin({
            url: url,
            workingRealmName: realmName,
            masterRealmName: MASTER_REALM_NAME,
        });
        // authenticate the client
        await client.authenticate(password);
        // assign interval for re-authenticating the client
        console.log('First time authenticate');
        console.log('Access token expires in', client.expiresIn);
        console.log('Refresh token expires in', client.refreshExpiresIn);
        setInterval(async () => {
            await client.authenticate(password);
            console.log('Re-authenticating the client');
        }, client.expiresIn * 1000 - 10 * 1000);
        return client;
    }
    /**
     * @description Create a KcAdmin instance
     * @param required options - The options for creating a KcAdmin instance
     * @params required options.url - The url for the KcAdmin instance
     * @params required options.masterRealmName - The master realm name for the KcAdmin instance
     * @params required options.workingRealmName - The working realm name for the KcAdmin instance
     */
    constructor(options) {
        super({
            baseUrl: options.url,
            realmName: options.masterRealmName,
        });
        this.workingRealmName = options.workingRealmName;
        this.expiresIn = 0;
        this.refreshExpiresIn = 0;
    }
    /**
     * @description Authenticate the KcAdmin instance
     * @async
     * @param required password - The password for the KcAdmin instance
     * @private
     */
    async authenticate(password) {
        try {
            const { refreshExpiresIn, refreshToken, expiresIn, accessToken } = await getToken({
                realmName: this.realmName,
                baseUrl: this.baseUrl,
                requestOptions: this.getRequestOptions(),
                scope: this.scope,
                credentials: {
                    grantType: ADMIN_GRANT_TYPE,
                    clientId: ADMIN_CLIENT_ID,
                    username: ADMIN_USERNAME,
                    password: password,
                },
            });
            this.accessToken = accessToken;
            this.expiresIn = Number(expiresIn);
            this.refreshExpiresIn = refreshExpiresIn;
            this.refreshToken = refreshToken;
        }
        catch (err) {
            console.log('Error when authenticating to keycloak server');
            console.log(err);
        }
        // await this.auth({
        //         grantType: ADMIN_GRANT_TYPE,
        //         clientId: ADMIN_CLIENT_ID,
        //         username: ADMIN_USERNAME,
        //         password: password,
        // });
    }
}
//# sourceMappingURL=KcAdminApi.js.map