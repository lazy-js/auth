import {
    IKcApi,
    IPublicClientApi,
    KeycloakCreateObject,
    IGroupApi,
    IRealmApi,
    IUserApi,
} from '../types';

import { KcAdmin } from './KcAdminApi';
import { RealmApi } from './RealmApi';
import { UserApi } from './UserApi';
import { GroupApi } from './GroupApi';
import { PublicClientApi } from './PublicClientApi';
import { errorTransformer } from './errorMap';
import { ErrorTransformer } from '@lazy-js/error-guard';

/**
 * @description KcApi class implements the IKcApi interface and is used to create a KcApi instance
 * @description KcApi is the main class that is used to interact with the Keycloak Admin API
 * @example
 * const kcApi = await KcApi.create({
 *  url: "https://keycloak.example.com",
 *  password: "password",
 *  realmName: "realm-name",
 * });
 * @example
 * const publicClients = kcApi.publicClients;
 * const groups = kcApi.groups;
 * const users = kcApi.users;
 * const realms = kcApi.realms;
 * const kcAdmin = kcApi.kcAdmin;

 * @implements IKcApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 * @returns KcApi
 * @returns KcApi.publicClients - The public clients api
 * @returns KcApi.groups - The groups api
 * @returns KcApi.users - The users api
 * @returns KcApi.realms - The realms api
 * @returns KcApi.kcAdmin - The kcAdmin instance that is used to interact with the Keycloak Admin API directly
 */

export class KcApi implements IKcApi {
    public publicClients: IPublicClientApi;
    public groups: IGroupApi;
    public users: IUserApi;
    public realms: IRealmApi;

    /**
     * @description Create a KcApi instance
     * @param required keycloakCreateObject - The configuration for creating a KcApi instance
     * @params required keycloakCreateObject.url - The url for the KcApi instance
     * @params required keycloakCreateObject.password - The password for the KcApi instance
     * @params required keycloakCreateObject.realmName - The realm name for the KcApi instance
     * @params optional keycloakCreateObject.reAuthenticateIntervalMs - The interval for re-authenticating the KcApi instance
     * @returns Promise<KcApi> - The KcApi instance
     */
    static async create(keycloakCreateObject: KeycloakCreateObject) {
        const kcAdmin = await KcAdmin.create(keycloakCreateObject);
        return new KcApi(kcAdmin, errorTransformer);
    }

    /**
     * @description Create a KcApi instance
     * @param required kcAdmin - The KcAdmin instance
     * @private
     */
    private constructor(
        public kcAdmin: KcAdmin,
        public errorTransformer: ErrorTransformer,
    ) {
        this.kcAdmin = kcAdmin;
        this.realms = new RealmApi(kcAdmin, errorTransformer);
        this.groups = new GroupApi(kcAdmin, errorTransformer);
        this.users = new UserApi(kcAdmin, errorTransformer);
        this.publicClients = new PublicClientApi(kcAdmin, errorTransformer);
    }
}
