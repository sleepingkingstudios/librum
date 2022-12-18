import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import type { AlertsContext } from '@alerts/types';
import type { Dispatch } from '@store';
import type {
  DataObject,
  Literal,
} from '@utils/types';

export type ApiError = { type: string, message: string, data: DataObject };

export type ApiParam = Literal | DataObject;

export type ApiFailure<Data extends DataObject = DataObject> =
  { ok: false, error?: ApiError, data?: Data };

export type ApiSuccess<Data extends DataObject = DataObject> =
  { ok: true, data?: Data };

export type ApiResponse<Data extends DataObject = DataObject> =
  ApiFailure<Data> | ApiSuccess<Data>;

export type Effect<
  Options extends EffectOptions = EffectOptions,
> = (response: Response, options?: Options) => void;

export type EffectOptions<
  Options extends Record<string, unknown> = Record<string, unknown>,
> = Options & {
  alerts: AlertsContext,
  dispatch: Dispatch,
};

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

export type UseWrappedQueryRequest<
  Data extends Record<string, unknown> = Record<string, unknown>
> = (props?: { arg?: unknown }) => Response<Data>;
