import type {
  Middleware,
  PerformRequest,
  RequestBody,
  RequestParams,
  Response,
  ResponseData,
  ResponseStatus,
} from './types';

export const applyMiddleware = ({
  config = {},
  middleware,
  performRequest,
}: {
  config?: Record<string, unknown>,
  middleware: Middleware[],
  performRequest: PerformRequest
}): PerformRequest => middleware.reverse().reduce(
  (fn: PerformRequest, middleware: Middleware): PerformRequest => (
    middleware(fn, config)
  ),
  performRequest,
);

export const emptyResponse: Response = {
  hasData: false,
  hasError: false,
  isErrored: false,
  isFailure: false,
  isLoading: false,
  isSuccess: false,
  isUninitialized: false,
  status: 'unknown',
};

export const formatBody = ({ body }: { body?: RequestBody }): string => {
  if (!body) { return null; }

  if (typeof body === 'string') { return body.length === 0 ? null : body; }

  if (Object.keys(body).length === 0) { return null; }

  return JSON.stringify(body);
};

export const formatParams = (params: RequestParams): string => {
  if (!params) { return ''; }

  const entries: [string, string][] = Object.entries(params);

  if (entries.length === 0) { return ''; }

  const formatted: string =
    entries
    .map((tuple: [string, string]): string => {
      const [key, value] = tuple;

      return `${key}=${encodeURI(value)}`;
    })
    .join('&');

  return `?${formatted}`;
};

export const mapData = <Data = ResponseData>(data: Data): Data => {
  if (data === null || data === undefined) { return null; }

  if (typeof data === 'string') {
    if (data.length === 0) { return null; }

    return data;
  }

  if (Object.keys(data).length === 0) { return null; }

  return data;
};

export const withData = <Data = ResponseData>({
  data,
  response = emptyResponse,
}: {
  data: Data,
  response?: Response,
}): Response<Data> => ({
  ...response,
  data,
  hasData: true,
});

export const withError = <Error = ResponseData>({
  error,
  response = emptyResponse,
}: {
  error: Error,
  response?: Response,
}): Response<ResponseData, Error> => ({
  ...response,
  error,
  hasError: true,
});

export const withStatus = ({
  response = emptyResponse,
  status,
}: {
  response?: Response,
  status: ResponseStatus,
}): Response => ({
  ...response,
  isErrored: (status === 'errored'),
  isFailure: (status === 'failure'),
  isLoading: (status === 'loading'),
  isSuccess: (status === 'success'),
  isUninitialized: (status === 'uninitialized'),
  status,
});
