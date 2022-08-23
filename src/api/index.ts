import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import type { RootState } from '@store/index';
import { selector as selectSession } from '@session';
import type { Session } from '@session';
import { ApiResponse } from './types';

export {
  buildRequest,
  UseRequest,
} from './request';
export {
  ApiError,
  ApiFailure,
  ApiParam,
  ApiResponse,
  ApiSuccess,
  FetchFailure,
  FetchPromise,
  FetchResponse,
  FetchSuccess,
  Mutation,
  MutationStatus,
  UseMutation,
  UseMutationResponse,
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