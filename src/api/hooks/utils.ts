import { camelCase } from 'lodash';
import { faUserClock } from '@fortawesome/free-solid-svg-icons';

import type { AlertsContext } from '@alerts/types';
import { actions as sessionActions } from '@session';
import { clearStoredSession } from '@session/utils';
import type { Dispatch } from '@store';
import { expiredSessionError } from '../errors';
import type {
  ApiError,
  ApiFailure,
  ApiSuccess,
} from '../types';
import type {
  FetchError,
  Response,
  ResponseStatus,
  UseQueryError,
  UseQueryResult,
} from './types';

const extractApiFailure = (result: UseQueryResult): ApiFailure | undefined => {
  if (!hasApiError(result)) { return; }

  const error = result.error as FetchError;
  const { data } = error;

  return data;
};

const extractApiSuccess = (result: UseQueryResult): ApiSuccess | undefined => {
  const maybeData = result.data;

  if (typeof maybeData === 'undefined') { return; }

  if (!('ok' in maybeData && 'data' in maybeData)) { return; }

  return maybeData as ApiSuccess;
};

const hasApiError = (result: UseQueryResult): boolean => {
  if (!('error' in result)) { return false; }

  const error: UseQueryError = result.error;

  // Exclude SerializedError.
  if (!('status' in error)) { return false; }

  const { status } = error;

  // Exclude CustomError, FetchError, ParsingError.
  if (!(typeof status === 'number')) { return false; }

  return true;
};

export const camelizeErrorType = (errorType: string): string => {
  return errorType
    .split('.')
    .map(camelCase)
    .join('.');
};

export const extractData = (result: UseQueryResult): Record<string, unknown> | undefined => {
  const { isError, isSuccess } = result;

  if (isError) {
    const body: ApiFailure | undefined = extractApiFailure(result);

    if (typeof body === 'undefined') { return; }

    const { data } = body;

    return data;
  }

  if (isSuccess) {
    const body: ApiSuccess | undefined = extractApiSuccess(result);

    if (typeof body === 'undefined') { return; }

    const { data } = body;

    return data;
  }

  return;
};

export const extractError = (result: UseQueryResult): ApiError | undefined => {
  const { isError } = result;

  if (!isError) { return; }

  const body: ApiFailure | undefined = extractApiFailure(result);

  if (typeof body === 'undefined') { return; }

  const { error } = body;

  return error;
};

export const extractStatus = (result: UseQueryResult): ResponseStatus => {
  if (result.isSuccess) { return 'success'; }

  if (result.isError) { return hasApiError(result) ? 'failure' : 'errored'; }

  if (result.isLoading) { return 'loading'; }

  if (result.isUninitialized) { return 'uninitialized'; }

  return 'unknown';
};

export const handleAuthenticationError = ({
  alerts,
  dispatch,
  response,
}: {
  alerts: AlertsContext,
  dispatch: Dispatch,
  response: Response,
}): boolean => {
  const { errorType } = response;
  const { displayAlert } = alerts;

  if (errorType === expiredSessionError) {
    dispatch(sessionActions.destroy());

    clearStoredSession();

    displayAlert({
      context: 'authentication:session',
      icon: faUserClock,
      message: 'Your login session has expired',
      type: 'warning',
    });

    return true;
  }

  return false;
};
