"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KcApi = void 0;
const KcAdminApi_1 = require("./KcAdminApi");
const RealmApi_1 = require("./RealmApi");
const UserApi_1 = require("./UserApi");
const GroupApi_1 = require("./GroupApi");
const PublicClientApi_1 = require("./PublicClientApi");
class KcApi {
    static async create(keycloakCreateObject) {
        const kcAdmin = await KcAdminApi_1.KcAdmin.create(keycloakCreateObject);
        return new KcApi(kcAdmin);
    }
    constructor(kcAdmin) {
        this.kcAdmin = kcAdmin;
        this.kcAdmin = kcAdmin;
        this.realms = new RealmApi_1.RealmApi(kcAdmin);
        this.groups = new GroupApi_1.GroupApi(kcAdmin);
        this.users = new UserApi_1.UserApi(kcAdmin);
        this.publicClients = new PublicClientApi_1.PublicClientApi(kcAdmin);
    }
}
exports.KcApi = KcApi;
//# sourceMappingURL=KcApi.js.map