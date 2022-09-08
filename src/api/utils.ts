import {
  camelCase,
  isArray,
  isPlainObject,
  map,
  snakeCase,
} from 'lodash';

import type {
  DataItem,
  DataObject,
} from '@utils/types';
import type {
  ApiError,
  ApiFailure,
  ApiSuccess,
  FetchFailure,
  FetchResponse,
  FetchSuccess,
} from './types';

interface IResponseMatchesProps {
  errorType?: string,
  response: FetchResponse,
  status: 'success' | 'failure',
}

const getErrorData = (response: FetchFailure): ApiFailure | null => {
  const { error } = response;

  if (!('data' in error)) { return null; }

  if (typeof error.data !== 'object') { return null; }

  return error.data as ApiFailure;
};

export const convertToCamelCase = (data: DataItem): DataItem => {
  if (isPlainObject(data)) {
    const object: DataObject = data as DataObject;
    const entries = Object.entries(object);
    const mapped = map(
      entries,
      ([key, value]: [string, DataItem]) => (
        [camelCase(key), convertToCamelCase(value)] as [string, DataItem]
      ),
    );

    return Object.fromEntries(mapped);
  }

  if (isArray(data)) {
    const mapped: DataItem[] = map(
      data,
      (item: DataItem): DataItem => convertToCamelCase(item),
    );

    return mapped as DataItem;
  }

  return data;
};

export const convertToSnakeCase = (data: DataItem): DataItem => {
  if (isPlainObject(data)) {
    const object: DataObject = data as DataObject;
    const entries = Object.entries(object);
    const mapped = map(
      entries,
      ([key, value]: [string, DataItem]) => (
        [snakeCase(key), convertToSnakeCase(value)] as [string, DataItem]
      ),
    );

    return Object.fromEntries(mapped);
  }

  if (isArray(data)) {
    const mapped: DataItem[] = map(
      data,
      (item: DataItem): DataItem => convertToSnakeCase(item),
    );

    return mapped as DataItem;
  }

  return data;
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

export const responseMatches = ({
  errorType = null,
  response,
  status,
}: IResponseMatchesProps): boolean => {
  if (status === 'success') {
    return isSuccess(response);
  }

  if (!isFailure(response)) {
    return false;
  }

  if (errorType === null) { return true; }

  const error = getError(response);

  if (error === null) { return false; }

  return error.type === errorType;
};
