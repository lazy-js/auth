"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KcApi = void 0;
const KcAdminApi_1 = require("./KcAdminApi");
const RealmApi_1 = require("./RealmApi");
const UserApi_1 = require("./UserApi");
const GroupApi_1 = require("./GroupApi");
const PublicClientApi_1 = require("./PublicClientApi");
const errorMap_1 = require("./errorMap");
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
class KcApi {
    /**
     * @description Create a KcApi instance
     * @param required keycloakCreateObject - The configuration for creating a KcApi instance
     * @params required keycloakCreateObject.url - The url for the KcApi instance
     * @params required keycloakCreateObject.password - The password for the KcApi instance
     * @params required keycloakCreateObject.realmName - The realm name for the KcApi instance
     * @params optional keycloakCreateObject.reAuthenticateIntervalMs - The interval for re-authenticating the KcApi instance
     * @returns Promise<KcApi> - The KcApi instance
     */
    static async create(keycloakCreateObject) {
        const kcAdmin = await KcAdminApi_1.KcAdmin.create(keycloakCreateObject);
        return new KcApi(kcAdmin, errorMap_1.errorTransformer);
    }
    /**
     * @description Create a KcApi instance
     * @param required kcAdmin - The KcAdmin instance
     * @private
     */
    constructor(kcAdmin, errorTransformer) {
        this.kcAdmin = kcAdmin;
        this.errorTransformer = errorTransformer;
        this.kcAdmin = kcAdmin;
        this.realms = new RealmApi_1.RealmApi(kcAdmin, errorTransformer);
        this.groups = new GroupApi_1.GroupApi(kcAdmin, errorTransformer);
        this.users = new UserApi_1.UserApi(kcAdmin, errorTransformer);
        this.publicClients = new PublicClientApi_1.PublicClientApi(kcAdmin, errorTransformer);
    }
}
exports.KcApi = KcApi;
//# sourceMappingURL=KcApi.js.map