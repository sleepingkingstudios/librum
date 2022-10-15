import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type {
  ApiError,
  ApiFailure,
} from '../types';
import type { Effect } from '../effects/types';

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

export type UseMutation = () => readonly [
  UseMutationTrigger,
  UseMutationResult,
];

export type UseMutationRequest<
  Data extends Record<string, unknown> = Record<string, unknown>,
  Options extends Record<string, unknown> = Record<string, unknown>,
> = (opts?: UseMutationRequestProps<Options>) => [
  UseMutationTrigger,
  Response<Data>,
];

export type UseMutationRequestProps<
  Options extends Record<string, unknown> = Record<string, unknown>
> = {
  effects?: Effect[],
  options?: Options,
  useMutation?: UseMutation,
};

export type UseMutationResult = {
  data?: Record<string, unknown>,
  error?: UseQueryError,
  isError: boolean,
  isLoading: boolean,
  isSuccess: boolean,
  isUninitialized: boolean,
  reset: () => void,
};

export type UseMutationTrigger = (arg?: unknown) => Promise<unknown>;

export type UseQuery = (
  arg?: unknown,
) => UseQueryResult;

export type UseQueryError = FetchBaseQueryError | SerializedError;

export type UseQueryRequest<
  Data extends Record<string, unknown> = Record<string, unknown>
> = ({
  arg,
  effects,
  options,
  useQuery,
}: UseQueryRequestProps) => Response<Data>;

export type UseQueryRequestProps = {
  arg?: unknown,
  effects?: Effect[],
  options?: Record<string, unknown>,
  useQuery: UseQuery,
};

export type UseQueryResult = {
  data?: Record<string, unknown>,
  error?: UseQueryError,
  isError: boolean,
  isLoading: boolean,
  isSuccess: boolean,
  isUninitialized: boolean,
  refetch: () => void,
};
