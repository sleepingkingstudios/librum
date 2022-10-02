import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import type { FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import type { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';

import {
  convertToCamelCase,
  convertToSnakeCase,
} from '@utils/data';

const convertArgs = (fetchArgs: FetchArgs | string): FetchArgs | string => {
  if (typeof fetchArgs === 'string') { return fetchArgs; }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { body, params, ...rest } = fetchArgs;
  const formatted: FetchArgs = rest;

  if (!(body === undefined)) {
    formatted.body = convertToSnakeCase(body) as unknown;
  }

  if (!(params === undefined)) {
    formatted.params = convertToSnakeCase(params) as unknown;
  }

  return formatted;
};

export const baseQuery = (args: FetchBaseQueryArgs) => {
  const fetchQuery = fetchBaseQuery(args);
  const query: typeof fetchQuery = (
    async (
      fetchArgs: FetchArgs | string,
      api: BaseQueryApi,
      extraOptions: Record<string, unknown>,
    ) => {
      const result = await fetchQuery(
        convertArgs(fetchArgs),
        api,
        extraOptions,
      );
      const { data, error, meta } = result;

      return {
        data: convertToCamelCase(data),
        error,
        meta,
      } as typeof result;
    }
  );

  return query;
};
