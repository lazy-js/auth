import { NextFunction, Request, Response, BaseController, Token, Body } from '@lazy-js/server';
import { successResponse } from '@lazy-js/utils';

// services
import { UserService } from '../service/UserService';

// types
import { IKcApi } from '../../kcApi';
import { IClient } from '../../Realm';
import { INotificationClientSdk } from '../../../types';

// loggers
import { userControllerLogger } from '../../../config/loggers';
import { PATHNAMES } from '../constants';

// paths
export const registerPath = '/register';
export const loginPath = '/login';
export const validateAccessTokenPath = '/validate-access-token';
export const validateRolePath = '/validate-role';
export const refreshAccessTokenPath = '/refresh-access-token';
export const updatePasswordPath = '/me/password';
export const verifyPath = '/me/verify';
export const resendVerifyCodePath = '/resend-verify-code';

class UserController extends BaseController {
    public userService: UserService;
    public client: IClient;
    public kcApi: IKcApi;
    public notificationClientSdk: INotificationClientSdk;
    constructor(client: IClient, kcApi: IKcApi, notificationClientSdk: INotificationClientSdk) {
        super({ pathname: `/${client.name}` });
        this.client = client;
        this.kcApi = kcApi;
        this.notificationClientSdk = notificationClientSdk;
        this.userService = new UserService(client, kcApi, notificationClientSdk);

        this.post(PATHNAMES.REGISTER, this.register.bind(this));
        this.post(PATHNAMES.LOGIN, this.login.bind(this));
        this.post(PATHNAMES.VALIDATE_ACCESS_TOKEN, this.validateAccessToken.bind(this));
        this.post(PATHNAMES.VALIDATE_ROLE, this.validateRole.bind(this));
        this.post(PATHNAMES.REFRESH_TOKEN, this.refreshToken.bind(this));
        this.put(PATHNAMES.UPDATE_OWN_PASSWORD, this.updatePassword.bind(this));
        this.put(PATHNAMES.VERIFY_OWN_ACCOUNT, this.verify.bind(this));
        this.get(PATHNAMES.RESEND_VERIFY_CODE, this.resendVerifyCode.bind(this));
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('registering user');
            console.log(req.body);
            const accessToken = Token() as string;
            const user = await this.userService.register({
                body: req.body,
                accessToken: accessToken,
            });

            return res.json(successResponse(user));
        } catch (error: any) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const loginResponse = await this.userService.login({
                body: req.body,
            });

            res.json(successResponse(loginResponse));
        } catch (error: any) {
            next(error);
        }
    }

    async validateAccessToken(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = Token() as string;
            const payload = await this.userService.validateAccessToken(accessToken);
            res.json(successResponse(payload));
        } catch (error: any) {
            next(error);
        }
    }

    async validateRole(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = Token() as string;
            const { role } = Body('role') as { role: string | string[] };
            const payload = await this.userService.validateRole(accessToken, role);
            res.json(successResponse(payload));
        } catch (error: any) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = Body('refreshToken')?.refreshToken || (Token() as string);

            const tokenResponse = await this.userService.refreshToken(refreshToken);
            userControllerLogger.info(`Token refreshed successfully: ${tokenResponse.refreshToken}`);
            res.json(successResponse(tokenResponse));
        } catch (error: any) {
            next(error);
        }
    }

    async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = Token() as string;
            const { newPassword } = Body('newPassword');
            await this.userService.updatePassword(accessToken, newPassword);

            res.json(successResponse());
        } catch (error: any) {
            next(error);
        }
    }

    async verify(req: Request, res: Response, next: NextFunction) {
        try {
            await this.userService.verify(req.body);
            res.json(successResponse());
        } catch (error: any) {
            next(error);
        }
    }

    async resendVerifyCode(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, method } = Body('email', 'method');
            await this.userService.resendVerifyCode({ email, method });
            res.json(successResponse());
        } catch (error: any) {
            next(error);
        }
    }
}

export { UserController };
