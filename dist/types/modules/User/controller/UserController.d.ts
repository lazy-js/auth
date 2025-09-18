import { NextFunction, Request, Response, BaseController } from '@lazy-js/server';
import { UserService } from '../service/UserService';
import { IKcApi } from '../../kcApi';
import { IClient } from '../../Realm';
import { INotificationClientSdk } from '../../../types';
export declare const registerPath = "/register";
export declare const loginPath = "/login";
export declare const validateAccessTokenPath = "/validate-access-token";
export declare const validateRolePath = "/validate-role";
export declare const refreshAccessTokenPath = "/refresh-access-token";
export declare const updatePasswordPath = "/me/password";
export declare const verifyPath = "/me/verify";
declare class UserController extends BaseController {
    userService: UserService;
    client: IClient;
    kcApi: IKcApi;
    notificationClientSdk: INotificationClientSdk;
    constructor(client: IClient, kcApi: IKcApi, notificationClientSdk: INotificationClientSdk);
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    validateAccessToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    validateRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    verify(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export { UserController };
//# sourceMappingURL=UserController.d.ts.map