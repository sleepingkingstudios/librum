import { convertToSnakeCase } from '@utils/data';
import type {
  Middleware,
  MiddlewareBuilder,
} from '@utils/middleware';

const convertRequestToSnakeCase: MiddlewareBuilder = (): Middleware => (
  async (fn, params) => {
    return await fn(convertToSnakeCase(params));
  }
);

convertRequestToSnakeCase.annotations = {
  name: 'api:middleware:convertRequestToSnakeCase',
  type: 'api:middleware:convertRequestToSnakeCase',
};

export { convertRequestToSnakeCase };
