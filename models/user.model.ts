import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Container, Service } from 'typedi';

import { IUser } from '../interfaces';

const { Schema } = mongoose;

export interface IUserModel extends Omit<IUser, 'id'>, mongoose.Document {
  comparePassword(password: string): Promise<boolean>;
  secureObject(): IUser;
}

@Service()
export class UserSchema extends Schema {
  constructor() {
    super(
      {
        email: { type: String, unique: true },
        password: String,
        passwordResetToken: String,
        passwordResetExpires: Date,

        refreshToken: String,

        firstName: String,
        lastName: String,
        picture: String,
        mobile: String,
        status: String,
      },
      {
        timestamps: true,
        versionKey: false,
      },
    );

    this.pre<IUserModel>('save', function (_next) {
      // If the password field is not modified, move to the next middleware
      if (!this.isModified('password')) {
        return _next();
      }

      bcrypt.genSalt(10, (_err, _salt) => {
        if (_err) {
          return _next(_err);
        }
        bcrypt.hash(this.password, _salt, (_err, _hash) => {
          if (_err) {
            return _next(_err);
          }

          this.password = _hash;
          return _next();
        });
      });
    });

    this.pre('find', function (next) {
      this.select({
        password: false,
        passwordResetExpires: false,
        passwordResetToken: false,
        refreshToken: false,
        __v: false,
      });
      next();
    });

    this.pre('findOne', function (next) {
      this.select({
        passwordResetExpires: false,
        passwordResetToken: false,
        refreshToken: false,
        __v: false,
      });
      next();
    });

    this.methods.comparePassword = function (
      _requestPassword: string,
    ): Promise<boolean> {
      return new Promise((resolve, reject) => {
        bcrypt.compare(_requestPassword, this.password, (err, isMatch) => {
          if (err) {
            reject(err);
          } else {
            resolve(isMatch);
          }
        });
      });
    };

    this.methods.secureObject = function () {
      const user = this.toObject();
      user.password = undefined;
      user.refreshToken = undefined;
      user.id = user._id.toString();
      return user;
    };
  }
}

export default mongoose.model<IUserModel>('User', Container.get(UserSchema));
