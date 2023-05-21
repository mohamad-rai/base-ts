import path from 'path';

import { NextFunction, Request, Response, Router } from 'express';
import { Container, Service } from 'typedi';

import {
  generateError,
  successResponse,
  uploadFileMiddleware,
} from '../helpers';
import {
  changeFilePermissionValidator,
  createFileValidator,
  getFileValidator,
} from '../helpers/validators/file.validator';
import { BaseController, FILE_MODEL, IErrors, IFile } from '../interfaces';
import { FileService } from '../services/file.service';

@Service()
class FileController extends BaseController<FileService> {
  public router: Router;
  constructor() {
    super(Container.get(FileService));
    this.router = Router();
    this.initRoutes();
  }

  protected initRoutes(): void {
    this.router.post(
      '/upload/:model',
      uploadFileMiddleware,
      this.uploadSingleFile.bind(this),
    );

    this.router.get('/:fileId', this.getFile.bind(this));
    this.router.delete('/:fileId', this.deleteFile.bind(this));
    this.router.put('/permission/:fileId', this.changeFilePermission.bind(this));
  }

  private async uploadSingleFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        throw generateError(
          [
            {
              key: IErrors.VALIDATION_ERROR,
              message: 'Failed to upload the media',
            },
          ],
          'BAD_REQUEST',
        );
      }

      const fileData: IFile = await createFileValidator.validateAsync({
        name: req.file.filename,
        originalName: req.file.originalname,
        model: req.params.model as FILE_MODEL,
        path: req.file.destination.replace('public', ''),
        type: req.file.mimetype,
        owner: req.user!.id,
      });

      const file = await this.controllerService.createFile(fileData);

      res.json(successResponse(file));
    } catch (e) {
      next(e);
    }
  }

  private async getFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params = await getFileValidator.validateAsync(req.params);

      const file = await this.controllerService.getSingleFile(
        params.fileId,
        req.user!,
      );

      res.sendFile(path.resolve(path.join('public', file.path, file.name)));
    } catch (e) {
      next(e);
    }
  }

  private async deleteFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params = await getFileValidator.validateAsync(req.params);
      await this.controllerService.deleteFile(params.fileId, req.user!);

      res.json(successResponse(null));
    } catch (e) {
      next(e);
    }
  }

  private async changeFilePermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = req.user!;
      const body = await changeFilePermissionValidator.validateAsync(req.body);
      const params = await getFileValidator.validateAsync(req.params);

      await this.controllerService.changeFilePermission(
        params.fileId,
        user,
        body.usersThatCanAccess,
      );

      res.json(successResponse(null));
    } catch (e) {
      next(e);
    }
  }
}

export const fileController = Container.get(FileController).router;
