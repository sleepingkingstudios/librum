import type {
  FetchOptions,
  HttpMethod,
  PerformRequest,
  RequestOptions,
  RequestParams,
  RequestWildcards,
  Response,
  ResponseData,
} from '../types';
import {
  applyWildcards,
  formatBody,
  formatParams,
  mapData,
  withData,
  withError,
  withStatus,
} from '../utils';

type DefaultsWithOptions = {
  contentType?: string,
  fetchOptions: FetchOptions,
  params?: RequestParams,
  wildcards?: RequestWildcards,
};

const applyDefaults = ({
  contentType = 'json',
  headers = {},
  ...options
}: RequestOptions): DefaultsWithOptions => {
  const {
    body,
    method,
    params,
    wildcards,
    ...rest
  } = options;
  const formattedBody = formatBody({ body });
  const fetchOptions: FetchOptions = {
    ...rest,
    ...(formattedBody ? { body: formattedBody } : {}),
    headers: {
      ...defaultHeaders({ contentType }),
      ...headers,
    },
    method: (method || 'get').toUpperCase() as HttpMethod,
  };

  return {
    contentType,
    fetchOptions,
    params,
    wildcards,
  };
};

const defaultHeaders = ({
  contentType,
}: {
  contentType: string,
}): Record<string, string> => {
  const headers: Record<string, string> = {}

  if (contentType.toLowerCase() === 'json') {
    headers['Content-Type'] = 'application/json';
  } else {
    headers['Content-Type'] = 'text/plain';
  }

  return headers;
};

const isError = (error: unknown): boolean => {
  if (!(typeof error === 'object')) { return false; }

  return 'message' in error && 'name' in error;
};

export const fetchRequest: PerformRequest = (url, options = {}) => {
  const {
    contentType,
    fetchOptions,
    params,
    wildcards,
  } = applyDefaults(options);

  let ok: boolean;

  try {
    const fetchUrl =
      `${applyWildcards({ url, wildcards })}${formatParams(params)}`;

    return fetch(fetchUrl, fetchOptions)
      .then((res) => {
        ok = res.ok;

        if (contentType.toLowerCase() === 'json') {
          return res.json();
        } else {
          return res.text();
        }
      })
      .then((raw) => {
        const body = raw as ResponseData;
        const data = mapData(body);

        let response: Response = withStatus({
          status: (ok ? 'success' : 'failure'),
        });

        if (data) { response = withData({ data, response }); }

        return new Promise(resolve => resolve(response));
      })
      .catch((error: unknown) => {
        if (!isError(error)) { throw error; }

        const { name } = error as Record<string, unknown>;

        if (name !== 'SyntaxError') { throw error; }

        const response = withError({
          error: error.toString(),
          response: withStatus({ status: 'errored' }),
        });

        return new Promise(resolve => resolve(response));
      }) as Promise<Response>;
  } catch(error: unknown) {
    const response = withError({
      error: error.toString(),
      response: withStatus({ status: 'errored' }),
    });

    return new Promise(resolve => resolve(response));
  }
};
