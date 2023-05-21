import { IUser } from './user.interface';

export interface ITokenObject {
    token: string;
    expire: Date;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: ITokenObject;
  refreshToken: ITokenObject;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User extends IUser {}
    }
}
