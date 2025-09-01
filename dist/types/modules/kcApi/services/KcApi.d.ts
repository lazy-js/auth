import { IKcApi, IPublicClientApi, KeycloakCreateObject, IGroupApi, IRealmApi, IUserApi } from '../types';
import { KcAdmin } from './KcAdminApi';
export declare class KcApi implements IKcApi {
    kcAdmin: KcAdmin;
    publicClients: IPublicClientApi;
    groups: IGroupApi;
    users: IUserApi;
    realms: IRealmApi;
    static create(keycloakCreateObject: KeycloakCreateObject): Promise<KcApi>;
    private constructor();
}
//# sourceMappingURL=KcApi.d.ts.map