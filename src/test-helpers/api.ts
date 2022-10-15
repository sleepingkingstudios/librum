import fetchMock from 'jest-fetch-mock';
import {
  Middleware,
  Reducer,
  configureStore,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import {
  actions,
  reducer as session,
} from '@session';
import type { User } from '@session';
import type {
  ApiParam,
  ApiResponse,
} from '@api';

type Dispatch = (arg: unknown) => unknown;

type Endpoint = { initiate: (param: unknown) => unknown };

type GetDefaultMiddleware = () => Middleware[];

type Response = {
  data?: unknown;
  error?: {
    error: string;
  },
  status: 'fulfilled' | 'rejected';
}

type Store = ReturnType<typeof configureStore>;

interface ApiService {
  endpoints: {
    [name: string]: Endpoint;
  };
  middleware: Middleware;
  reducer: Reducer;
}

interface DispatchRequest {
  api: ApiService;
  endpoint: string;
  param?: ApiParam;
  store?: Store;
}

interface ShouldMatchTheRequest {
  headers?: { [name: string]: string };
  method?: string;
  url: string;
}

interface ShouldPerformTheMutation {
  api: ApiService;
  data: ApiResponse;
  endpoint: string;
  param?: ApiParam;
  request: ShouldMatchTheRequest;
}

interface ShouldPerformTheQuery {
  api: ApiService;
  data: ApiResponse;
  endpoint: string;
  param?: ApiParam;
  request: ShouldMatchTheRequest;
}

const authenticatedRequest = (
  { request, token }: { request: ShouldMatchTheRequest, token: string }
) => {
  const { headers, method, url } = request;
  const authenticatedHeaders = {
    ...headers,
    'Authorization': `Bearer ${token}`,
  };

  return {
    headers: authenticatedHeaders,
    method,
    url,
  };
}

const createApiStore = ({ api }: { api: ApiService }): Store => {
  const middleware = (
    getDefaultMiddleware: GetDefaultMiddleware,
  ) => getDefaultMiddleware().concat(api.middleware);
  const reducer = {
    api: api.reducer,
    session,
  };
  const store = configureStore({
    middleware,
    reducer,
  });

  setupListeners(store.dispatch);

  return store;
};

const dispatchRequest = async (
  {
    api,
    endpoint,
    param,
    store,
  }: DispatchRequest
) => {
  let configuredStore = store;

  if (!store) { configuredStore = createApiStore({ api }); }

  const dispatch: Dispatch = configuredStore.dispatch;

  const { endpoints } = api;
  const query = endpoints[endpoint];

  return await dispatch(query.initiate(param)) as Response;
};

const shouldMatchTheRequest = (
  { method = 'GET', headers = {}, url }: ShouldMatchTheRequest
) => {
  const request = fetchMock.mock.calls[0][0];

  if (typeof request === 'string') { throw(`Request??? ${request}`); }

  expect(request.method).toBe(method.toUpperCase());
  expect(request.url).toBe(url);

  expect(request.headers.get('Accept')).toBe('application/json');

  Object.entries(headers).forEach(([header, value]) => {
    expect(request.headers.get(header)).toBe(value);
  });
};

// eslint-disable-next-line jest/no-export
export const shouldPerformTheMutation = (
  {
    api,
    data,
    endpoint,
    param,
    request,
  }: ShouldPerformTheMutation
) => {
  describe('should perform the mutation', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should update the data', async () => {
      await dispatchRequest({ api, endpoint, param });

      shouldMatchTheRequest(request);
    });

    describe('with a successful response', () => {
      it('should fulfill the request', async () => {
        fetchMock.once(JSON.stringify(data));

        const response = await dispatchRequest({ api, endpoint });

        expect(response.data).toEqual(data);
      });
    });

    describe('with a failing response', () => {
      it('should reject the request', async () => {
        fetchMock.mockRejectOnce(new Error('Something went wrong'));

        const response = await dispatchRequest({ api, endpoint });

        expect(response.error.error).toBe('Error: Something went wrong');
      });
    });

    describe('when the user is authenticated', () => {
      const { create } = actions;
      const user: User = {
        email: 'alan.bradley@example.com',
        id: '00000000-0000-0000-0000-000000000000',
        role: 'user',
        slug: 'alan-bradley',
        username: 'Alan Bradley',
      };
      const token = '12345';

      // eslint-disable-next-line jest/expect-expect
      it('should update the data', async () => {
        const store = createApiStore({ api });
        const dispatch: Dispatch = store.dispatch;
        const action = create({ token, user });

        dispatch(action);

        await dispatchRequest({
          api,
          endpoint,
          param,
          store,
        });

        shouldMatchTheRequest(authenticatedRequest({ request, token }));
      });
    });
  });
};

// eslint-disable-next-line jest/no-export
export const shouldPerformTheQuery = (
  {
    api,
    data,
    endpoint,
    param,
    request,
  }: ShouldPerformTheQuery
) => {
  describe('should perform the query', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should query the data', async () => {
      await dispatchRequest({ api, endpoint, param });

      shouldMatchTheRequest(request);
    });

    describe('with a successful response', () => {
      it('should fulfill the request', async () => {
        fetchMock.once(JSON.stringify(data));

        const response = await dispatchRequest({ api, endpoint });
        const { status } = response;

        expect(response.data).toEqual(data);
        expect(status).toBe('fulfilled');
      });
    });

    describe('with a failing response', () => {
      it('should reject the request', async () => {
        fetchMock.mockRejectOnce(new Error('Something went wrong'));

        const response = await dispatchRequest({ api, endpoint });
        const { error: { error }, status } = response;

        expect(error).toBe('Error: Something went wrong');
        expect(status).toBe('rejected');
      });
    });

    describe('when the user is authenticated', () => {
      const { create } = actions;
      const user: User = {
        email: 'alan.bradley@example.com',
        id: '00000000-0000-0000-0000-000000000000',
        role: 'user',
        slug: 'alan-bradley',
        username: 'Alan Bradley',
      };
      const token = '12345';

      // eslint-disable-next-line jest/expect-expect
      it('should query the data', async () => {
        const store = createApiStore({ api });
        const dispatch: Dispatch = store.dispatch;
        const action = create({ token, user });

        dispatch(action);

        await dispatchRequest({
          api,
          endpoint,
          param,
          store,
        });

        shouldMatchTheRequest(authenticatedRequest({ request, token }));
      });
    });
  });
};
