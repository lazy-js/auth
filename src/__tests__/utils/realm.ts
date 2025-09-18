import { Realm, App, Client, ClientAuthConfig, User, Group, RoleItem, createRolesTree } from '../..';

// Auth Permission Roles
const authPermissionRolesData: RoleItem[] = [
    {
        name: 'auth-permissions',
        childRoles: [{ name: 'add-users' }, { name: 'create-groups' }, { name: 'update-groups' }],
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
        childRoles: [{ name: 'add-users' }, { name: 'create-groups' }, { name: 'update-groups' }, { name: 'update-own-password' }],
    },
];

const sharedPermissionRoles = createRolesTree(sharedPermissionRolesData);

// =====================
// GROUPS DEFINITIONS
// =====================

// Admin Groups
const adminGroup = new Group('admin-group', true).addRoles(authPermissionRoles).addRoles(sharedPermissionRoles).addRoles(clientPermissionRoles).addAttribute('translations', 'all:full');

const contentWriterGroup = new Group('content-writer-group', false).addRoles(sharedPermissionRoles).addRoles(clientPermissionRoles).addAttribute('translations', 'all:full');

// Mobile Client Groups
const defaultUsersGroup = new Group('default-users-group', true).addRoles(sharedPermissionRoles);

// =====================
// USERS DEFINITIONS
// =====================

const privateClientBuiltInUser = new User({
    username: 'admin',
    password: 'asdf1234',
    firstName: 'Admin',
    lastName: 'Default',
    method: 'username',
    group: adminGroup,
});

// =====================
// CLIENT AUTH CONFIGS
// =====================

const testPrivateClientConfig = new ClientAuthConfig(['email', 'username']).setRegisterConfig({ status: 'private', privateAccessRoles: authPermissionRoles }).setLoginConfig({ status: 'enabled' }).setBuiltInUser(privateClientBuiltInUser);

const testPublicClientConfig = new ClientAuthConfig(['email']).setRegisterConfig({ status: 'public', verified: false }).setLoginConfig({ status: 'enabled' });

// =====================
// CLIENTS DEFINITIONS
// =====================

const testPrivateClient = new Client('private-client', testPrivateClientConfig).registerRoles(authPermissionRoles).registerRoles(sharedPermissionRoles).registerRoles(clientPermissionRoles).addGroup(adminGroup).addGroup(contentWriterGroup);

const testPublicClient = new Client('public-client', testPublicClientConfig).addGroup(defaultUsersGroup).registerRoles(sharedPermissionRoles);

// =====================
// APP DEFINITION
// =====================

const testApp = new App('test-app').addClient(testPrivateClient).addClient(testPublicClient);

// =====================
// REALM DEFINITION
// =====================
const testRealm = new Realm('test-realm').addApp(testApp);

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
    privateClientBuiltInUser,

    // Client Configs
    testPrivateClientConfig,
    testPublicClientConfig,

    // Clients
    testPrivateClient,
    testPublicClient,

    // App
    testApp,

    // Realm
    testRealm,
};
