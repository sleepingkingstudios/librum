export type FetchOptions = {
  body?: string,
  headers?: Record<string, string>,
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

export type RefetchOptions = FetchOptions & {
  params?: RequestParams,
  wildcards?: RequestWildcards,
};

export type RequestBody = Record<string, unknown> | string;

export type RequestOptions = {
  authorization?: string,
  body?: RequestBody,
  contentType?: string,
  headers?: Record<string, string>,
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
  status: ResponseStatus | 'unknown',
};

export type ResponseData = Record<string, unknown> | string;

export type ResponseStatus =
  'uninitialized' | 'loading' | 'errored' | 'failure' | 'success';
