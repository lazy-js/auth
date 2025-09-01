"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../service/UserService");
const loggers_1 = require("../../../config/loggers");
const server_1 = require("@lazy-js/server");
const utils_1 = require("@lazy-js/utils");
// test
const definitions = {
    register: {
        description: 'Register a new user',
    },
    login: {
        description: 'Login a user',
    },
    validateAccessToken: {
        description: 'Validate an access token',
    },
    validateRole: {
        description: 'Validate a role',
    },
    refreshToken: {
        description: 'Refresh a token',
    },
    updatePassword: {
        description: 'Update a password',
    },
    verify: {
        description: 'Verify a user',
    },
};
class UserController extends server_1.BaseController {
    constructor(client, kcApi, notificationClientSdk) {
        super({ pathname: `/${client.name}` });
        this.client = client;
        this.kcApi = kcApi;
        this.notificationClientSdk = notificationClientSdk;
        this.userService = new UserService_1.UserService(client, kcApi, notificationClientSdk);
        this.mountPostRoute('/register', this.register.bind(this), definitions.register);
        this.mountPostRoute('/login', this.login.bind(this), definitions.login);
        this.mountPostRoute('/validate-access-token', this.validateAccessToken.bind(this), definitions.validateAccessToken);
        this.mountPostRoute('/validate-role', this.validateRole.bind(this), definitions.validateRole);
        this.mountPostRoute('/refresh-token', this.refreshToken.bind(this), definitions.refreshToken);
        this.mountPostRoute('/update-password', this.updatePassword.bind(this), definitions.updatePassword);
        this.mountPostRoute('/verify', this.verify.bind(this), definitions.verify);
    }
    async register(req, res, next) {
        try {
            const user = await this.userService.register({
                body: req.body,
                accessToken: req.headers.authorization,
            });
            res.json((0, utils_1.successResponse)(user));
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
            const accessToken = req.headers.authorization;
            const payload = await this.userService.validateAccessToken(accessToken);
            res.json((0, utils_1.successResponse)(payload));
        }
        catch (error) {
            loggers_1.userControllerLogger.error('RRRORORORO', error);
            next(error);
        }
    }
    async validateRole(req, res, next) {
        try {
            const accessToken = req.headers.authorization;
            const { role } = req.body;
            const payload = await this.userService.validateRole(accessToken, role);
            res.json((0, utils_1.successResponse)(payload));
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        var _a, _b, _c, _d;
        try {
            const refreshToken = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.refreshToken) || ((_d = (_c = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')) === null || _d === void 0 ? void 0 : _d[1]);
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
            let accessToken = req.headers.authorization;
            const { newPassword } = req.body;
            await this.userService.updatePassword(accessToken, newPassword);
            res.json((0, utils_1.successResponse)());
        }
        catch (error) {
            next(error);
        }
    }
    async verify(req, res, next) {
        try {
            const isVerified = await this.userService.verify(req.body);
            res.json((0, utils_1.successResponse)({ canLogin: isVerified }));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map