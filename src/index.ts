import { App, handleMainException } from '@lazy-js/server';
import { Database } from '@lazy-js/mongo-db';

import { RealmBuilder } from './modules/RealmBuilder/index';
import { RealmManipulator } from './modules/RealmManipulator/index';

import { appLogger } from './config/loggers';
import { IRealm } from './modules/Realm';
import { INotificationClientSdk } from './types';

export * from './modules/Realm';
export * from './utils';

export { INotificationClientSdk };

export interface KeycloakConfig {
  keycloakServiceUrl: string;
  keycloakAdminPassword: string;
}

export interface ServiceConfig {
  // app config
  allowedOrigins: string[];
  port: number;
  routerPrefix: string;
  disableRequestLogging?: boolean;
  disableSecurityHeaders?: boolean;
  enableRoutesLogging?: boolean;
  serviceName?: string;

  // database config
  mongoDbUrl: string;

  // realm config
  logRealmSummary?: boolean;
}

export class LazyAuth {
  constructor(
    private readonly keycloakConfig: KeycloakConfig,
    private readonly serviceConfig: ServiceConfig,
    private realm: IRealm,
    private notificationSdk: INotificationClientSdk,
  ) {}

  async _isKeycloakServiceAvailable() {
    return await checkServerRequest(this.keycloakConfig.keycloakServiceUrl);
  }

  async buildRealm() {
    console.log(this.keycloakConfig);
    const realmBuilderModule = await RealmBuilder.create(
      this.realm,
      {
        url: this.keycloakConfig.keycloakServiceUrl,
        password: this.keycloakConfig.keycloakAdminPassword,
      },
      this.notificationSdk,
    );
    await realmBuilderModule.build();
    return realmBuilderModule;
  }

  async connectDatabase() {
    const database = new Database(this.serviceConfig.mongoDbUrl);

    database.on('connected', () => {
      appLogger.info('Connected to database');
    });
    database.on('disconnected', () => {
      appLogger.info('Disconnected from database successfully');
    });
    database.on('error', (err: any) => {
      appLogger.error('Error happened when connecting to database');
    });
    await database.connect();
    return database;
  }

  async prepareApp() {
    const app = new App({
      port: this.serviceConfig.port,
      prefix: this.serviceConfig.routerPrefix,
      allowedOrigins: this.serviceConfig.allowedOrigins,
      disableRequestLogging: this.serviceConfig.disableRequestLogging,
      disableSecurityHeaders: this.serviceConfig.disableSecurityHeaders,
      enableRoutesLogging: this.serviceConfig.enableRoutesLogging,
      serviceName: this.serviceConfig.serviceName,
    });

    app.on('error', (err: any) => {
      console.log(err);
    });

    app.on('started', () => {
      appLogger.info('App started');
    });
    return app;
  }

  async start() {
    try {
      if (!(await this._isKeycloakServiceAvailable())) {
        console.log('Keycloak server is down');

        return;
      }
      await this.connectDatabase();

      const realmBuilderModule = await this.buildRealm();

      const realmManipulator = new RealmManipulator({
        realm: this.realm,
        port: this.serviceConfig.port.toString(),
        routerPrefix: this.serviceConfig.routerPrefix,
      });

      if (this.serviceConfig.logRealmSummary) {
        realmManipulator.getRealmSummary();
      }

      const app = await this.prepareApp();
      app.mountModule(realmBuilderModule);

      app.start();
    } catch (err) {
      const error = await handleMainException(
        err as any,
        this.start.bind(this),
        2,
      );
      appLogger.error(error);
    }
  }
}

export async function checkServerRequest(url: string) {
  try {
    const res = await fetch(url);
    return true;
  } catch (err) {
    return false;
  }
}
