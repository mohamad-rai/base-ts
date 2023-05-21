import { Router } from 'express';
import { Container, Service } from 'typedi';

import { authController } from './auth.controller';
import { fileController } from './file.controller';
import { userController } from './user.controller';

@Service()
class MainController {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  protected initRoutes(): void {
    this.router.use('/auth', authController);
    this.router.use('/file', fileController);
    this.router.use('/user', userController);
  }
}

export const mainController = Container.get(MainController).router;