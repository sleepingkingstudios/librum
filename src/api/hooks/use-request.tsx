import * as React from 'react';

import { fetchRequest } from '../request';
import type {
  PerformRequest,
  Refetch,
  RefetchOptions,
  Response,
  UseRequest,
  UseRequestOptions,
} from '../types';
import {
  applyMiddleware,
  withStatus,
} from '../utils';

export const useRequest: UseRequest = ({
  config = {},
  method,
  middleware = [],
  url,
}: UseRequestOptions): [Response, Refetch] => {
  const initialStatus = 'uninitialized';
  const [response, setResponse] =
    React.useState<Response>(withStatus({ status: initialStatus }));
  const wrappedRequest: PerformRequest = applyMiddleware({
    config,
    middleware,
    performRequest: fetchRequest,
  });

  const refetch: Refetch = (request?: RefetchOptions): Promise<Response> => {
    const { status } = response;

    if (status === 'loading') {
      return new Promise(resolve => resolve(response));
    }

    setResponse(withStatus({ response, status: 'loading' }));

    return wrappedRequest(
      url,
      {
        method,
        ...request,
      }
    )
      .then((response) => {
        setResponse(response);

        return response;
      })
      .catch(error => { throw error; });
  };

  return [response, refetch];
};
