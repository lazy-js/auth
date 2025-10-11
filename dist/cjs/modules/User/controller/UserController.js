"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.resendVerifyCodePath = exports.verifyPath = exports.updatePasswordPath = exports.refreshAccessTokenPath = exports.validateRolePath = exports.validateAccessTokenPath = exports.loginPath = exports.registerPath = void 0;
const server_1 = require("@lazy-js/server");
const utils_1 = require("@lazy-js/utils");
// services
const UserService_1 = require("../service/UserService");
// loggers
const loggers_1 = require("../../../config/loggers");
const constants_1 = require("../constants");
// paths
exports.registerPath = '/register';
exports.loginPath = '/login';
exports.validateAccessTokenPath = '/validate-access-token';
exports.validateRolePath = '/validate-role';
exports.refreshAccessTokenPath = '/refresh-access-token';
exports.updatePasswordPath = '/me/password';
exports.verifyPath = '/me/verify';
exports.resendVerifyCodePath = '/resend-verify-code';
class UserController extends server_1.BaseController {
    constructor(client, kcApi, notificationClientSdk) {
        super({ pathname: `/${client.name}` });
        this.client = client;
        this.kcApi = kcApi;
        this.notificationClientSdk = notificationClientSdk;
        this.userService = new UserService_1.UserService(client, kcApi, notificationClientSdk);
        this.post(constants_1.PATHNAMES.REGISTER, this.register.bind(this));
        this.post(constants_1.PATHNAMES.LOGIN, this.login.bind(this));
        this.post(constants_1.PATHNAMES.VALIDATE_ACCESS_TOKEN, this.validateAccessToken.bind(this));
        this.post(constants_1.PATHNAMES.VALIDATE_ROLE, this.validateRole.bind(this));
        this.post(constants_1.PATHNAMES.REFRESH_TOKEN, this.refreshToken.bind(this));
        this.put(constants_1.PATHNAMES.UPDATE_OWN_PASSWORD, this.updatePassword.bind(this));
        this.put(constants_1.PATHNAMES.VERIFY_OWN_ACCOUNT, this.verify.bind(this));
        this.get(constants_1.PATHNAMES.RESEND_VERIFY_CODE, this.resendVerifyCode.bind(this));
    }
    async register(req, res, next) {
        try {
            console.log('registering user');
            console.log(req.body);
            const accessToken = (0, server_1.Token)();
            const user = await this.userService.register({
                body: req.body,
                accessToken: accessToken,
            });
            return res.json((0, utils_1.successResponse)(user));
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const loginResponse = await this.userService.login({
                body: req.body,
            });
            res.json((0, utils_1.successResponse)(loginResponse));
        }
        catch (error) {
            next(error);
        }
    }
    async validateAccessToken(req, res, next) {
        try {
            const accessToken = (0, server_1.Token)();
            const payload = await this.userService.validateAccessToken(accessToken);
            res.json((0, utils_1.successResponse)(payload));
        }
        catch (error) {
            next(error);
        }
    }
    async validateRole(req, res, next) {
        try {
            const accessToken = (0, server_1.Token)();
            const { role } = (0, server_1.Body)('role');
            const payload = await this.userService.validateRole(accessToken, role);
            res.json((0, utils_1.successResponse)(payload));
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        var _a;
        try {
            const refreshToken = ((_a = (0, server_1.Body)('refreshToken')) === null || _a === void 0 ? void 0 : _a.refreshToken) || (0, server_1.Token)();
            const tokenResponse = await this.userService.refreshToken(refreshToken);
            loggers_1.userControllerLogger.info(`Token refreshed successfully: ${tokenResponse.refreshToken}`);
            res.json((0, utils_1.successResponse)(tokenResponse));
        }
        catch (error) {
            next(error);
        }
    }
    async updatePassword(req, res, next) {
        try {
            const accessToken = (0, server_1.Token)();
            const { newPassword } = (0, server_1.Body)('newPassword');
            await this.userService.updatePassword(accessToken, newPassword);
            res.json((0, utils_1.successResponse)());
        }
        catch (error) {
            next(error);
        }
    }
    async verify(req, res, next) {
        try {
            await this.userService.verify(req.body);
            res.json((0, utils_1.successResponse)());
        }
        catch (error) {
            next(error);
        }
    }
    async resendVerifyCode(req, res, next) {
        try {
            const { email, method } = (0, server_1.Body)('email', 'method');
            await this.userService.resendVerifyCode({ email, method });
            res.json((0, utils_1.successResponse)());
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map