import type {
  Annotated,
  Annotations,
} from '@utils/annotations';
import { applyMiddleware } from '@utils/middleware';
import type {
  Middleware,
  MiddlewareBuilder,
} from '@utils/middleware';
import type { DataObject } from '@utils/types';
import type { Mutation } from './types';

export type Request = (
  (values?: DataObject) => Promise<unknown> | void
) & Annotated;

type UseRequestParams<Options extends DataObject = DataObject> = {
  mutation: Mutation,
  options?: Options,
};

type BuildRequestParams = {
  middleware?: MiddlewareBuilder[] | MiddlewareBuilder,
  params?: DataObject,
};

export type UseRequest<Options extends DataObject = DataObject> = (
  ({
    mutation,
    options,
  }: UseRequestParams<Options>) => Request
) & Annotated;

export type BuildRequest<Options extends DataObject = DataObject> = (
  (
    {
      middleware,
      params,
    }: BuildRequestParams,
    annotations?: Annotations,
  ) => UseRequest<Options>
) & Annotated;

export const buildRequest: BuildRequest = <Options extends DataObject = DataObject>(
  {
    middleware = [] as MiddlewareBuilder[],
    params = {},
  }: BuildRequestParams,
  annotations: Annotations = null,
) => {
  const middlewareArray: MiddlewareBuilder[] =
    Array.isArray(middleware) ? middleware : [middleware];
  const useRequest: UseRequest<Options> = ({
    mutation,
    options = {},
  }) => {
    const reifiedMiddleware: Middleware[] =
      middlewareArray.map(builder => builder(options));

    const request: Request = async (values = {}) => {
      return await applyMiddleware(mutation, reifiedMiddleware)({
        ...params,
        ...values,
      });
    };

    if (annotations !== null) {
      request.annotations = {
        middleware: reifiedMiddleware,
        mutation,
        options,
        params,
        type: 'request',
        ...annotations,
      };
    }

    return request;
  };

  if (annotations !== null) {
    useRequest.annotations = {
      middleware: middlewareArray,
      params,
      type: 'hooks:useRequest',
      ...annotations,
    };
  }

  return useRequest;
};
