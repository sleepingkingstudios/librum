import * as React from 'react';

import { fetchRequest } from './fetch-request';
import type {
  Refetch,
  RefetchOptions,
  RequestOptions,
  Response,
} from './types';
import { withStatus } from './utils';

export const useRequest = ({
  options = {},
  url,
}: {
  options?: RequestOptions,
  url: string,
}): [Response, Refetch] => {
  const initialStatus = 'uninitialized';
  const [response, setResponse] =
    React.useState<Response>(withStatus({ status: initialStatus }));
  const {
    body,
    headers,
    method,
    params,
    wildcards,
  } = options;

  const performRequest: Refetch = (request?: RefetchOptions): void => {
    const { status } = response;

    if (status === 'loading') { return; }

    setResponse(withStatus({ response, status: 'loading' }));

    fetchRequest(
      url,
      {
        body,
        headers,
        method,
        params,
        wildcards,
        ...request,
      }
    )
      .then(response => setResponse(response))
      .catch(error => { throw error; });
  };

  return [response, performRequest];
};
