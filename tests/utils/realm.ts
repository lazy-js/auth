import {
  Realm,
  App,
  Client,
  ClientAuthConfig,
  User,
  Group,
  RoleItem,
  createRolesTree,
} from '../../src';
import { randomHex } from '@lazy-js/utils';

// Auth Permission Roles
const authPermissionRolesData: RoleItem[] = [
  {
    name: 'auth-permissions',
    childRoles: [
      { name: 'add-users' },
      { name: 'create-groups' },
      { name: 'update-groups' },
    ],
  },
];
const authPermissionRoles = createRolesTree(authPermissionRolesData);

// Client Permission Roles
const clientPermissionRolesData: RoleItem[] = [
  {
    name: 'client-permissions',
    childRoles: [{ name: 'add-posts' }],
  },
];

const clientPermissionRoles = createRolesTree(clientPermissionRolesData);

// Shared Permission Roles
const sharedPermissionRolesData: RoleItem[] = [
  {
    name: 'shared-permissions',
    childRoles: [
      { name: 'add-users' },
      { name: 'create-groups' },
      { name: 'update-groups' },
      { name: 'update-own-password' },
    ],
  },
];

const sharedPermissionRoles = createRolesTree(sharedPermissionRolesData);

// =====================
// GROUPS DEFINITIONS
// =====================

// Admin Groups
const adminGroup = new Group('admin-group', true)
  .addRoles(authPermissionRoles)
  .addRoles(sharedPermissionRoles)
  .addRoles(clientPermissionRoles)
  .addAttribute('translations', 'all:full');

const contentWriterGroup = new Group('content-writer-group', false)
  .addRoles(sharedPermissionRoles)
  .addRoles(clientPermissionRoles)
  .addAttribute('translations', 'all:full');

// Mobile Client Groups
const defaultUsersGroup = new Group('default-users-group', true);

// =====================
// USERS DEFINITIONS
// =====================

const defaultUser = new User({
  username: 'admin',
  password: 'admin1234',
  firstName: 'Admin',
  lastName: 'Default',
  group: adminGroup,
  method: 'username',
});

// =====================
// CLIENT AUTH CONFIGS
// =====================

const adminClientAuthConfig = new ClientAuthConfig(['email', 'username'])
  .setRegisterConfig('private', true, authPermissionRoles)
  .setLoginConfig('enabled')
  .setBuiltInUser(defaultUser);

const mobileClientAuthConfig = new ClientAuthConfig(['email'])
  .setRegisterConfig('public', false)
  .setLoginConfig('enabled');

// =====================
// CLIENTS DEFINITIONS
// =====================

const adminClient = new Client('admin-client', adminClientAuthConfig)
  .registerRoles(authPermissionRoles)
  .registerRoles(sharedPermissionRoles)
  .registerRoles(clientPermissionRoles)
  .addGroup(adminGroup)
  .addGroup(contentWriterGroup);

const mobileClient = new Client(
  'mobile-client',
  mobileClientAuthConfig,
).addGroup(defaultUsersGroup);

// =====================
// APP DEFINITION
// =====================

const app1 = new App('app1').addClient(adminClient).addClient(mobileClient);

// =====================
// REALM DEFINITION
// =====================
export const realm = new Realm(randomHex(10)).addApp(app1);

export {
  // Roles
  authPermissionRoles,
  clientPermissionRoles,
  sharedPermissionRoles,

  // Groups
  adminGroup,
  contentWriterGroup,
  defaultUsersGroup,

  // Users
  defaultUser,

  // Auth Configs
  adminClientAuthConfig,
  mobileClientAuthConfig,

  // Clients
  adminClient,
  mobileClient,

  // App
  app1,
};
