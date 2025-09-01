import { Logger } from '@lazy-js/utils';

const userModuleLogger = Logger.create('User Module', {
  disableInfo: true,
  disableWarn: true,
  disableDebug: true,
  disableError: true,
});

const userServiceLogger = userModuleLogger.child('User Service', {
  disableInfo: true,
  disableWarn: true,
  disableDebug: true,
  disableError: true,
});

const userControllerLogger = userModuleLogger.child('User Controller', {
  disableInfo: true,
  disableWarn: true,
  disableDebug: true,
  disableError: true,
});

export { userModuleLogger, userServiceLogger, userControllerLogger };

const appLogger = Logger.create('App', {
  disableInfo: true,
  disableWarn: true,
  disableDebug: true,
  disableError: true,
});

export { appLogger };
