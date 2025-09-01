import { KcAdmin } from './KcAdminApi';
import { RealmApi } from './RealmApi';
import { UserApi } from './UserApi';
import { GroupApi } from './GroupApi';
import { PublicClientApi } from './PublicClientApi';
export class KcApi {
    static async create(keycloakCreateObject) {
        const kcAdmin = await KcAdmin.create(keycloakCreateObject);
        return new KcApi(kcAdmin);
    }
    constructor(kcAdmin) {
        this.kcAdmin = kcAdmin;
        this.kcAdmin = kcAdmin;
        this.realms = new RealmApi(kcAdmin);
        this.groups = new GroupApi(kcAdmin);
        this.users = new UserApi(kcAdmin);
        this.publicClients = new PublicClientApi(kcAdmin);
    }
}
//# sourceMappingURL=KcApi.js.map