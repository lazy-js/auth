import { App, handleMainException } from '@lazy-js/server';
import { Database } from '@lazy-js/mongo-db';
import { RealmBuilder } from './modules/RealmBuilder/index';
import { RealmManipulator } from './modules/RealmManipulator/index';
import { IRealm } from './modules/Realm';
import { INotificationClientSdk } from './types';
import { Logger } from '@lazy-js/utils';

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
  disableServiceLogging?: boolean;
}

export class LazyAuth {
  private stateLogger: Logger;
  constructor(
    private readonly keycloakConfig: KeycloakConfig,
    private readonly serviceConfig: ServiceConfig,
    private realm: IRealm,
    private notificationSdk: INotificationClientSdk,
  ) {
    const disable = this.serviceConfig.disableServiceLogging;
    this.stateLogger = new Logger({
      module: 'Lazy Auth - ',
      disableDebug: disable,
      disableError: disable,
      disableInfo: disable,
      disableWarn: disable,
    });
  }

  async _isKeycloakServiceAvailable() {
    return await checkServerRequest(this.keycloakConfig.keycloakServiceUrl);
  }

  private async buildRealm() {
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

  private async connectDatabase() {
    const database = new Database(this.serviceConfig.mongoDbUrl);

    database.on('connected', () => {
      this.stateLogger.info('Monogo database connected successfully');
    });
    database.on('disconnected', () => {
      this.stateLogger.info('Monogo database disconnected successfully');
    });
    database.on('error', (err: any) => {
      this.stateLogger.error(
        'Monogo database error \n',
        JSON.stringify(err, null, 4),
      );
    });
    await database.connect();
    return database;
  }

  private async prepareApp() {
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
      this.stateLogger.error(
        'App Service Request Error \n',
        JSON.stringify(err, null, 4),
      );
    });

    app.on('started', () => {
      this.stateLogger.info('App service started successfully');
    });
    return app;
  }

  async start() {
    try {
      if (!(await this._isKeycloakServiceAvailable())) {
        this.stateLogger.error(
          `Keycloak on url ${this.keycloakConfig.keycloakServiceUrl} is DOWN`,
        );
        return;
      } else {
        this.stateLogger.info(
          `Keycloak on url ${this.keycloakConfig.keycloakServiceUrl} is UP`,
        );
      }
      await this.connectDatabase();

      const realmBuilderModule = await this.buildRealm();

      const realmManipulator = new RealmManipulator({
        realm: this.realm,
        port: this.serviceConfig.port.toString(),
        routerPrefix: this.serviceConfig.routerPrefix,
      });

      if (this.serviceConfig.logRealmSummary)
        realmManipulator.getRealmSummary();

      const app = await this.prepareApp();
      app.mountModule(realmBuilderModule);
      app.start();
    } catch (err) {
      const error = await handleMainException(
        err as any,
        this.start.bind(this),
        2,
      );
      this.stateLogger.error(
        'Error Starting App: \n',
        JSON.stringify(error, null, 4),
      );
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
