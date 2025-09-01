import { NextFunction, Request, Response } from '@lazy-js/server';
import { UserService } from '../service/UserService';
import { IKcApi } from '../../kcApi';
import { IClient } from '../../Realm';
import { BaseController } from '@lazy-js/server';
import { INotificationClientSdk } from '../../../types';
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