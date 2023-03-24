import * as React from 'react';

import { fetchRequest } from '../fetch-request';
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

  const refetch: Refetch = (request?: RefetchOptions): void => {
    const { status } = response;

    if (status === 'loading') { return; }

    setResponse(withStatus({ response, status: 'loading' }));

    wrappedRequest(
      url,
      {
        method,
        ...request,
      }
    )
      .then(response => setResponse(response))
      .catch(error => { throw error; });
  };

  return [response, refetch];
};
