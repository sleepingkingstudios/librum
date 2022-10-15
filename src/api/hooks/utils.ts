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
  FetchError,
  Response,
  ResponseStatus,
  UseMutationResult,
  UseQueryError,
  UseQueryResult,
} from '../types';

type Result = UseMutationResult | UseQueryResult;

const extractApiFailure = (result: Result): ApiFailure | undefined => {
  if (!hasApiError(result)) { return; }

  const error = result.error as FetchError;
  const { data } = error;

  return data;
};

const extractApiSuccess = (result: Result): ApiSuccess | undefined => {
  const { data } = result;

  if (typeof data === 'undefined' || data === null) { return; }

  if (!('ok' in data && 'data' in data)) { return; }

  return data as ApiSuccess;
};

const hasApiError = (result: Result): boolean => {
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

export const extractData = (result: Result): Record<string, unknown> | undefined => {
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

export const extractError = (result: Result): ApiError | undefined => {
  const { isError } = result;

  if (!isError) { return; }

  const body: ApiFailure | undefined = extractApiFailure(result);

  if (typeof body === 'undefined') { return; }

  const { error } = body;

  return error;
};

export const extractStatus = (result: Result): ResponseStatus => {
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
