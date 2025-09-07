"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appLogger = exports.userControllerLogger = exports.userServiceLogger = exports.userModuleLogger = exports.realmBuilderLogger = void 0;
const utils_1 = require("@lazy-js/utils");
const disable = true;
exports.realmBuilderLogger = utils_1.Logger.create('Realm Builder', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
const userModuleLogger = utils_1.Logger.create('User Module', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
exports.userModuleLogger = userModuleLogger;
const userServiceLogger = userModuleLogger.child('User Service', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
exports.userServiceLogger = userServiceLogger;
const userControllerLogger = userModuleLogger.child('User Controller', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
exports.userControllerLogger = userControllerLogger;
const appLogger = utils_1.Logger.create('App', {
    disableInfo: disable,
    disableWarn: disable,
    disableDebug: disable,
    disableError: disable,
});
exports.appLogger = appLogger;
//# sourceMappingURL=loggers.js.map