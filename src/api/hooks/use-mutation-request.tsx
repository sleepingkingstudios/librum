import * as React from 'react';

import { useAlerts } from '@alerts';
import type { AlertsContext } from '@alerts/types';
import type { Dispatch } from '@store';
import { useStoreDispatch } from '@store/hooks';
import type {
  ApiError,
  Effect,
  EffectOptions,
  Response,
  ResponseStatus,
  UseMutation,
  UseMutationRequest,
  UseMutationTrigger,
} from '../types';
import {
  camelizeErrorType,
  extractData,
  extractError,
  extractStatus,
  handleAuthenticationError,
} from './utils';

export const useMutationRequest: UseMutationRequest = <
  Data extends Record<string, unknown> = Record<string, unknown>
>({
  effects = [],
  options = {},
  useMutation,
}: {
  effects?: Effect[],
  options?: Record<string, unknown>,
  useMutation: UseMutation,
}): [UseMutationTrigger, Response<Data>] => {
  const [
    trigger,
    result,
  ] = useMutation();
  const {
    isError,
    isLoading,
    isSuccess,
    isUninitialized,
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
    if(status === memoStatus.current) { return; }

    memoStatus.current = status;

    if (status === 'failure') {
      const authenticationError = handleAuthenticationError({
        alerts,
        dispatch,
        response,
      });

      if (authenticationError) { return; }
    }

    effects.forEach(
      (effect: Effect) => { effect(response, mergedOptions); }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effects, mergedOptions, status]);

  return [trigger, response];
};
