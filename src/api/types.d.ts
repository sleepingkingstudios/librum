import type { DisplayAlertProps } from '@alerts';
import type { DataObject } from '@utils/types';

export type AlertDirective = {
  dismiss: string,
  errorType: string,
} | {
  dismiss: string,
  status: ResponseStatus,
} | {
  display: DisplayAlertProps,
  errorType: string,
} | {
  display: DisplayAlertProps,
  status: ResponseStatus,
};

export type ApiError = { type: string, message: string, data: DataObject };

export type FetchOptions = {
  body?: string,
  headers?: RequestHeaders,
  method?: HttpMethod,
};

export type HttpMethod =
  'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' |
  'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export type MatchFunction =
  (response: Response, options: MiddlewareOptions) => void;

export type Matcher = {
  on: (match: MatcherProps, fn: MatchFunction) => Matcher;
};

export type MatcherProps = {
  errorType: string;
} | {
  status: ResponseStatus;
};

export type Middleware =
  (fn: PerformRequest, options: MiddlewareOptions) => PerformRequest;

export type MiddlewareOptions = Record<string, unknown>;

export type PerformRequest = (url: string, options?: RequestOptions) =>
  Promise<Response>;

export type Refetch = (options?: RefetchOptions) => Promise<Response>;

export type RefetchOptions = {
  body?: RequestBody,
  headers?: RequestHeaders,
  params?: RequestParams,
  wildcards?: RequestWildcards,
};

export type RequestBody = Record<string, unknown> | string;

export type RequestHeaders = Record<string, string>;

export type RequestOptions = {
  body?: RequestBody,
  contentType?: string,
  headers?: RequestHeaders,
  method?: HttpMethod,
  params?: RequestParams,
  wildcards?: RequestWildcards,
};

export type RequestParams = Record<string, string>;

export type RequestWildcards = Record<string, string>;

export type Response<Data = ResponseData, Error = ResponseData> = {
  data?: Data,
  error?: Error,
  errorType?: string,
  hasData: boolean,
  hasError: boolean,
  isErrored: boolean,
  isFailure: boolean,
  isLoading: boolean,
  isSuccess: boolean,
  isUninitialized: boolean,
  meta: Record<string, unknown>,
  status: ResponseStatus | 'unknown',
};

export type ResponseData = Record<string, unknown> | string;

export type ResponseStatus =
  'uninitialized' | 'loading' | 'errored' | 'failure' | 'success';

export type UseApiQuery = (options: UseApiQueryOptions) => [Response, Refetch];

export type UseApiQueryOptions = UseQueryOptions & {
  alerts?: AlertDirective[],
};

export type UseApiRequest =
  (options: UseApiRequestOptions) => [Response, Refetch];

export type UseApiRequestOptions = UseRequestOptions & {
  alerts?: AlertDirective[],
};

export type UseQuery = (options: UseQueryOptions) => [Response, Refetch];

export type UseQueryOptions = UseRequestOptions & RefetchOptions;

export type UseRequest = (options: UseRequestOptions) => [Response, Refetch];

export type UseRequestConfig = {
  config?: MiddlewareOptions,
  method?: HttpMethod,
  middleware?: Middleware[],
};

export type UseRequestOptions = UseRequestConfig & {
  url: string,
};
