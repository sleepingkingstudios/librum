import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type {
  ApiError,
  ApiFailure,
} from '../types';

export type Effect = (response: Response, options?: EffectOptions) => void;

export type EffectOptions = Record<string, unknown>;

export type FetchError = {
  data: ApiFailure,
  status: number,
};

export type Response<Data = Record<string, unknown>> = {
  data?: Data,
  error?: ApiError,
  errorType?: string,
  hasData: boolean,
  hasError: boolean,
  isErrored: boolean,
  isFailure: boolean,
  isLoading: boolean,
  isSuccess: boolean,
  isUninitialized: boolean,
  status: ResponseStatus,
};

export type ResponseStatus =
  'unknown' | 'uninitialized' | 'loading' | 'errored' | 'failure' | 'success';

export type UseQuery = (
  arg?: unknown,
  effects?: Effect[],
  options?: Record<string, unknown>,
) => UseQueryResult;

export type UseQueryError = FetchBaseQueryError | SerializedError;

export type UseQueryResult = {
  data?: Record<string, unknown>,
  error?: UseQueryError,
  isError: boolean,
  isLoading: boolean,
  isSuccess: boolean,
  isUninitialized: boolean,
};
