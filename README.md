# lazy-auth

A TypeScript toolkit to model and bootstrap Keycloak realms and expose ready-to-use authentication routes. Model your auth domain (Realm → App → Client → Group → Role), auto-provision everything into Keycloak, wire a MongoDB-backed user store, and get HTTP endpoints for register/login/verify/token right away.

## Features

-   Define Realm structure in code and build it in Keycloak
-   Create public clients, roles (with hierarchy), groups and role mappings
-   Configurable registration flows (public/private/disabled), primary fields, verification behavior
-   HTTP endpoints for user register, login, token validation/refresh, password update, verify
-   Local MongoDB user repository synced with Keycloak IDs
-   Pluggable notification SDK for email verification
-   First-class Keycloak Admin API helper (typed facade)

## Installation

```bash
npm install github:lazy-js/auth
# or if used via monorepo path, ensure peer deps are satisfied
```

Peer dependencies used internally:

-   `@keycloak/keycloak-admin-client`
-   `@lazy-js/server` (HTTP server + controller utilities)
-   `@lazy-js/mongo-db` (MongoDB wrapper)
-   `@lazy-js/utils`
-   `jose`, `zod`

## Quick Start

1. Run a Keycloak instance locally (defaults assumed in examples):

-   Keycloak URL: `http://localhost:8080`
-   Admin user/password: `admin/admin`

2. Define your realm structure

```ts
import { Realm, App, Client, ClientAuthConfig, Group, User, createRolesTree } from 'lazy-js/auth';

// Define roles and role hierarchy
const roles = createRolesTree([
    {
        name: 'auth-permissions',
        childRoles: [{ name: 'add-users' }, { name: 'create-groups' }],
    },
]);

// Groups
const adminGroup = new Group('admin-group', true).addRoles(roles);

// Built-in user (optional)
const defaultUser = new User({
    method: 'username',
    username: 'admin',
    password: 'admin1234',
    firstName: 'Admin',
    lastName: 'Default',
    group: adminGroup,
});

// Client auth config
const adminClientAuth = new ClientAuthConfig(['email', 'username'])
    .setRegisterConfig('private', true, roles) // private registration, verified by default, roles permitted to register
    .setLoginConfig('enabled')
    .setBuiltInUser(defaultUser);

// Clients
const adminClient = new Client('admin-client', adminClientAuth).addGroup(adminGroup);

// App
const app1 = new App('app1').addClient(adminClient);

// Realm
export const realm = new Realm('myrealm').addApp(app1);
```

3. Start the service

```ts
import { LazyAuth, type KeycloakConfig, type ServiceConfig } from 'lazy-js/auth';
import { realm } from './realm';

// Implement your notification SDK (email, etc.)
import { MyNotificationSdk } from './notificationSdk';

const keycloakConfig: KeycloakConfig = {
    keycloakServiceUrl: 'http://localhost:8080',
    keycloakAdminPassword: 'admin',
};

const serviceConfig: ServiceConfig = {
    port: 8081,
    allowedOrigins: ['*'],
    routerPrefix: '/api/v1',
    mongoDbUrl: 'mongodb://localhost:27017/my-auth-db',
    enablelogRealmSummary: true,
};

const notificationSdk = new MyNotificationSdk();

const service = new LazyAuth(keycloakConfig, serviceConfig, realm, notificationSdk);
service.start();
```

This will:

-   Connect to MongoDB
-   Ensure the realm exists (or create it)
-   Create the app, public clients, roles, groups, mappings
-   Create built-in user if configured
-   Start an HTTP server and mount auth routes under `/<realm-name>/<app-name>/<client-name>`

## HTTP Endpoints

Base path pattern: `/<realm>/<app>/<client>` mounted under your `routerPrefix`.

For client `admin-client` of app `app1` under realm `myrealm`, base is:
`/api/v1/myrealm/app1/admin-client`

-   POST `.../register`

    -   Body (depends on configured primary fields):
        -   method: 'email' | 'phone' | 'username'
        -   For email: { method: 'email', email, password, firstName?, lastName? }
        -   For username: { method: 'username', username, password, firstName?, lastName? }
    -   Behavior: public/private/disabled per `ClientAuthConfig`
    -   Response: user document or `{ mustVerify: true }`

-   POST `.../login`

    -   Body: depends on primary fields
    -   Response: `{ token: { accessToken, refreshToken, expiresIn, refreshExpiresIn }, user }` or `{ mustVerify: true }`

-   POST `.../validate-access-token`

    -   Headers: `Authorization: Bearer <accessToken>`
    -   Response: token payload extended with `_id` (local user id)

-   POST `.../validate-role`

    -   Headers: `Authorization: Bearer <accessToken>`
    -   Body: `{ role: string | string[] }`
    -   Response: token payload if authorized, otherwise 401

-   POST `.../refresh-token`

    -   Body: `{ refreshToken }` or `Authorization: Bearer <refreshToken>`
    -   Response: new token pair

-   POST `.../update-password`

    -   Headers: `Authorization: Bearer <accessToken>`
    -   Body: `{ newPassword }`
    -   Requires role `update-own-password` by default

-   POST `.../verify`
    -   Body: `{ method: 'email', email, code }` | `{ method: 'phone', phone, code }`
    -   Response: `{ canLogin: boolean }`

Example curl:

```bash
curl -X POST \
  http://localhost:8081/api/v1/myrealm/app1/admin-client/register \
  -H "Content-Type: application/json" \
  -d '{"method":"email","email":"user@example.com","password":"asdf1234"}'
```

## Modeling Reference

-   Realm
    -   `new Realm(name).addApp(app)`
    -   `addGlobalAttribute(key, value)` to tag the root group
-   App
    -   `new App(name).addClient(client)`
-   Client
    -   `new Client(name, clientAuthConfig)`
    -   Auto clientId: `<appName>-<clientName>`
    -   `addGroup(group)` — must contain exactly one default group across groups
    -   `registerRoles(roles)` — roles to create in Keycloak client
    -   `addGlobalAttribute(key, value)` — saved as group attributes
-   Group
    -   `new Group(name, isDefault)`
    -   `addRoles(roles)` to map client roles to group
    -   `addAttribute(key, value)`
-   Role
    -   `new Role(name).addChildRole(role)` or build via `createRolesTree([...])`
-   ClientAuthConfig
    -   `new ClientAuthConfig(primaryFields)` where `primaryFields` ⊆ ['email','phone','username']
    -   `.setRegisterConfig('public' | 'private' | 'disabled', verifiedByDefault?, privateAccessRoles?)`
    -   `.setLoginConfig('enabled' | 'disabled')`
    -   `.setBuiltInUser(user)`

## Programmatic Keycloak API

Use `KcApi` directly for advanced workflows:

```ts
import { KcApi } from 'lazy-js/auth';

const kcApi = await KcApi.create({
    url: 'http://localhost:8080',
    password: 'admin',
    realmName: 'myrealm',
});

await kcApi.realms.createRealm();
const group = await kcApi.groups.createGroup({ groupName: 'myrealm' });
const client = await kcApi.publicClients.create({
    clientId: 'app1-admin-client',
    name: 'app1-admin-client',
});
await kcApi.publicClients.addRole({
    clientUuid: client.id!,
    roleName: 'admin',
});
```

Key areas:

-   `kcApi.realms` — create/delete/check realm
-   `kcApi.groups` — create/find/list subgroups, add attributes, map roles
-   `kcApi.publicClients` — create public client, add roles, list roles
-   `kcApi.users` — CRUD users, passwords, login, token validation/refresh

## Notification SDK

Provide an implementation of `INotificationClientSdk`:

```ts
import { INotificationClientSdk, SendEmailBody } from 'lazy-js/auth';

export class MyNotificationSdk implements INotificationClientSdk {
    async available(): Promise<boolean> {
        return true;
    }
    async sendEmail(body: SendEmailBody): Promise<void> {
        // integrate with your email provider
    }
}
```

If unavailable, the service logs the verification code instead.

## Configuration

-   KeycloakConfig
    -   `keycloakServiceUrl: string`
    -   `keycloakAdminPassword: string`
-   ServiceConfig
    -   `allowedOrigins: string[]`
    -   `port: number`
    -   `routerPrefix: string`
    -   `disableRequestLogging?: boolean`
    -   `disableSecurityHeaders?: boolean`
    -   `enableRoutesLogging?: boolean`
    -   `serviceName?: string`
    -   `mongoDbUrl: string`
    -   `logRealmSummary?: boolean` — prints a table of apps/clients and URLs

## Error Handling

Errors are normalized and thrown as `AppError` with codes like:

-   INVALID_ACCESS_TOKEN, EXPIRED_ACCESS_TOKEN, INVALID_REFRESH_TOKEN
-   USER_ALREADY_EXISTS, USER_NOT_FOUND, EMAIL_ALREADY_VERIFIED, INVALID_CODE, CODE_EXPIRED
-   NO_GROUP_WITH_THAT_NAME, NO_ROLE_WITH_THAT_ID, MULTIPLE_DEFAULT_GROUPS

Your HTTP framework from `@lazy-js/server` will translate these to responses.

## Testing

```bash
npm run test
```

Integration tests rely on a running Keycloak at `http://localhost:8080`.

## License

This project is licensed under the [Apache License 2.0](./LICENSE).

### Attribution

-   Keycloak — Red Hat
-   keycloak-admin-client — Apache License 2.0
    See [NOTICE](./NOTICE).
