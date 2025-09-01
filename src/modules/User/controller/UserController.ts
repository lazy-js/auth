import { NextFunction, Request, Response } from '@lazy-js/server';
import { UserService } from '../service/UserService';
import { IKcApi } from '../../kcApi';
import { IClient } from '../../Realm';
import { userControllerLogger } from '../../../config/loggers';
import { BaseController } from '@lazy-js/server';
import { successResponse } from '@lazy-js/utils';
import { INotificationClientSdk } from '../../../types';
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
    this.userService = new UserService(client, kcApi, notificationClientSdk);

    this.mountPostRoute(
      '/register',
      this.register.bind(this),
      definitions.register,
    );
    this.mountPostRoute('/login', this.login.bind(this), definitions.login);
    this.mountPostRoute(
      '/validate-access-token',
      this.validateAccessToken.bind(this),
      definitions.validateAccessToken,
    );
    this.mountPostRoute(
      '/validate-role',
      this.validateRole.bind(this),
      definitions.validateRole,
    );
    this.mountPostRoute(
      '/refresh-token',
      this.refreshToken.bind(this),
      definitions.refreshToken,
    );
    this.mountPostRoute(
      '/update-password',
      this.updatePassword.bind(this),
      definitions.updatePassword,
    );
    this.mountPostRoute('/verify', this.verify.bind(this), definitions.verify);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.register({
        body: req.body,
        accessToken: req.headers.authorization,
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
      const accessToken = req.headers.authorization;
      const payload = await this.userService.validateAccessToken(accessToken);
      res.json(successResponse(payload));
    } catch (error: any) {
      userControllerLogger.error('RRRORORORO', error);
      next(error);
    }
  }

  async validateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization;
      const { role } = req.body;
      const payload = await this.userService.validateRole(accessToken, role);
      res.json(successResponse(payload));
    } catch (error: any) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken =
        req.body?.refreshToken || req.headers?.authorization?.split(' ')?.[1];

      const tokenResponse = await this.userService.refreshToken(refreshToken);
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
      let accessToken = req.headers.authorization;

      const { newPassword } = req.body;
      await this.userService.updatePassword(accessToken, newPassword);

      res.json(successResponse());
    } catch (error: any) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const isVerified = await this.userService.verify(req.body);
      res.json(successResponse({ canLogin: isVerified }));
    } catch (error: any) {
      next(error);
    }
  }
}

export { UserController };
