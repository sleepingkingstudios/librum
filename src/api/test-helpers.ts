import { defaultTo } from 'lodash';

import type { DataObject } from '@utils/types';
import type {
  ApiError,
  FetchFailure,
  FetchSuccess,
} from './types';

interface IBuildFailureResponseOptions {
  data?: DataObject;
  error?: ApiError;
  status?: number;
}

interface IBuildSuccessResponseOptions {
  data?: DataObject;
}

export const buildFailureResponse = (
  options?: IBuildFailureResponseOptions
): FetchFailure => {
  if (options === null || options == undefined) {
    return { error: { data: {}, status: 400 }};
  }

  const data = defaultTo(options.data, null);
  const error = defaultTo(options.error, null);
  const status = defaultTo(options.status, 400);

  if (error === null) {
    return { error: { data: {}, status }};
  }

  if (data === null) {
    return {
      error: {
        status,
        data: {
          ok: false,
          error,
        },
      },
    };
  }

  return {
    error: {
      status,
      data: {
        ok: false,
        data,
        error,
      },
    },
  };
};

export const buildSuccessResponse = (
  options?: IBuildSuccessResponseOptions
): FetchSuccess => {
  if (options === null || options == undefined) {
    return { data: { ok: true } }
  }

  const data = defaultTo(options.data, null);

  if (data === null) {
    return { data: { ok: true } }
  }

  return { data: { data, ok: true } };
};

export const fetchErrorResponse: FetchFailure = {
  error: {
    error: 'something went wrong',
    status: 'FETCH_ERROR',
  },
};

export const serializedErrorResponse: FetchFailure = {
  error: { message: 'something went wrong' }
};
