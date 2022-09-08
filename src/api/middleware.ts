import type { Annotations } from '@utils/annotations';
import type {
  Middleware,
  MiddlewareBuilder,
} from '@utils/middleware';
import type { Matcher } from './matcher';
import {
  convertToSnakeCase,
} from './utils';

const convertRequestToSnakeCase: MiddlewareBuilder = (): Middleware => (
  async (fn, params) => {
    return await fn(convertToSnakeCase(params));
  }
);

convertRequestToSnakeCase.annotations = {
  name: 'middleware:convertRequestToSnakeCase',
  type: 'middleware:convertRequestToSnakeCase',
};

export { convertRequestToSnakeCase };

export const matcherMiddleware = <MatchOptions extends Record<string, unknown>>(
  matcher: Matcher<unknown>,
  annotations: Annotations = null,
): MiddlewareBuilder => {
  const builder: MiddlewareBuilder = (
    options: MatchOptions,
  ): Middleware => (
    async (fn, params) => {
      const response = await fn(params);

      matcher(response, options);

      return response;
    }
  );

  if (annotations !== null) {
    builder.annotations = {
      matcher,
      type: 'middleware:matcher',
      ...annotations,
    };
  }

  return builder;
};
