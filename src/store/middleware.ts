import type { FetchResponse } from '@store/api';
import type { Middleware } from '@utils/middleware';
import type { Matcher } from './matcher';

type MatcherMiddleware = Middleware<
  unknown,
  Promise<
    FetchResponse<unknown>
  >
>;

export const matcherMiddleware = (
  matcher: Matcher<unknown>,
  options: unknown,
): MatcherMiddleware => {
  const middleware: MatcherMiddleware = async (fn, params) => {
    const response = await fn(params);

    matcher(response, options);

    return response;
  };

  return middleware;
};
