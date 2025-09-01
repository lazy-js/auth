"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appLogger = exports.userControllerLogger = exports.userServiceLogger = exports.userModuleLogger = void 0;
const utils_1 = require("@lazy-js/utils");
const userModuleLogger = utils_1.Logger.create('User Module', {
    disableInfo: true,
    disableWarn: true,
    disableDebug: true,
    disableError: true,
});
exports.userModuleLogger = userModuleLogger;
const userServiceLogger = userModuleLogger.child('User Service', {
    disableInfo: true,
    disableWarn: true,
    disableDebug: true,
    disableError: true,
});
exports.userServiceLogger = userServiceLogger;
const userControllerLogger = userModuleLogger.child('User Controller', {
    disableInfo: true,
    disableWarn: true,
    disableDebug: true,
    disableError: true,
});
exports.userControllerLogger = userControllerLogger;
const appLogger = utils_1.Logger.create('App', {
    disableInfo: true,
    disableWarn: true,
    disableDebug: true,
    disableError: true,
});
exports.appLogger = appLogger;
//# sourceMappingURL=loggers.js.map