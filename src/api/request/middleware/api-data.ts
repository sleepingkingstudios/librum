import {
  camelCase,
  isPlainObject,
} from 'lodash';

import {
  convertToCamelCase,
  convertToSnakeCase,
} from '@utils/data';
import type { DataObject } from '@utils/types';
import type {
  ApiError,
  Middleware,
  MiddlewareOptions,
  PerformRequest,
  RequestBody,
  RequestOptions,
  Response,
  ResponseData,
} from '../types';
import {
  withData,
  withError,
} from '../utils';

const convertBodyToSnakeCase = (body: RequestBody): RequestBody => {
  if (body === null || body === undefined || typeof body === 'string') {
    return body;
  }

  return convertToSnakeCase(body) as DataObject;
};

export const convertOptionsToSnakeCase =
  (options: RequestOptions): RequestOptions => {
    if (options === undefined || options === null) { return {}; }

    const {
      body,
      params,
      ...rest
    } = options;
    const hasBody = !!body || typeof body === 'string';

    return {
      ...(hasBody ? { body: convertBodyToSnakeCase(body) } : {}),
      ...(params ? { params: convertToSnakeCase(params) as DataObject }: {}),
      ...rest,
    };
  };

export const convertResponseToCamelCase = (original: Response): Response => {
  let response: Response = { ...original };

  const {
    data,
    error,
  } = response;

  const apiData = extractData(data);
  const apiError = extractError(data, error);

  if (apiData) {
    response = withData({
      data: apiData,
      response,
    });
  } else {
    response = {
      ...response,
      data: undefined,
      hasData: false,
    };
  }

  if (apiError) {
    response = withError({
      error: apiError,
      errorType: apiError.type,
      response,
    });
  } else {
    response = {
      ...response,
      error: undefined,
      errorType: undefined,
      hasError: false,
    };
  }

  return response;
};

export const extractData = (raw: ResponseData): DataObject => {
  if (raw === null || raw === undefined) { return null; }

  if (typeof raw === 'string') {
    if (raw.length === 0) { return null; }

    return { data: raw };
  }

  if (Object.keys(raw).length === 0) { return null; }

  if (!('data' in raw)) { return null; }

  if (!isPlainObject(raw.data)) { return { data: raw.data }; }

  return convertToCamelCase(raw.data) as DataObject;
};

export const extractError =
  (raw: ResponseData, err: ResponseData): ApiError => {
    if (typeof err === 'string') {
      if (err.length !== 0) {
        const error: ApiError = {
          data: {},
          message: err,
          type: 'client.error',
        };

        return error;
      }
    } else if (!(err === null || err === undefined)) {
      if (Object.keys(err).length !== 0) {
        const error: ApiError = {
          data: err as DataObject,
          message: 'Unknown error',
          type: 'client.error',
        };

        return error;
      }
    }

    if (raw === null || raw === undefined) { return null; }

    if (typeof raw === 'string') { return null; }

    if (Object.keys(raw).length === 0) { return null; }

    if (!('error' in raw)) { return null; }

    if (!isPlainObject(raw.error)) {
      if (raw.error === null || raw.error === undefined) { return null; }

      const error: ApiError = {
        data: { error: raw.error },
        message: 'Unknown error',
        type: 'client.error',
      };

      return error;
    }

    const rawError = raw.error as DataObject;

    if (!('message' in rawError && 'type' in rawError)) {
      const error: ApiError = {
        data: { error: rawError },
        message: 'Unknown error',
        type: 'client.error',
      };

      return error;
    }

    const errorType: string =
      (rawError.type as string).split('.').map(camelCase).join('.');
    const errorMessage = rawError.message as string;

    if (!('data' in rawError)) {
      const error: ApiError = {
        data: {},
        message: errorMessage,
        type: errorType,
      };

      return error;
    }

    const errorData = rawError.data as DataObject;
    const error: ApiError = {
      data: convertToCamelCase(errorData) as DataObject,
      message: errorMessage,
      type: errorType,
    };

    return error;
  };

export const apiDataMiddleware: Middleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (fn: PerformRequest, config: MiddlewareOptions): PerformRequest => (
    (url: string, options: RequestOptions = {}): Promise<Response> => (
      fn(url, convertOptionsToSnakeCase(options))
        .then((response: Response) => convertResponseToCamelCase(response))
    )
  );
