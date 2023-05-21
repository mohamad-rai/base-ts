import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Service } from 'typedi';

import {
  JWT_REFRESH_TOKEN_SECRET,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRE,
  TOKEN_EXPIRE,
} from '../config/consts';
import { generateError } from '../helpers';
import { IErrors, ILoginResponse, IUser } from '../interfaces';
import { UserModel } from '../models';

@Service()
export class AuthService {
  private readonly UserModel: typeof UserModel;

  constructor() {
    this.UserModel = UserModel;
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<ILoginResponse> {
    const user = await this.UserModel.findOne({ email }).exec();
    if (!user) {
      throw generateError(
        [{ key: IErrors.NOT_FOUND, message: 'Credential not found!' }],
        'NOT_FOUND',
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw generateError(
        [{ key: IErrors.NOT_FOUND, message: 'Credential not found!' }],
        'NOT_FOUND',
      );
    }

    const tokens = await this.$createTokens(user.secureObject());

    return tokens;
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<ILoginResponse> {
    const user = await this.UserModel.findOne({ refreshToken }).exec();
    if (!user) {
      throw generateError(
        [{ key: IErrors.REFRESH_TOKEN_INVALID, message: 'Invalid Refresh token!' }],
        'UNAUTHORIZED',
      );
    }
    try {
      const decoded = await jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);
      if (user.id !== decoded?.sub) {
        throw generateError(
          [{ key: IErrors.ACCESS_TOKEN_EXPIRED, message: 'Token is Expired!' }],
          'UNAUTHORIZED',
        );
      }

      const tokens = await this.$createTokens(user.secureObject());
      return tokens;
    } catch (err) {
      user.refreshToken = '';
      await user.save();
      throw generateError(
        [{ key: IErrors.ACCESS_TOKEN_EXPIRED, message: 'Token is Expired!' }],
        'UNAUTHORIZED',
      );
    }
  }

  async logoutUser(userId?: string): Promise<boolean> {
    const user = await this.UserModel.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    }).exec();

    if (!user) {
      throw generateError(
        [{ key: IErrors.NOT_FOUND, message: 'User not found!' }],
        'NOT_FOUND',
      );
    }

    user.refreshToken = '';
    await user.save();

    return true;
  }

  private async $storeRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.UserModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { refreshToken },
      { multi: true },
    );
    return !!result;
  }
  
  private async $createTokens(user: IUser) {
    const now = new Date();

    const token = jwt.sign(user, JWT_SECRET, {
      expiresIn: `${TOKEN_EXPIRE}m`,
    });
    const tokenExpire = new Date(
      now.setMinutes(now.getMinutes() + TOKEN_EXPIRE),
    );

    const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: `${REFRESH_TOKEN_EXPIRE}m`,
    });
    const refreshTokenExpire = new Date(
      now.setMinutes(now.getMinutes() + (REFRESH_TOKEN_EXPIRE - TOKEN_EXPIRE)),
    );
    await this.$storeRefreshToken(refreshToken, user.id);

    return {
      user: user,
      accessToken: { token, expire: tokenExpire },
      refreshToken: { token: refreshToken, expire: refreshTokenExpire },
    };
  }
}
