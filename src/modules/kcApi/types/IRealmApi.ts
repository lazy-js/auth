export interface IRealmApi {
  createRealm(): Promise<{ realmName: string }>;
  realmExists(): Promise<boolean>;
  deleteRealm(): Promise<boolean>;
}
