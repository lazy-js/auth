import { IPublicClientApi } from './IPublicClientApi';
import { IGroupApi } from './IGroupApi';
import { IUserApi } from './IUserApi';
import { IRealmApi } from './IRealmApi';

export interface IKcApi {
  realms: IRealmApi;
  groups: IGroupApi;
  users: IUserApi;
  publicClients: IPublicClientApi;
}
