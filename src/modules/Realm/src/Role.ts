import { IRole } from '../types';

export class Role implements IRole {
  public name: string;
  public description: string;
  public roles: IRole[];
  public rolesFlaten: string[];

  constructor(name: string) {
    this.name = name;
    this.description = '';
    this.roles = [];
    this.rolesFlaten = [name];
  }

  hasChildren(): boolean {
    return !!this.roles.length;
  }

  addChildRole(role: IRole): IRole {
    this.rolesFlaten = [...this.rolesFlaten, ...role.rolesFlaten];
    this.roles.push(role);
    return this;
  }

  setDescription(desc: string): IRole {
    this.description = desc;
    return this;
  }

  addChildRoles(roles: IRole[]): IRole {
    roles.map((role) => this.addChildRole(role));
    return this;
  }
}
