export type ApiError = { type: string, message: string, data: DataObject };

export type FetchOptions = {
  body?: string,
  headers?: RequestHeaders,
  method?: HttpMethod,
};

export type HttpMethod =
  'get' | 'post' | 'put' | 'patch' | 'delete' | 'head';

export type Middleware =
  (fn: PerformRequest, options: MiddlewareOptions) => PerformRequest;

export type MiddlewareOptions = Record<string, unknown>;

export type PerformRequest = (url: string, options?: RequestOptions) =>
  Promise<Response>;

export type Refetch = (options?: RefetchOptions) => void;

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

export type UseQuery = (options: UseQueryOptions) => [Response, Refetch];

export type UseQueryOptions = UseRequestOptions & RefetchOptions;

export type UseRequest = (options: UseRequestOptions) => [Response, Refetch];

export type UseRequestOptions = {
  config?: MiddlewareOptions,
  method?: HttpMethod,
  middleware?: Middleware[],
  url: string,
};
