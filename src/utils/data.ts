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
