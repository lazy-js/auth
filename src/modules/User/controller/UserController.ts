import {
    NextFunction,
    Request,
    Response,
    BaseController,
    Token,
    Body,
} from '@lazy-js/server';
import { successResponse } from '@lazy-js/utils';

// services
import { UserService } from '../service/UserService';

// types
import { IKcApi } from '../../kcApi';
import { IClient } from '../../Realm';
import { INotificationClientSdk } from '../../../types';

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
    public userService: UserService;
    public client: IClient;
    public kcApi: IKcApi;
    public notificationClientSdk: INotificationClientSdk;
    constructor(
        client: IClient,
        kcApi: IKcApi,
        notificationClientSdk: INotificationClientSdk,
    ) {
        super({ pathname: `/${client.name}` });
        this.client = client;
        this.kcApi = kcApi;
        this.notificationClientSdk = notificationClientSdk;
        this.userService = new UserService(
            client,
            kcApi,
            notificationClientSdk,
        );

        this.mountPostRoute(registerPath, this.register.bind(this));
        this.mountPostRoute(loginPath, this.login.bind(this));
        this.mountPostRoute(
            validateAccessTokenPath,
            this.validateAccessToken.bind(this),
        );
        this.mountPostRoute(validateRolePath, this.validateRole.bind(this));
        this.mountPostRoute(
            refreshAccessTokenPath,
            this.refreshToken.bind(this),
        );
        this.mountPutRoute(updatePasswordPath, this.updatePassword.bind(this));
        this.mountPutRoute(verifyPath, this.verify.bind(this));
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = Token() as string;
            const user = await this.userService.register({
                body: req.body,
                accessToken: accessToken,
            });

            res.json(successResponse(user));
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
            const payload = await this.userService.validateAccessToken(
                accessToken,
            );
            res.json(successResponse(payload));
        } catch (error: any) {
            next(error);
        }
    }

    async validateRole(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = Token() as string;
            const { role } = Body('role') as { role: string | string[] };
            const payload = await this.userService.validateRole(
                accessToken,
                role,
            );
            res.json(successResponse(payload));
        } catch (error: any) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken =
                Body('refreshToken')?.refreshToken || (Token() as string);

            const tokenResponse = await this.userService.refreshToken(
                refreshToken,
            );
            userControllerLogger.info(
                `Token refreshed successfully: ${tokenResponse.refreshToken}`,
            );
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
}

export { UserController };
