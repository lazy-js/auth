import { IRealmApi } from '../types';
import { KcAdmin } from './KcAdminApi';
export declare class RealmApi implements IRealmApi {
    kcAdmin: KcAdmin;
    constructor(kcAdmin: KcAdmin);
    createRealm(): Promise<{
        realmName: string;
    }>;
    realmExists(): Promise<boolean>;
    deleteRealm(): Promise<boolean>;
}
//# sourceMappingURL=RealmApi.d.ts.map