import { Router } from '@lazy-js/server';
import { IRealm, IApp, IClient, IGroup, IRole } from '../../Realm';
import { IKcApi } from '../../kcApi';
export interface kcApiConfig {
    url: string;
    password: string;
}
export interface InitRealmResponse {
    id: string;
    realmAttributes: any;
}
export interface InitAppPayload {
    app: IApp;
    realmId: string;
}
export interface InitAppResponse {
    id: string;
    appAttributes: any;
}
export interface InitClientPayload {
    client: IClient;
    appId: string;
}
export interface InitClientResponse {
    clientUuid: string;
    clientGroupId: string;
}
export interface InitGroupPayload {
    group: IGroup;
    clientGroupId: string;
    clientUuid: string;
}
export interface InitGroupResponse {
    id: string;
    groupAttributes: any;
}
export interface ProfileAttribute {
    name: string;
    displayName: string;
    permissions: {
        view: ('admin' | 'user')[];
        edit: ('admin' | 'user')[];
    };
    multivalued: boolean;
}
export interface IRealmBuilder {
    realm: IRealm;
    kcApi: IKcApi;
    router: Router;
    getRouter(): Router;
    build(): Promise<void>;
    _initRealm(): Promise<InitRealmResponse>;
    _initApp(initAppPayload: InitAppPayload): Promise<InitAppResponse>;
    _initClient(initClientPayload: InitClientPayload): Promise<InitClientResponse>;
    _initGroup(initGroupPayload: InitGroupPayload): Promise<InitGroupResponse>;
    _initRole(role: IRole, publicClientUuid: string, parentRoleId?: string): Promise<void>;
    _removeUsernameValidator(): Promise<void>;
    _createAttribute(attributeName: string): ProfileAttribute;
    _initUserSchema(userProfileAttributes: string[]): Promise<void>;
}
//# sourceMappingURL=IRealmBuilder.d.ts.map