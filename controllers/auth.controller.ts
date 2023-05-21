import { NextFunction, Request, Response, Router } from 'express';
import { Container, Service } from 'typedi';

import { successResponse } from '../helpers';
import { passportHandler } from '../helpers/passport';
import {
  createUserValidator,
  loginValidator,
  refreshTokenValidation,
} from '../helpers/validators';
import { BaseController, ILoginResponse, IUser } from '../interfaces';
import { AuthService, UserService } from '../services';

@Service()
class AuthController extends BaseController<AuthService> {
  public router: Router;

  constructor(
    private readonly userService: UserService,
  ) {
    super(Container.get(AuthService));
    this.router = Router();
    this.initRoutes();
  }

  protected initRoutes(): void {
    this.router.post('/login', this.login.bind(this));
    this.router.post('/sign-up', this.signUp.bind(this));
    this.router.post('/refresh-token', this.refreshToken.bind(this));
    this.router.get(
      '/logout',
      passportHandler.authenticate('jwt', { session: false }),
      this.logout.bind(this),
    );
  }

  private async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = await loginValidator.validateAsync(req.body);
      const { email, password } = body;
      const login: ILoginResponse = await this.controllerService.loginUser(
        email,
        password,
      );

      res.json(successResponse(login));
    } catch (e) {
      next(e);
    }
  }

  private async signUp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userData: IUser = await createUserValidator.validateAsync(req.body);
      const createdUser: IUser = await this.userService.createUser(userData);

      res.status(201).json(successResponse(createdUser));
    } catch (e) {
      next(e);
    }
  }

  private async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = await refreshTokenValidation.validateAsync(req.body);
      const newTokens: ILoginResponse = await this.controllerService.refreshToken(
        body.refreshToken,
      );

      res.json(successResponse(newTokens));
    } catch (e) {
      next(e);
    }
  }

  private async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.controllerService.logoutUser(req.user?.id);

      res.json(successResponse(null));
    } catch (e) {
      next(e);
    }
  }
}

export const authController = Container.get(AuthController).router;
