import { Router } from 'express';

export abstract class BaseController<T> {
  public router: Router;

  constructor(protected readonly controllerService: T) {
    this.router = Router();
    this.initRoutes();
  }

  protected abstract initRoutes(): void;
}