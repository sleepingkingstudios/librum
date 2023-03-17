import * as React from 'react';

import { fetchRequest } from '../fetch-request';
import type {
  Middleware,
  MiddlewareOptions,
  PerformRequest,
  Refetch,
  RefetchOptions,
  RequestOptions,
  Response,
} from '../types';
import {
  applyMiddleware,
  withStatus,
} from '../utils';

export const useRequest = ({
  config = {},
  middleware = [],
  options = {},
  url,
}: {
  config?: MiddlewareOptions,
  middleware?: Middleware[],
  options?: RequestOptions,
  url: string,
}): [Response, Refetch] => {
  const initialStatus = 'uninitialized';
  const [response, setResponse] =
    React.useState<Response>(withStatus({ status: initialStatus }));
  const wrappedRequest: PerformRequest = applyMiddleware({
    config,
    middleware,
    performRequest: fetchRequest,
  });

  const performRequest: Refetch = (request?: RefetchOptions): void => {
    const { status } = response;

    if (status === 'loading') { return; }

    setResponse(withStatus({ response, status: 'loading' }));

    wrappedRequest(
      url,
      {
        ...options,
        ...request,
      }
    )
      .then(response => setResponse(response))
      .catch(error => { throw error; });
  };

  return [response, performRequest];
};
