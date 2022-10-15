import { createApi } from '@reduxjs/toolkit/query/react';

import type { RootState } from '@store/index';
import { selector as selectSession } from '@session';
import type { Session } from '@session';
import { baseQuery } from './base-query';
import { ApiResponse } from './types';

export {
  ApiError,
  ApiFailure,
  ApiParam,
  ApiResponse,
  ApiSuccess,
  Effect,
  EffectOptions,
  Response,
  ResponseStatus,
  UseMutation,
  UseMutationRequest,
  UseMutationTrigger,
  UseQuery,
  UseQueryRequest,
} from './types';

export const api = createApi({
  baseQuery: baseQuery({
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
