import GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import { IRealm, IRole } from '../Realm/index';
import { KcApi, IKcApi } from '../kcApi/index';
import {
    IRealmBuilder,
    kcApiConfig,
    InitRealmResponse,
    InitAppPayload,
    InitAppResponse,
    InitClientPayload,
    InitClientResponse,
    InitGroupPayload,
    InitGroupResponse,
} from './types';

import { BaseController } from '@lazy-js/server';
import { UserController } from '../User';
import { INotificationClientSdk } from '../../types';
import { realmBuilderLogger } from '../../config/loggers';
import { BadConfigError, ExternalServiceError } from '@lazy-js/error-guard';

export class RealmBuilder extends BaseController implements IRealmBuilder {
    public realm: IRealm;
    public kcApi: IKcApi;
    public notificationClientSdk: INotificationClientSdk;

    static async create(
        realm: IRealm,
        kcApiConfig: kcApiConfig,
        notificationClientSdk: INotificationClientSdk,
    ) {
        const kcApi = await KcApi.create({
            realmName: realm.name,
            url: kcApiConfig.url,
            password: kcApiConfig.password,
            reAuthenticateIntervalMs: kcApiConfig.reAuthenticateIntervalMs,
        });
        return new RealmBuilder(realm, kcApi, notificationClientSdk);
    }

    private constructor(
        realm: IRealm,
        kcApi: IKcApi,
        notificationClientSdk: INotificationClientSdk,
    ) {
        super({ pathname: `/${realm.name}`, healthRoute: '/health' });
        this.realm = realm;
        this.kcApi = kcApi;
        this.notificationClientSdk = notificationClientSdk;
    }

    async build() {
        const initedRealm = await this._initRealm();
        realmBuilderLogger.info('Realm inited: ', initedRealm?.id);
        for (const app of this.realm.apps) {
            const initedApp = await this._initApp({
                app: app,
                realmId: initedRealm?.id as string,
            });

            for (const client of app.clients) {
                const initedClient = await this._initClient({
                    client: client,
                    appId: initedApp.id,
                });
                for (const group of client.groups) {
                    await this._initGroup({
                        group: group,
                        clientUuid: initedClient.clientUuid,
                        clientGroupId: initedClient.clientGroupId as string,
                    });
                }

                const userController = new UserController(
                    client,
                    this.kcApi,
                    this.notificationClientSdk,
                );
                if (client.clientAuthConfiguration.builtInUser) {
                    const doesUserExists =
                        await userController.userService._getUser(
                            client.clientAuthConfiguration.builtInUser.toJson(),
                        );
                    if (!doesUserExists) {
                        const userDto =
                            client.clientAuthConfiguration.builtInUser.toJson();
                        await userController.userService.registerDefaultUser({
                            body: userDto,
                            group: userDto.group,
                        });
                    }
                }

                // the route will be like /<realm-name>/<app-name>/<client-name>
                // because the userController is mounted on /<client-name>
                // so we need to mount the userController router on /<app-name>
                // and the RealmBuilder router on /<realm-name>

                // mountRouter is available in the BaseController class
                // the userController.getRouter() returns the router of the userController
                // and the mountRouter is used to mount the router of the userController on the /<app-name> route
                // mountController is available in the BaseController class
                // the userController is the controller to mount
                // the /<app-name> is the route to mount the controller on
                this.mountController(userController, `/${app.name}`);
            }
        }
    }

    async _initRealm(): Promise<InitRealmResponse> {
        let rootGroup;
        const realmExists = await this.kcApi.realms.realmExists();
        if (!realmExists) {
            await this.kcApi.realms.createRealm();
        }
        rootGroup = await this.kcApi.groups.getTopLevelGroupByName(
            this.realm.name,
        );

        if (!rootGroup) {
            rootGroup = await this.kcApi.groups.createGroup({
                groupName: this.realm.name,
                attributes: this.realm.realmAttributes,
            });
        }

        rootGroup = await this.kcApi.groups.getGroupById(
            rootGroup.id as string,
        );
        await this._removeUsernameValidator();
        if (!rootGroup || !rootGroup.id)
            throw new ExternalServiceError({
                code: 'ROOT_GROUP_CREATION_ERROR',
                message: 'Root group creation error',
                externalService: 'Keycloak',
            });
        return {
            id: rootGroup.id,
            realmAttributes: rootGroup.attributes,
        };
    }

    async _initApp(initAppPayload: InitAppPayload): Promise<InitAppResponse> {
        const { app, realmId } = initAppPayload;
        const subGroupsOfRootGroup =
            await this.kcApi.groups.getSubGroupsByParentId(realmId);

        let appInDatabase;
        appInDatabase = subGroupsOfRootGroup.find(
            (group) => group.name === app.name,
        );

        if (!appInDatabase)
            appInDatabase = await this.kcApi.groups.createGroup({
                parentGroupId: realmId,
                groupName: app.name,
                attributes: app.appAttributes,
            });

        appInDatabase = await this.kcApi.groups.getGroupById(
            appInDatabase.id as string,
        );

        if (!appInDatabase || !appInDatabase.id)
            throw new ExternalServiceError({
                code: 'APP_GROUP_CREATION_ERROR',
                message: 'App group creation error',
                externalService: 'Keycloak',
            });

        return {
            id: appInDatabase.id,
            appAttributes: appInDatabase.attributes,
        };
    }

    async _initClient(
        initClientPayload: InitClientPayload,
    ): Promise<InitClientResponse> {
        const { appId, client } = initClientPayload;
        const subGroupsOfAppGroup =
            await this.kcApi.groups.getSubGroupsByParentId(appId);

        let clientInDatabase: GroupRepresentation | undefined;
        clientInDatabase = subGroupsOfAppGroup.find(
            (group) => group.name === client.name,
        );
        realmBuilderLogger.debug('clientInDatabase cheked: ', clientInDatabase);
        if (!clientInDatabase)
            clientInDatabase = await this.kcApi.groups.createGroup({
                groupName: client.name,
                parentGroupId: appId,
                attributes: client.clientAttributes,
            });

        let publicClientExistInDatabase =
            await this.kcApi.publicClients.getOneByClientId(client.clientId);
        if (!publicClientExistInDatabase)
            publicClientExistInDatabase = await this.kcApi.publicClients.create(
                {
                    clientId: client.clientId,
                    name: client.appName + '-' + client.name,
                    description: client.clientDescription,
                },
            );
        realmBuilderLogger.debug(
            'publicClientExistInDatabase created: ',
            publicClientExistInDatabase,
        );

        for (let role of client.rolesTree) {
            realmBuilderLogger.debug('role init:', role.name);
            await this._initRole(
                role,
                publicClientExistInDatabase.id as string,
            );
        }

        return {
            clientUuid: publicClientExistInDatabase.id as string,
            clientGroupId: clientInDatabase.id as string,
        };
    }

    async _initRole(
        role: IRole,
        publicClientUuid: string,
        parentRoleId?: string,
    ): Promise<void> {
        let doesRoleExists = await this.kcApi.publicClients.getRoleByName({
            roleName: role.name,
            clientUuid: publicClientUuid,
        });
        realmBuilderLogger.debug(
            `does role ${role.name} exists ? ${doesRoleExists}`,
        );
        if (!doesRoleExists) {
            doesRoleExists = await this.kcApi.publicClients.addRole({
                roleName: role.name,
                clientUuid: publicClientUuid,
                parentRoleId,
            });
        }

        if (role.roles.length) {
            for (let subRole of role.roles) {
                await this._initRole(
                    subRole,
                    publicClientUuid,
                    doesRoleExists.id,
                );
            }
        }
    }

    async _initGroup(
        initGroupPayload: InitGroupPayload,
    ): Promise<InitGroupResponse> {
        const { group, clientGroupId, clientUuid } = initGroupPayload;
        const subGroupsOfClient =
            await this.kcApi.groups.getSubGroupsByParentId(clientGroupId);

        let groupInDatabase: GroupRepresentation | undefined =
            subGroupsOfClient.find((g) => g.name === group.name);

        if (!groupInDatabase)
            groupInDatabase = await this.kcApi.groups.createGroup({
                groupName: group.name,
                parentGroupId: clientGroupId,
                attributes: {
                    ...group.groupAttributes,
                    isDefault: [group.isDefault ? 'yes' : 'no'],
                },
            });

        if (!groupInDatabase || !groupInDatabase.id) {
            throw new ExternalServiceError({
                code: 'GROUP_IN_CREATION_ERROR',
                message: 'Group in creation error',
                externalService: 'Keycloak',
            });
        }

        for (const role of group.roles) {
            const roleInPublicClientDatabase =
                await this.kcApi.publicClients.getRoleByName({
                    roleName: role.name,
                    clientUuid: clientUuid,
                });
            if (!roleInPublicClientDatabase || !roleInPublicClientDatabase.id) {
                throw new BadConfigError({
                    code: 'ROLE_NOT_FOUND_IN_PUBLIC_CLIENT',
                    message: `Role not found in public client ${clientUuid} when trying to map role ${role.name} to group ${group.name}`,
                });
            }
            await this.kcApi.groups.mapClientRoleToGroup({
                groupId: groupInDatabase.id,
                roleId: roleInPublicClientDatabase?.id,
                clientUuid: clientUuid,
            });
        }
        return {
            id: groupInDatabase.id,
            groupAttributes: groupInDatabase.attributes,
        };
    }

    async _removeUsernameValidator(): Promise<void> {
        const config = await this.kcApi.users.getUserProfileConfig();
        if (!config.attributes)
            throw new ExternalServiceError({
                code: 'USER_PROFILE_CONFIG_NOT_FOUND',
                message: 'User profile config not found',
                externalService: 'Keycloak',
            });
        const usernameIndex = config.attributes.findIndex(
            (attr) => attr.name === 'username',
        );
        config.attributes[usernameIndex].validations = {};
        await this.kcApi.users.updateUserProileConfig(config);
    }
}

// _createAttribute(attributeName: string): ProfileAttribute {
//     return {
//         name: attributeName,
//         displayName: attributeName,
//         permissions: {
//             view: ['admin', 'user'],
//             edit: ['admin', 'user'],
//         },
//         multivalued: false,
//     };
// }

// async _initUserSchema(userProfileAttributes: string[]): Promise<void> {
//     const config = await this.kcApi.users.getUserProfileConfig();

//     if (!config.attributes)
//         throw new ExternalServiceError({
//             code: 'USER_PROFILE_CONFIG_NOT_FOUND',
//             label: 'User profile config not found',
//             externalService: 'Keycloak',
//         });

//     for (let key of userProfileAttributes) {
//         const doesAttributeExists = config.attributes.find((attr) => attr.name === key);
//         if (!doesAttributeExists) {
//             const newAttribute = this._createAttribute(key);
//             config.attributes.push(newAttribute);
//         }
//     }
//     const newConfig = await this.kcApi.users.updateUserProileConfig(config);
// }
