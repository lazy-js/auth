import { Logger } from '@lazy-js/utils';
const disable = true;
export const realmBuilderLogger = Logger.create('Realm Builder', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
const userModuleLogger = Logger.create('User Module', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
const userServiceLogger = userModuleLogger.child('User Service', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
const userValidatorLogger = userModuleLogger.child('User Validator', {
    disableDebug: disable,
    disableError: disable,
    disableInfo: disable,
    disableWarn: disable,
});
const userControllerLogger = userModuleLogger.child('User Controller', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
export { userModuleLogger, userServiceLogger, userControllerLogger, userValidatorLogger };
const appLogger = Logger.create('App', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
export { appLogger };
//# sourceMappingURL=loggers.js.map