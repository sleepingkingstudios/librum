import * as React from 'react';

import type {
  ApiError,
} from '../types';
import type {
  Effect,
  EffectOptions,
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
} from './utils';

export const useQueryRequest = <Data extends Record<string, unknown> = Record<string, unknown>>({
  arg,
  effects = [],
  options = {},
  useQuery,
}: {
  arg?: unknown,
  effects?: Effect[],
  options?: EffectOptions,
  useQuery: UseQuery,
}): Response<Data> => {
  // @todo: Parameter processing here.

  const result: UseQueryResult = useQuery(arg);
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
    effects.forEach(
      (effect: Effect) => { effect(response, options); }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effects, options, status]);

  // @todo: List of effects here.

  // console.log('useQueryResult(), response:', response);

  return response;
};
