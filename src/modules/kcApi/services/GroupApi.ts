import { NetworkError } from '@keycloak/keycloak-admin-client';
import errors from '../../../config/errors';
import type GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import type { Attributes } from '../types/shared';
import { KcAdmin } from './KcAdminApi';
import { IGroupApi } from '../types/IGroupApi';
import { kcErrorHandler } from '../../../utils/kcApiErrorHandler';

export class GroupApi implements IGroupApi {
  constructor(public kcAdmin: KcAdmin) {
    this.kcAdmin = kcAdmin;
  }

  async createGroup(payload: {
    groupName: string;
    parentGroupId?: string;
    attributes?: Attributes;
  }): Promise<{ id: string }> {
    try {
      if (payload.parentGroupId) {
        return await this.createChildGroup({
          parentGroupId: payload.parentGroupId,
          groupName: payload.groupName,
          attributes: payload.attributes,
        });
      }

      return await this.kcAdmin.groups.create({
        name: payload.groupName,
        realm: this.kcAdmin.workingRealmName,
        attributes: payload.attributes,
      });
    } catch (err) {
      kcErrorHandler(err);
    }
  }

  async createChildGroup(paylaod: {
    parentGroupId: string;
    groupName: string;
    attributes?: Attributes;
  }): Promise<{ id: string }> {
    return await this.kcAdmin.groups.createChildGroup(
      {
        id: paylaod.parentGroupId,
        realm: this.kcAdmin.workingRealmName,
      },
      {
        name: paylaod.groupName,
        attributes: paylaod.attributes,
      },
    );
  }

  async getSubGroupsByParentId(
    parentId: string,
  ): Promise<GroupRepresentation[]> {
    const result = await this.kcAdmin.groups.listSubGroups({
      parentId,
      realm: this.kcAdmin.workingRealmName,
      populateHierarchy: true,
    });

    return result;
  }

  async getGroupByPath(path: string): Promise<GroupRepresentation | undefined> {
    const parentGroup = await this.kcAdmin.realms.getGroupByPath({
      path: path,
      realm: this.kcAdmin.workingRealmName,
    });
    return parentGroup;
  }

  async getGroupsByParentPath(
    parentPath: string,
  ): Promise<GroupRepresentation[]> {
    const parentGroup = await this.getGroupByPath(parentPath);
    if (!parentGroup || !parentGroup.id) {
      throw new Error(errors.NO_GROUP_WITH_THAT_PATH.code);
    }

    return await this.getSubGroupsByParentId(parentGroup.id);
  }

  async getGroupById(
    groupId: string,
  ): Promise<GroupRepresentation | undefined> {
    const result = await this.kcAdmin.groups.findOne({
      id: groupId,
      realm: this.kcAdmin.workingRealmName,
    });

    return result;
  }

  async groupExists(groupId: string): Promise<boolean> {
    return !!(await this.kcAdmin.groups.findOne({
      id: groupId,
      realm: this.kcAdmin.workingRealmName,
    }));
  }

  async getTopLevelGroupByName(
    groupName: string,
  ): Promise<GroupRepresentation | undefined> {
    const results = await this.kcAdmin.groups.find({
      q: `name`,
      search: groupName,
      realm: this.kcAdmin.workingRealmName,
      exact: true,
    });
    const group = results.find((el) => el.name === groupName);
    return group;
  }

  async mapClientRoleToGroup(paylaod: {
    groupId: string;
    clientUuid: string;
    roleId: string;
  }): Promise<boolean> {
    const { groupId, clientUuid, roleId } = paylaod;
    const allRoles = await this.kcAdmin.clients.listRoles({
      id: clientUuid,
      realm: this.kcAdmin.workingRealmName,
    });
    const role = allRoles.find((role) => role.id === roleId);
    if (!role || !role.name) {
      throw new Error(errors.NO_ROLE_WITH_THAT_ID.code);
    }

    await this.kcAdmin.groups.addClientRoleMappings({
      id: groupId,
      clientUniqueId: clientUuid,
      realm: this.kcAdmin.workingRealmName,
      roles: [{ id: roleId, name: role.name }],
    });

    return true;
  }

  async addAttributesToGroup(payload: {
    groupId: string;
    attributes: Attributes;
  }): Promise<boolean> {
    const { groupId, attributes } = payload;
    const group = await this.getGroupById(groupId);
    if (!group) {
      throw new Error(errors.NO_GROUP_WITH_THAT_ID.code);
    }
    await this.kcAdmin.groups.update(
      { id: groupId, realm: this.kcAdmin.workingRealmName },
      {
        ...group,
        attributes: {
          ...group?.attributes,
          ...attributes,
        },
      },
    );
    return true;
  }
}
