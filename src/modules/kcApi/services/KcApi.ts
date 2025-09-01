import {
  IKcApi,
  IPublicClientApi,
  KeycloakCreateObject,
  IGroupApi,
  IRealmApi,
  IUserApi,
} from '../types';

import { KcAdmin } from './KcAdminApi';
import { RealmApi } from './RealmApi';
import { UserApi } from './UserApi';
import { GroupApi } from './GroupApi';
import { PublicClientApi } from './PublicClientApi';

export class KcApi implements IKcApi {
  public publicClients: IPublicClientApi;
  public groups: IGroupApi;
  public users: IUserApi;
  public realms: IRealmApi;

  static async create(keycloakCreateObject: KeycloakCreateObject) {
    const kcAdmin = await KcAdmin.create(keycloakCreateObject);

    return new KcApi(kcAdmin);
  }

  private constructor(public kcAdmin: KcAdmin) {
    this.kcAdmin = kcAdmin;
    this.realms = new RealmApi(kcAdmin);
    this.groups = new GroupApi(kcAdmin);
    this.users = new UserApi(kcAdmin);
    this.publicClients = new PublicClientApi(kcAdmin);
  }
}
