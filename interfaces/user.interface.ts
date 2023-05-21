export interface IUser {
  id: string;
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  refreshToken: string;

  firstName: string;
  lastName: string;
  gender: string;
  picture: string;
  mobile: string;
  status: string;
}

export enum USER_GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export type IAcceptableUserKeyForUpdate =
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'picture'
  | 'mobile'
  | 'status'
  | 'location';
