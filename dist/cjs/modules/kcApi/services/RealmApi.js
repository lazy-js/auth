"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealmApi = void 0;
const KcAdminApi_1 = require("./KcAdminApi");
const ErrorTransformer_1 = require("../../../error/src/ErrorTransformer");
const decorators_1 = require("../../../error/src/decorators");
/**
 * @description RealmApi class implements the IRealmApi interface and is used to interact with the Keycloak Realm API
 * @implements IRealmApi
 * @author Mahmoud Karsha
 * @version 1.0.0
 * @since 1.0.0
 */
let RealmApi = class RealmApi {
    constructor(kcAdmin, errorTransformer) {
        this.kcAdmin = kcAdmin;
        this.errorTransformer = errorTransformer;
        this.kcAdmin = kcAdmin;
        this.errorTransformer = errorTransformer;
    }
    /**
     * @description Create a realm
     * @returns Promise<CreateRealmReturn> - The realm as { realmName: string }
     */
    async createRealm() {
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
    async realmExists() {
        try {
            const realm = await this.kcAdmin.realms.findOne({
                realm: this.kcAdmin.workingRealmName,
            });
            return !!realm;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * @description Delete a realm if it exists and nothing if not exists
     * @returns Promise<void> - void
     */
    async deleteRealm() {
        if (await this.realmExists())
            await this.kcAdmin.realms.del({
                realm: this.kcAdmin.workingRealmName,
            });
    }
};
exports.RealmApi = RealmApi;
exports.RealmApi = RealmApi = __decorate([
    (0, decorators_1.AutoTransform)({
        exclude: ['realmExists'],
    }),
    __metadata("design:paramtypes", [KcAdminApi_1.KcAdmin, ErrorTransformer_1.ErrorTransformer])
], RealmApi);
/**
 * @description Realm required actions provided ids
 * @type {Object}
 * @property {Object} realmRequiredActionsProvidedIds - The realm required actions provided ids
 */
const realmRequiredActionsProvidedIds = {
    update_user_locale: { priority: 10, enabled: false, defaultAction: false },
    CONFIGURE_TOTP: { priority: 20, enabled: false, defaultAction: false },
    TERMS_AND_CONDITIONS: { priority: 30, enabled: false, defaultAction: false },
    UPDATE_PASSWORD: { priority: 40, enabled: false, defaultAction: false },
    UPDATE_PROFILE: { priority: 50, enabled: false, defaultAction: false },
    VERIFY_EMAIL: { priority: 60, enabled: false, defaultAction: false },
    delete_account: { priority: 70, enabled: false, defaultAction: false },
    'webauthn-register': { priority: 80, enabled: false, defaultAction: false },
    'webauthn-register-passwordless': { priority: 90, enabled: false, defaultAction: false },
    VERIFY_PROFILE: { priority: 100, enabled: false, defaultAction: false },
    delete_credential: { priority: 1000, enabled: false, defaultAction: false },
};
/**
 * @description Realm required actions
 * @type {Object}
 * @property {Object} realmRequiredActions - The realm required actions
 */
const realmRequiredActions = Object.keys(realmRequiredActionsProvidedIds).map((id) => {
    return {
        alias: id,
        name: id,
        providerId: id,
        enabled: realmRequiredActionsProvidedIds[id].enabled,
        defaultAction: realmRequiredActionsProvidedIds[id].defaultAction,
        priority: realmRequiredActionsProvidedIds[id].priority,
        config: {},
    };
});
//# sourceMappingURL=RealmApi.js.map