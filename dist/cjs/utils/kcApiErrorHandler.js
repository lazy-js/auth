"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kcErrorHandler = kcErrorHandler;
const keycloak_admin_client_1 = require("@keycloak/keycloak-admin-client");
const errors_1 = __importDefault(require("../config/errors"));
function msgIncludes(err, ...str) {
    const message = err.message.toLowerCase();
    return str.every((s) => message.includes(s.toLowerCase()));
}
function kcErrorHandler(err) {
    if (err instanceof TypeError) {
        throw new Error('NETWORK ERROR');
    }
    if (err instanceof keycloak_admin_client_1.NetworkError) {
        if (msgIncludes(err, 'sibling group', 'already exists'))
            throw new Error(errors_1.default.SUB_GROUP_ALREADY_EXISTS.code);
        if (msgIncludes(err, 'Top level group named', 'already exists'))
            throw new Error(errors_1.default.TOP_LEVEL_GROUP_ALREADY_EXISTS.code);
        else
            throw new Error(errors_1.default.UNKNOWN_ERROR_IN_KC_API.code);
    }
    throw new Error(errors_1.default.SUB_GROUP_ALREADY_EXISTS.code);
}
//# sourceMappingURL=kcApiErrorHandler.js.map