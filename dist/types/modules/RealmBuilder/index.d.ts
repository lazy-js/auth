import { IRealm, IRole } from "../Realm/index";
import { IKcApi } from "../kcApi/index";
import { IRealmBuilder, kcApiConfig, InitRealmResponse, InitAppPayload, InitAppResponse, InitClientPayload, InitClientResponse, InitGroupPayload, InitGroupResponse, ProfileAttribute } from "./types";
import { BaseController } from "@lazy-js/server";
import { INotificationClientSdk } from "../../types";
export declare class RealmBuilder extends BaseController implements IRealmBuilder {
    realm: IRealm;
    kcApi: IKcApi;
    notificationClientSdk: INotificationClientSdk;
    static create(realm: IRealm, kcApiConfig: kcApiConfig, notificationClientSdk: INotificationClientSdk): Promise<RealmBuilder>;
    private constructor();
    build(): Promise<void>;
    _initRealm(): Promise<InitRealmResponse>;
    _initApp(initAppPayload: InitAppPayload): Promise<InitAppResponse>;
    _initClient(initClientPayload: InitClientPayload): Promise<InitClientResponse>;
    _initRole(role: IRole, publicClientUuid: string, parentRoleId?: string): Promise<void>;
    _initGroup(initGroupPayload: InitGroupPayload): Promise<InitGroupResponse>;
    _removeUsernameValidator(): Promise<void>;
    _createAttribute(attributeName: string): ProfileAttribute;
    _initUserSchema(userProfileAttributes: string[]): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map