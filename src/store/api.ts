import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { ApiResponse } from './types';
import type { RootState } from './index';
import { selector as selectSession } from '@session';
import type { Session } from '@session';

export {
  ApiData,
  ApiError,
  ApiFailure,
  ApiParam,
  ApiResponse,
  ApiSuccess,
  FetchFailure,
  FetchResponse,
  FetchSuccess,
} from './types';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const session: Session = selectSession(getState() as RootState);

      const {
        authenticated,
        token,
      } = session;

      if (authenticated) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStatus: builder.query<ApiResponse, void>({
      query: () => 'status',
    }),
  }),
  reducerPath: 'api',
});

const { reducer } = api;

export const initialState = reducer(undefined, { type: 'any' });

export const { useGetStatusQuery } = api;
