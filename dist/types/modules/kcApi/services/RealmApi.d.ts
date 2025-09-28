import { IRealmApi, CreateRealmReturn } from '../types';
import { KcAdmin } from './KcAdminApi';
import { ErrorTransformer } from '@lazy-js/error-guard';
/**
 * @description RealmApi class implements the IRealmApi interface and is used to interact with the Keycloak Realm API
 * @implements IRealmApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 */
export declare class RealmApi implements IRealmApi {
    kcAdmin: KcAdmin;
    errorTransformer: ErrorTransformer;
    constructor(kcAdmin: KcAdmin, errorTransformer: ErrorTransformer);
    /**
     * @description Create a realm
     * @returns Promise<CreateRealmReturn> - The realm as { realmName: string }
     */
    createRealm(): Promise<CreateRealmReturn>;
    /**
     * @description Check if a realm exists
     * @returns Promise<boolean> - true if the realm exists, false otherwise
     */
    realmExists(): Promise<boolean>;
    /**
     * @description Delete a realm if it exists and nothing if not exists
     * @returns Promise<void> - void
     */
    deleteRealm(): Promise<void>;
}
//# sourceMappingURL=RealmApi.d.ts.map