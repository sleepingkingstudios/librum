import { IUser } from './user';

export interface ISession {
  authenticated: boolean;
  token?: string;
  user?: IUser;
}
