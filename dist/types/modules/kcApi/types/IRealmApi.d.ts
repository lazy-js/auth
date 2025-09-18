export interface IRealmApi {
    createRealm(): Promise<CreateRealmReturn>;
    realmExists(): Promise<boolean>;
    deleteRealm(): Promise<void>;
}
export interface CreateRealmReturn {
    realmName: string;
}
//# sourceMappingURL=IRealmApi.d.ts.map