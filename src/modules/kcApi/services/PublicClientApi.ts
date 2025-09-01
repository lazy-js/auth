import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import errors from '../../../config/errors';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { IPublicClientApi } from '../types';
import { KcAdmin } from './KcAdminApi';

export class PublicClientApi implements IPublicClientApi {
  constructor(public kcAdmin: KcAdmin) {
    this.kcAdmin = kcAdmin;
  }

  async create(paylaod: {
    clientId: string;
    description?: string;
    name: string;
  }) {
    const newClient = await this.kcAdmin.clients.create({
      clientId: paylaod.clientId,
      directAccessGrantsEnabled: true,
      publicClient: true,
      realm: this.kcAdmin.workingRealmName,
      description: paylaod.description,
      name: paylaod.name,
    });

    return { id: newClient.id };
  }

  async getOneByUuid(
    clientUuid: string,
  ): Promise<ClientRepresentation | undefined> {
    return await this.kcAdmin.clients.findOne({
      id: clientUuid,
      realm: this.kcAdmin.workingRealmName,
    });
  }

  async getOneByClientId(
    clientId: string,
  ): Promise<ClientRepresentation | undefined> {
    return (
      await this.kcAdmin.clients.find({
        clientId,
        search: true,
        realm: this.kcAdmin.workingRealmName,
      })
    )[0];
  }

  async addRole(payload: {
    roleName: string;
    clientUuid: string;
    parentRoleId?: string;
  }): Promise<RoleRepresentation> {
    if (payload.parentRoleId) {
      return await this.addChildRole({
        roleName: payload.roleName,
        clientUuid: payload.clientUuid,
        parentRoleId: payload.parentRoleId,
      });
    }
    await this.kcAdmin.clients.createRole({
      id: payload.clientUuid,
      realm: this.kcAdmin.workingRealmName,
      name: payload.roleName,
    });
    const childRole = await this.getRoleByName(payload);
    if (!childRole) throw new Error(errors.UNKNOWN_ERROR_IN_KC_API.code);
    return childRole;
  }

  async addChildRole(payload: {
    roleName: string;
    clientUuid: string;
    parentRoleId: string;
  }): Promise<RoleRepresentation> {
    const doesParentRoleExists = await this.getRoleById({
      roleId: payload.parentRoleId,
      clientUuid: payload.clientUuid,
    });
    if (!doesParentRoleExists) {
      throw new Error(errors.PARENT_ROLE_NOT_EXISTS.code);
    }

    await this.kcAdmin.clients.createRole({
      id: payload.clientUuid,
      realm: this.kcAdmin.workingRealmName,
      name: payload.roleName,
    });

    const childRole = await this.getRoleByName(payload);

    if (!childRole || !childRole.id) {
      throw new Error('addChildRole Error');
    }
    await this.kcAdmin.roles.createComposite(
      {
        roleId: payload.parentRoleId,
        realm: this.kcAdmin.workingRealmName,
      },
      [
        {
          id: childRole.id,
          clientRole: true,
        },
      ],
    );

    return childRole;
  }

  async getRoleById(paylaod: {
    roleId: string;
    clientUuid: string;
  }): Promise<RoleRepresentation | undefined> {
    const roles = await this.getRolesByClientUuid(paylaod);
    return roles.find((role) => role.id === paylaod.roleId);
  }

  async getRolesByClientUuid(payload: {
    clientUuid: string;
  }): Promise<RoleRepresentation[]> {
    return await this.kcAdmin.clients.listRoles({
      id: payload.clientUuid,
      realm: this.kcAdmin.workingRealmName,
    });
  }

  async getRoleByName(paylaod: {
    roleName: string;
    clientUuid: string;
  }): Promise<RoleRepresentation | undefined> {
    return (await this.getRolesByClientUuid(paylaod)).find(
      (el) => el.name === paylaod.roleName,
    );
  }

  async getRolesByParentId(payload: {
    clientUuid: string;
    parentRoleId: string;
  }): Promise<RoleRepresentation[]> {
    return await this.kcAdmin.roles.getCompositeRolesForClient({
      id: payload.parentRoleId,
      clientId: payload.clientUuid,
      realm: this.kcAdmin.workingRealmName,
    });
  }
}
