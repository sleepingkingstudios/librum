import * as React from 'react';

import type {
  Refetch,
  RefetchOptions,
  Response,
  UseQuery,
  UseQueryOptions,
} from '../types';
import { useDeepMemo } from './use-deep-memo';
import { useRequest } from './use-request';

export const useQuery: UseQuery = ({
  body,
  config = {},
  headers,
  middleware = [],
  method = 'get',
  params,
  url,
  wildcards,
}: UseQueryOptions): [Response, Refetch] => {
  const [response, refetch] = useRequest({
    config,
    method,
    middleware,
    url,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedRefetch = React.useCallback(refetch, [method, url]);
  const memoizedOptions = useDeepMemo<RefetchOptions>({
    body,
    headers,
    params,
    wildcards,
  });

  React.useEffect(
    () => { memoizedRefetch(memoizedOptions).catch(() => null) },
    [memoizedRefetch, memoizedOptions],
  );

  return [response, refetch];
};
