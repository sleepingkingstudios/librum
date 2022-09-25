import type { FetchResponse } from '@api';
import type { Login } from '@session/api';
import type { Middleware } from '@utils/middleware';

export type SessionMiddleware = Middleware<
  Login,
  Promise<
    FetchResponse<{ token: string, user: User }>
  >
>;
