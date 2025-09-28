import { IRealmApi, CreateRealmReturn } from '../types';
import { KcAdmin } from './KcAdminApi';
import { ErrorTransformer, AutoTransform } from '@lazy-js/error-guard';

/**
 * @description RealmApi class implements the IRealmApi interface and is used to interact with the Keycloak Realm API
 * @implements IRealmApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 */
@AutoTransform({
    exclude: ['realmExists'],
})
export class RealmApi implements IRealmApi {
    constructor(
        public kcAdmin: KcAdmin,
        public errorTransformer: ErrorTransformer,
    ) {
        this.kcAdmin = kcAdmin;
        this.errorTransformer = errorTransformer;
    }

    /**
     * @description Create a realm
     * @returns Promise<CreateRealmReturn> - The realm as { realmName: string }
     */
    async createRealm(): Promise<CreateRealmReturn> {
        const realm = await this.kcAdmin.realms.create({
            realm: this.kcAdmin.workingRealmName,
            verifyEmail: false,
            enabled: true,
            defaultRoles: [],
            requiredActions: realmRequiredActions,
        });

        return { realmName: realm.realmName };
    }

    /**
     * @description Check if a realm exists
     * @returns Promise<boolean> - true if the realm exists, false otherwise
     */
    async realmExists(): Promise<boolean> {
        try {
            const realm = await this.kcAdmin.realms.findOne({
                realm: this.kcAdmin.workingRealmName,
            });
            return !!realm;
        } catch (error) {
            return false;
        }
    }

    /**
     * @description Delete a realm if it exists and nothing if not exists
     * @returns Promise<void> - void
     */
    async deleteRealm(): Promise<void> {
        if (await this.realmExists())
            await this.kcAdmin.realms.del({
                realm: this.kcAdmin.workingRealmName,
            });
    }
}

/**
 * @description Realm required actions provided ids
 * @type {Object}
 * @property {Object} realmRequiredActionsProvidedIds - The realm required actions provided ids
 */
const realmRequiredActionsProvidedIds: {
    [key: string]: {
        priority: number;
        enabled: boolean;
        defaultAction: boolean;
    };
} = {
    update_user_locale: { priority: 10, enabled: false, defaultAction: false },
    CONFIGURE_TOTP: { priority: 20, enabled: false, defaultAction: false },
    TERMS_AND_CONDITIONS: {
        priority: 30,
        enabled: false,
        defaultAction: false,
    },
    UPDATE_PASSWORD: { priority: 40, enabled: false, defaultAction: false },
    UPDATE_PROFILE: { priority: 50, enabled: false, defaultAction: false },
    VERIFY_EMAIL: { priority: 60, enabled: false, defaultAction: false },
    delete_account: { priority: 70, enabled: false, defaultAction: false },
    'webauthn-register': { priority: 80, enabled: false, defaultAction: false },
    'webauthn-register-passwordless': {
        priority: 90,
        enabled: false,
        defaultAction: false,
    },
    VERIFY_PROFILE: { priority: 100, enabled: false, defaultAction: false },
    delete_credential: { priority: 1000, enabled: false, defaultAction: false },
};

/**
 * @description Realm required actions
 * @type {Object}
 * @property {Object} realmRequiredActions - The realm required actions
 */
const realmRequiredActions = Object.keys(realmRequiredActionsProvidedIds).map(
    (id) => {
        return {
            alias: id,
            name: id,
            providerId: id,
            enabled: realmRequiredActionsProvidedIds[id].enabled,
            defaultAction: realmRequiredActionsProvidedIds[id].defaultAction,
            priority: realmRequiredActionsProvidedIds[id].priority,
            config: {},
        };
    },
);
