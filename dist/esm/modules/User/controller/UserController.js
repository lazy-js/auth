import { BaseController, Token, Body, } from '@lazy-js/server';
import { successResponse } from '@lazy-js/utils';
// services
import { UserService } from '../service/UserService';
// loggers
import { userControllerLogger } from '../../../config/loggers';
// paths
export const registerPath = '/register';
export const loginPath = '/login';
export const validateAccessTokenPath = '/validate-access-token';
export const validateRolePath = '/validate-role';
export const refreshAccessTokenPath = '/refresh-access-token';
export const updatePasswordPath = '/me/password';
export const verifyPath = '/me/verify';
class UserController extends BaseController {
    constructor(client, kcApi, notificationClientSdk) {
        super({ pathname: `/${client.name}` });
        this.client = client;
        this.kcApi = kcApi;
        this.notificationClientSdk = notificationClientSdk;
        this.userService = new UserService(client, kcApi, notificationClientSdk);
        this.post(registerPath, this.register.bind(this));
        this.post(loginPath, this.login.bind(this));
        this.post(validateAccessTokenPath, this.validateAccessToken.bind(this));
        this.post(validateRolePath, this.validateRole.bind(this));
        this.post(refreshAccessTokenPath, this.refreshToken.bind(this));
        this.put(updatePasswordPath, this.updatePassword.bind(this));
        this.put(verifyPath, this.verify.bind(this));
    }
    async register(req, res, next) {
        try {
            const accessToken = Token();
            const user = await this.userService.register({
                body: req.body,
                accessToken: accessToken,
            });
            res.json(successResponse(user));
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
            res.json(successResponse(loginResponse));
        }
        catch (error) {
            next(error);
        }
    }
    async validateAccessToken(req, res, next) {
        try {
            const accessToken = Token();
            const payload = await this.userService.validateAccessToken(accessToken);
            res.json(successResponse(payload));
        }
        catch (error) {
            next(error);
        }
    }
    async validateRole(req, res, next) {
        try {
            const accessToken = Token();
            const { role } = Body('role');
            const payload = await this.userService.validateRole(accessToken, role);
            res.json(successResponse(payload));
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        var _a;
        try {
            const refreshToken = ((_a = Body('refreshToken')) === null || _a === void 0 ? void 0 : _a.refreshToken) || Token();
            const tokenResponse = await this.userService.refreshToken(refreshToken);
            userControllerLogger.info(`Token refreshed successfully: ${tokenResponse.refreshToken}`);
            res.json(successResponse(tokenResponse));
        }
        catch (error) {
            next(error);
        }
    }
    async updatePassword(req, res, next) {
        try {
            const accessToken = Token();
            const { newPassword } = Body('newPassword');
            await this.userService.updatePassword(accessToken, newPassword);
            res.json(successResponse());
        }
        catch (error) {
            next(error);
        }
    }
    async verify(req, res, next) {
        try {
            await this.userService.verify(req.body);
            res.json(successResponse());
        }
        catch (error) {
            next(error);
        }
    }
}
export { UserController };
//# sourceMappingURL=UserController.js.map