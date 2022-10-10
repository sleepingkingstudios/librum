import * as React from 'react';

import { useAlerts } from '@alerts';
import type { AlertsContext } from '@alerts/types';
import type { Dispatch } from '@store';
import { useStoreDispatch } from '@store/hooks';
import type {
  Effect,
  EffectOptions,
} from '../effects/types';
import type {
  ApiError,
} from '../types';
import type {
  Response,
  ResponseStatus,
  UseQuery,
  UseQueryResult,
} from './types';
import {
  camelizeErrorType,
  extractData,
  extractError,
  extractStatus,
  handleAuthenticationError,
} from './utils';

export const useQueryRequest = <
  Data extends Record<string, unknown> = Record<string, unknown>
>({
  arg,
  effects = [],
  options = {},
  useQuery,
}: {
  arg?: unknown,
  effects?: Effect[],
  options?: Record<string, unknown>,
  useQuery: UseQuery,
}): Response<Data> => {
  // @todo: Parameter processing here.

  const result: UseQueryResult = useQuery(arg);
  const {
    isError,
    isLoading,
    isSuccess,
    isUninitialized,
    refetch,
  } = result;
  const data: Record<string, unknown> | undefined = extractData(result);
  const error: ApiError | undefined = extractError(result);
  const status: ResponseStatus = extractStatus(result);
  const response: Response<Data> = {
    hasData: false,
    hasError: false,
    isErrored: false,
    isFailure: false,
    isLoading,
    isSuccess,
    isUninitialized,
    status,
  };
  const memoStatus = React.useRef(null);
  const alerts: AlertsContext = useAlerts();
  const dispatch: Dispatch = useStoreDispatch();
  const mergedOptions: EffectOptions = {
    ...options,
    alerts,
    dispatch,
  };
  const hasLoaded = React.useRef(false);

  if (data) {
    response.data = data as Data;
    response.hasData = true;
  }

  if (error) {
    const { type } = error;

    response.error = error;
    response.errorType = camelizeErrorType(type);
    response.hasError = true;
    response.isFailure = true;
  } else if (isError) {
    response.isErrored = true;
  }

  React.useEffect(() => {
    if(status === 'loading') { hasLoaded.current = true; }

    if(status === memoStatus.current) { return; }

    memoStatus.current = status;

    if (status === 'failure') {
      if (!hasLoaded.current) {
        // The component is reloaded after a failure, so manually trigger a refetch.
        refetch();

        return;
      }

      const authenticationError = handleAuthenticationError({
        alerts,
        dispatch,
        response,
      });

      console.log('useEffect(), hasLoaded:', hasLoaded.current, 'authenticationError:', authenticationError);

      if (authenticationError) { return; }
    }

    effects.forEach(
      (effect: Effect) => { effect(response, mergedOptions); }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effects, mergedOptions, status]);

  return response;
};
