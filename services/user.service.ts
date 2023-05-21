import mongoose from 'mongoose';
import { Service } from 'typedi';

import { generateError } from '../helpers';
import { IErrors, IUser } from '../interfaces';
import { UserModel } from '../models';

@Service()
export class UserService {
  private UserModel;

  constructor() {
    this.UserModel = UserModel;
  }
  async getSingleUserById(id: string): Promise<IUser> {
    const user = await this.UserModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    }).exec();
    if (!user) {
      throw generateError(
        [{ key: IErrors.NOT_FOUND, message: 'User not found!' }],
        'NOT_FOUND',
      );
    }

    return user.secureObject();
  }

  async getUsers(): Promise<IUser[]> {
    const users = await this.UserModel.find().exec();
    return users.map((user) => user.secureObject());
  }

  async createUser(data: IUser): Promise<IUser> {
    // todo: check duplicate
    const user = await new this.UserModel({
      ...data,
      refreshToken: '',
    }).save();
    return user.secureObject();
  }

  async updateUser(
    data: Partial<IUser>,
    id: string,
  ): Promise<boolean> {
    const user = await this.UserModel.findOneAndUpdate(
      { id: new mongoose.Types.ObjectId(id) },
      data,
    );
    if (!user) {
      throw generateError(
        [{ key: IErrors.NOT_FOUND, message: 'User not found!' }],
        'NOT_FOUND',
      );
    }
    return true;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.UserModel.findOne({
      id: new mongoose.Types.ObjectId(id),
    });
    if (!user) {
      throw generateError(
        [{ key: IErrors.NOT_FOUND, message: 'User not found!' }],
        'NOT_FOUND',
      );
    }
    await user.deleteOne();
    return true;
  }
}
