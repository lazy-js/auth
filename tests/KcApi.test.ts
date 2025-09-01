import { KcApi } from '../src/modules/kcApi/services/KcApi';
import { Logger, randomHex } from '@lazy-js/utils';
import errors from '../src/config/errors';

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { checkServerRequest } from '../src';

let testlog = new Logger({
  disableInfo: true,
  disableDebug: true,
  disableWarn: true,
});

const config = {
  url: 'http://localhost:8080',
  password: 'admin',
  realmName: 'kcApiTestTs',
};

describe('Keycload API testing suite', () => {
  let kcApi: KcApi;
  let clientId = 'integration-map-client';
  let clientUuid: string;

  let parentRoleName = 'parent-role-name';
  let parentRoleId: string;

  let childRoleName = 'child-role-name';
  let childRoleId: string;

  let parentGroupId: string;

  let username = 'mahmoudkarsha';
  let email = 'mahmoud.karsha@newstarters.de';
  let password: string = 'asdf1234';
  let userId: string;

  beforeAll(async () => {
    kcApi = await KcApi.create(config);
  });

  afterAll(async () => {
    await kcApi.realms.deleteRealm();
  });

  it('the keycloak should be available', async () => {
    async function checkServerRequest(url: string) {
      const res = await fetch(url);
      return !!res.ok;
    }

    const avia = await checkServerRequest(config.url);
    expect(avia).toBe(true);
  });

  it('the keycloak should be available', async () => {
    const avia = await checkServerRequest(config.url.replace('8080', '8081'));
    expect(avia).toBe(false);
  });

  // AUTHENTICATION
  it('should display the correct working realm', () => {
    expect(kcApi.kcAdmin.workingRealmName).toBe(config.realmName);
  });

  it('should be defined after success authentication', async () => {
    expect(kcApi.kcAdmin.accessToken).toBeDefined();
  });

  // CREATE REALM
  it('should return undefined if realm not found', async () => {
    const isExist = await kcApi.realms.realmExists();
    expect(isExist).toBe(false);
  });

  it('should be created', async () => {
    const createdRealm = await kcApi.realms.createRealm();
    expect(createdRealm.realmName).toBe(kcApi.kcAdmin.workingRealmName);
  });

  // GROUPS
  // create first level group
  it('should create a group in as first level group', async () => {
    const group = await kcApi.groups.createGroup({
      groupName: kcApi.kcAdmin.workingRealmName,
    });

    parentGroupId = group.id;
    expect(group.id).toBeDefined();
  });

  it(
    'should throw error: ' +
      errors.TOP_LEVEL_GROUP_ALREADY_EXISTS.code +
      ' if the group name already exists  ',
    async () => {
      await expect(
        kcApi.groups.createGroup({
          groupName: kcApi.kcAdmin.workingRealmName,
        }),
      ).rejects.toThrow(errors.TOP_LEVEL_GROUP_ALREADY_EXISTS.code);
    },
  );

  // get a goup by name
  it('a group with same realm name should be created automatically', async () => {
    const group = await kcApi.groups.getTopLevelGroupByName(config.realmName);
    testlog.info(group);
    expect(group).toBeDefined();
  });

  // create sub group
  it('should create sub group if a parent group id is provided', async () => {
    const group = await kcApi.groups.createGroup({
      groupName: 'child-' + kcApi.kcAdmin.workingRealmName,
      parentGroupId: parentGroupId,
    });

    expect(group.id).toBeDefined();
  });

  // get a goup by name
  it('should get the parent group with ', async () => {
    const group = await kcApi.groups.getTopLevelGroupByName(config.realmName);
    testlog.info(group);
    expect(group).toBeDefined();
  });

  // errors
  it(
    'should throw error: ' +
      errors.SUB_GROUP_ALREADY_EXISTS.code +
      ' if the sub group already exists',
    async () => {
      await expect(
        kcApi.groups.createGroup({
          groupName: 'child-' + kcApi.kcAdmin.workingRealmName,
          parentGroupId: parentGroupId,
        }),
      ).rejects.toThrow(errors.SUB_GROUP_ALREADY_EXISTS.code);
    },
  );

  // create sub group with attriutes
  it('should create sub group with attributes', async () => {
    const group = await kcApi.groups.createGroup({
      groupName: 'child2-' + kcApi.kcAdmin.workingRealmName,
      parentGroupId: parentGroupId,
      attributes: {
        translations: ['all:full', 'en:w'],
        isAdmin: ['true'],
      },
    });

    expect(group.id).toBeDefined();
  });

  // add attributes to existed group
  it('should add the group attributes', async () => {
    const group = await kcApi.groups.addAttributesToGroup({
      groupId: parentGroupId,
      attributes: {
        isDeafult: ['true'],
      },
    });
  });

  // the  isDeafult: ["true"], should be replaced with   isDeafult: ["false"],
  it('should add the group attributes', async () => {
    await kcApi.groups.addAttributesToGroup({
      groupId: parentGroupId,
      attributes: {
        isDeafult: ['false'],
        isTe: ['yes'],
      },
    });
    const group = await kcApi.groups.getGroupById(parentGroupId);
    testlog.info(group);
    expect(group?.attributes?.isDeafult).toBeInstanceOf(Array);
    expect(group?.attributes?.isDeafult.length).toBe(1);
  });

  it('should get the group by group path', async () => {
    const groupByPath = await kcApi.groups.getGroupByPath(
      '/' + kcApi.kcAdmin.workingRealmName,
    );
    expect(groupByPath?.name).toBe(kcApi.kcAdmin.workingRealmName);
  });

  // role mapping

  // PUBLIC CLIENTS
  it('it should create public client', async () => {
    const publicClient = await kcApi.publicClients.create({
      clientId: clientId,
      name: 'app',
      description: 'sfdsf',
    });

    testlog.info('publicClient.id:' + publicClient.id);
    clientUuid = publicClient.id as string;
    expect(publicClient.id).toBeDefined();
  });

  it('the client id should be correct', async () => {
    const publicClient = await kcApi.publicClients.getOneByUuid(clientUuid);
    testlog.info(publicClient);
    expect(publicClient?.clientId).toBe(clientId);
  });

  it('should get the client by clientId', async () => {
    const publicClient = await kcApi.publicClients.getOneByClientId(clientId);
    testlog.info(publicClient);
    expect(publicClient?.directAccessGrantsEnabled).toBe(true);
  });

  it('the directAccessGrantsEnabled should be true', async () => {
    const publicClient = await kcApi.publicClients.getOneByClientId(clientId);
    testlog.info(publicClient);
    expect(publicClient?.directAccessGrantsEnabled).toBe(true);
  });

  it('should create a role in the client', async () => {
    const createdRole = await kcApi.publicClients.addRole({
      roleName: parentRoleName,
      clientUuid: clientUuid,
    });
    testlog.info(createdRole);
    expect(createdRole?.name).toBe(parentRoleName);
  });

  it('should get the roles for a client by client id', async () => {
    const roles = await kcApi.publicClients.getRolesByClientUuid({
      clientUuid: clientUuid,
    });
    roles.forEach((role) => {
      parentRoleId = role.id as string;
      expect(role.containerId).toBe(clientUuid);
    });
  });

  it('should add child role to a parent role', async () => {
    const childRole = await kcApi.publicClients.addRole({
      parentRoleId,
      roleName: childRoleName,
      clientUuid,
    });
    testlog.info(childRole);
    childRoleId = childRole?.id as string;
    expect(childRole?.containerId).toBe(clientUuid);
  });

  it('should list all roles of the client', async () => {
    const roles = await kcApi.publicClients.getRolesByClientUuid({
      clientUuid: clientUuid,
    });
    testlog.info(roles);
    expect(roles.find((r) => r.name === childRoleName)).toBeDefined();
    expect(roles.find((r) => r.name === parentRoleName)).toBeDefined();
  });

  it('should get the roles for a client by client id', async () => {
    const roles = await kcApi.publicClients.getRolesByParentId({
      clientUuid: clientUuid,
      parentRoleId: parentRoleId,
    });
    testlog.info(roles);
    expect(roles.find((r) => r.name === childRoleName)).toBeDefined();
    expect(roles.find((r) => r.name === parentRoleName)).toBeUndefined();
  });

  it('should map roles from client to the group', async () => {
    const isDone = await kcApi.groups.mapClientRoleToGroup({
      groupId: parentGroupId,
      clientUuid,
      roleId: parentRoleId,
    });

    expect(isDone).toBe(true);
  });

  it('should get authentication config', async () => {
    const config = await kcApi.users.getUserProfileConfig();
    testlog.debug(config);
    expect(config).toHaveProperty('attributes');
    expect(config).toHaveProperty('groups');
    expect(config.attributes).toBeInstanceOf(Array);
    expect(config.groups).toBeInstanceOf(Array);
    expect(config.attributes?.length).toBeDefined();
  });

  it('should add new propert to the user profile', async () => {
    const newUserProfileAttribute = {
      name: 'locale',
      displayName: 'Locale',
      permissions: {
        view: ['admin', 'user'],
        edit: ['admin', 'user'],
      },
      multivalued: false,
    };
    const config = await kcApi.users.getUserProfileConfig();
    config.attributes?.push(newUserProfileAttribute);
    const newConfig = await kcApi.users.updateUserProileConfig(config);
    testlog.debug(newConfig);
  });

  it('should create a user', async () => {
    const user = await kcApi.users.createUser({
      username: username,
      email: email,
      enabled: true,
    });
    userId = user.id;
    expect(user.id).toBeDefined();
  });

  it('should create a user with attributes', async () => {
    const user = await kcApi.users.createUser({
      username: username + '1',
      email: email + '1',
      enabled: true,
      attributes: {
        app: ['app1'],
        client: ['client1'],
      },
    });
    expect(user.id).toBeDefined();
  });

  it('should the user to the group', async () => {
    await kcApi.users.addUserToGroup({
      userId,
      groupId: parentGroupId,
    });
  });

  it('should show the groups of user ', async () => {
    const user = await kcApi.users.getUserGroups(userId);
    testlog.info(user);
  });

  it('should remove default realm role from user', async () => {
    expect(userId).toBeDefined();
    await kcApi.users.removeDefaultRealmRolesFromUser(userId);
  });

  it('should set the password for the user ', async () => {
    await kcApi.users.setUserPassword({ userId, password });
  });

  it('should get user by email address', async () => {
    const user = await kcApi.users.getUsersByEmail(email);
    testlog.info(user);
  });

  it('should get user by user id', async () => {
    const user = await kcApi.users.getUserById(userId);
    testlog.info(user);
  });

  let accessToken: string;
  let refreshToken: string;
  it('should login the user with user name and passwrod and clientId', async () => {
    const token = await kcApi.users.loginWithUsername({
      username: username,
      password: password,
      clientId: clientId,
    });
    accessToken = token.accessToken;
    refreshToken = token.refreshToken;
    expect(accessToken).toBeDefined();
    expect(token.refreshToken).toBeDefined();
  });
  it('should validate the access token and return the value', async () => {
    const isValidaTkn = await kcApi.users.validateAccessToken(accessToken);

    const resourceAccessPayload: {
      [key: string]: { roles: string[] };
    } = isValidaTkn?.payload.resource_access as {
      [key: string]: { roles: string[] };
    };
    let clientRoles = resourceAccessPayload[clientId];
    expect(clientRoles.roles.includes(childRoleName)).toBe(true);
    expect(clientRoles.roles.includes(parentRoleName)).toBe(true);
  });

  it('should renew the token based on refresh token', async () => {
    const newToken = await kcApi.users.refreshAccessToken({
      refreshToken,
      clientId,
    });
    expect(newToken).toHaveProperty('accessToken');
    expect(newToken).toHaveProperty('refreshToken');
    expect(newToken).toHaveProperty('expiresIn');
    expect(newToken).toHaveProperty('refreshExpiresIn');
  });
});
