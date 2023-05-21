import { NextFunction, Request, Response, Router } from 'express';
import { Container, Service } from 'typedi';

import { successResponse } from '../helpers';
import {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
} from '../helpers/validators';
import { BaseController, IUser } from '../interfaces';
import { UserService } from '../services';

@Service()
class UserController extends BaseController<UserService> {
  public router: Router;

  constructor() {
    super(Container.get(UserService));
    this.router = Router();
    this.initRoutes();
  }

  protected initRoutes(): void {
    this.router.get('/:userId', this.getUserById.bind(this));
    this.router.post('/create', this.createUser.bind(this));
    this.router.put('/:userId', this.updateUser.bind(this));
    this.router.get('/', this.getAllUsers.bind(this));
  }

  private async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params = await getUserValidator.validateAsync(req.params);
      const user: IUser = await this.controllerService.getSingleUserById(
        params.userId,
      );
      res.json(successResponse(user));
    } catch (e) {
      next(e);
    }
  }

  private async getAllUsers(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users: IUser[] = await this.controllerService.getUsers();
      res.json(successResponse(users));
    } catch (e) {
      next(e);
    }
  }

  private async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userData: IUser = await createUserValidator.validateAsync(req.body);
      const createdUser: IUser = await this.controllerService.createUser(
        userData,
      );

      res.status(201).json(successResponse(createdUser));
    } catch (e) {
      next(e);
    }
  }

  private async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userData: IUser = await updateUserValidator.validateAsync(req.body);
      const userId = req.params.userId;
      await this.controllerService.updateUser(userData, userId);

      res.json(successResponse(null));
    } catch (e) {
      next(e);
    }
  }
}

export const userController = Container.get(UserController).router;
