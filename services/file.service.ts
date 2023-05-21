import mongoose from 'mongoose';
import { Service } from 'typedi';

import { generateError } from '../helpers';
import { IErrors, IFile, IUser } from '../interfaces';
import { FileModel } from '../models';

@Service()
export class FileService {
  private fileModel;
  constructor() {
    this.fileModel = FileModel;
  }

  async createFile(data: IFile): Promise<IFile> {
    const file = await new this.fileModel(data).save();
    return (await file.populate('owner')).toObject();
  }

  async getSingleFile(id: string, user: IUser): Promise<IFile> {
    const file: IFile = (await this.$findFileById(id, user)).toObject();

    return file;
  }

  async deleteFile(id: string, user: IUser): Promise<boolean> {
    const file = await this.$findFileById(id, user);

    const fileObject: IFile = file.toObject();

    this.$checkOnwer(fileObject.owner, user.id);

    await file.deleteOne();
    return true;
  }

  async changeFilePermission(
    id: string,
    owner: IUser,
    usersThatCanAccess?: string[],
  ): Promise<boolean> {
    const file = await this.$findFileById(id, owner);

    const fileObject: IFile = file.toObject();

    this.$checkOnwer(fileObject.owner, owner.id);

    Object.assign(file, {
      access: usersThatCanAccess
        ? Array.from(
            usersThatCanAccess.length
              ? new Set([...usersThatCanAccess, owner.id])
              : [],
          )
        : [owner.id],
    });

    file.save();

    return true;
  }

  $checkOnwer(fileOwnerId: string, userId: string): boolean {
    if (fileOwnerId.toString() !== userId) {
      throw generateError(
        [
          {
            key: IErrors.FORBIDDEN_ACCESS,
            message: 'You don\'t have access to this file',
          },
        ],
        'FORBIDDEN',
      );
    }
    return true;
  }

  // todo: upload has error | change permission should have more test

  async $findFileById(id: string, user?: IUser) {
    const file = await this.fileModel
      .findOne({ _id: new mongoose.Types.ObjectId(id) })
      .exec();

    if (!file) {
      throw generateError(
        [{ key: IErrors.NOT_FOUND, message: 'File not found!' }],
        'NOT_FOUND',
      );
    }

    const objectFile: IFile = file.toObject();

    if (
      user &&
      objectFile.access &&
      objectFile.access.length &&
      !objectFile.access.map((aid) => aid.toString()).includes(user.id)
    ) {
      throw generateError(
        [
          {
            key: IErrors.FORBIDDEN_ACCESS,
            message: 'You don\'t have access to this file',
          },
        ],
        'FORBIDDEN',
      );
    }

    return file;
  }
}
