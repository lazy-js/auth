import { IApp } from './IApp';
import type { Attribute, AttributeValue } from './shared';

export interface IRealm {
  name: string;
  seperatedUserCollections: boolean;
  setIsSeperatedUserCollections(v: boolean): IRealm;
  apps: IApp[];
  addApp(app: IApp): IRealm;

  realmAttributes?: Attribute;
  addGlobalAttribute(key: string, value: AttributeValue): IRealm;
}
