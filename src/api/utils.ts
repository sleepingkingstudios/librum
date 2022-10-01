import type { DataObject } from '@utils/types';
import type {
  ApiError,
  ApiFailure,
  ApiSuccess,
  FetchFailure,
  FetchResponse,
  FetchSuccess,
} from './types';

const getErrorData = (response: FetchFailure): ApiFailure | null => {
  const { error } = response;

  if (!('data' in error)) { return null; }

  if (typeof error.data !== 'object') { return null; }

  return error.data as ApiFailure;
};

export const isFailure = (response: FetchResponse): boolean => {
  return 'error' in response;
};

export const isSuccess = (response: FetchResponse): boolean => {
  return 'data' in response;
};

export const getData = (response: FetchResponse): DataObject | null => {
  if (isFailure(response)) {
    const errorData = getErrorData(response as FetchFailure);

    if (errorData === null) { return null; }

    if (!('data' in errorData)) { return null; }

    const data: DataObject = errorData.data;

    return data;
  }

  const responseData: ApiSuccess = (response as FetchSuccess).data;

  if (!('data' in responseData)) { return null; }

  const data: DataObject = responseData.data;

  return data;
};

export const getError = (response: FetchResponse): ApiError | null => {
  if (!(isFailure(response))) { return null; }

  const errorData = getErrorData(response as FetchFailure);

  if (errorData === null) { return null; }

  if (!('error' in errorData)) { return null; }

  const error: ApiError = errorData.error;

  return error;
};

export const hasData = (response: FetchResponse): boolean => {
  if (isFailure(response)) {
    const errorData = getErrorData(response as FetchFailure);

    if (errorData === null) { return false; }

    return 'data' in errorData;
  }

  const responseData: ApiSuccess = (response as FetchSuccess).data;

  return 'data' in responseData;
};

export const hasError = (response: FetchResponse): boolean => {
  if (!(isFailure(response))) { return false; }

  const errorData = getErrorData(response as FetchFailure);

  if (errorData === null) { return false; }

  return 'error' in errorData;
};
