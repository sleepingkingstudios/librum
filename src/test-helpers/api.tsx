import * as React from 'react';
import fetchMock from 'jest-fetch-mock';
import { Provider } from "react-redux";
import {
  Middleware,
  Reducer,
  configureStore,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import {
  act,
  renderHook,
} from "@testing-library/react-hooks";

import {
  IUser,
  actions,
  reducer as session,
} from '@session';
import type {
  ApiParam,
  ApiResponse,
} from '@store/api';

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

type MutationHookStatus = {
  data?: unknown;
  isError: true | false;
  isLoading: true | false;
  isSuccess: true | false;
}

type MutationHook = () => readonly [
  (param?: unknown) => unknown,
  MutationHookStatus,
];

type QueryHookResponse = {
  data?: unknown;
  isError: true | false;
  isFetching: true | false;
  isLoading: true | false;
  isSuccess: true | false;
};

type QueryHook = (param?: unknown) => QueryHookResponse;

type Store = ReturnType<typeof configureStore>;

interface IApiService {
  endpoints: {
    [name: string]: Endpoint;
  };
  middleware: Middleware;
  reducer: Reducer;
}

interface IDispatchRequest {
  api: IApiService;
  endpoint: string;
  param?: ApiParam;
  store?: Store;
}

interface IShouldDefineTheMutationHook {
  api: IApiService;
  data: ApiResponse;
  param?: ApiParam;
  useMutation: MutationHook;
}

interface IShouldDefineTheQueryHook {
  api: IApiService;
  data: ApiResponse;
  param?: ApiParam;
  useQuery: QueryHook;
}

interface IShouldMatchTheRequest {
  headers?: { [name: string]: string };
  method?: string;
  url: string;
}

interface IShouldPerformTheMutation {
  api: IApiService;
  data: ApiResponse;
  endpoint: string;
  param?: ApiParam;
  request: IShouldMatchTheRequest;
}

interface IShouldPerformTheQuery {
  api: IApiService;
  data: ApiResponse;
  endpoint: string;
  param?: ApiParam;
  request: IShouldMatchTheRequest;
}

const authenticatedRequest = (
  { request, token }: { request: IShouldMatchTheRequest, token: string }
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

const createApiStore = ({ api }: { api: IApiService }): Store => {
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
  }: IDispatchRequest
) => {
  let configuredStore = store;

  if (!store) { configuredStore = createApiStore({ api }); }

  const dispatch: Dispatch = configuredStore.dispatch;

  const { endpoints } = api;
  const query = endpoints[endpoint];

  return await dispatch(query.initiate(param)) as Response;
};

const shouldMatchTheRequest = (
  { method = 'GET', headers = {}, url }: IShouldMatchTheRequest
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

const wrapperFor = ({ api }: { api: IApiService }) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const store = createApiStore({ api });

    return (
      <Provider store={store}>{ children }</Provider>
    );
  };

  return Wrapper;
};

// eslint-disable-next-line jest/no-export
export const shouldPerformTheMutation = (
  {
    api,
    data,
    endpoint,
    param,
    request,
  }: IShouldPerformTheMutation
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
      const user: IUser = {
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
  }: IShouldPerformTheQuery
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
      const user: IUser = {
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

// eslint-disable-next-line jest/no-export
export const shouldDefineTheMutationHook = (
  {
    api,
    data,
    param,
    useMutation,
  }: IShouldDefineTheMutationHook
) => {
  describe('should define the mutation hook', () => {
    describe('with a successful response', () => {
      it('should return the data', async () => {
        fetchMock.doMock();
        fetchMock.mockResponse(JSON.stringify(data));

        const {
          result,
          waitForNextUpdate,
        } = renderHook(
          () => useMutation(),
          { wrapper: wrapperFor({ api }) },
        );
        const updateTimeout = 5000;
        const [performMutation, initialResponse] = result.current;

        expect(initialResponse.data).toBeUndefined();
        expect(initialResponse.isLoading).toBe(false);

        act(() => { void performMutation(param); });

        const loadingResponse = result.current[1];
        expect(loadingResponse.data).toBeUndefined();
        expect(loadingResponse.isLoading).toBe(true);

        await waitForNextUpdate({ timeout: updateTimeout });

        const loadedResponse = result.current[1];
        expect(loadedResponse.data).toEqual(data);
        expect(loadedResponse.isLoading).toBe(false);
        expect(loadedResponse.isSuccess).toBe(true);
      });
    });

    describe('with a failing response', () => {
      it('should set the status', async () => {
        fetchMock.doMock();
        fetchMock.mockReject(new Error('Internal Server Error'));

        const {
          result,
          waitForNextUpdate,
        } = renderHook(
          () => useMutation(),
          { wrapper: wrapperFor({ api }) },
        );
        const updateTimeout = 5000;
        const [performMutation, initialResponse] = result.current;

        expect(initialResponse.data).toBeUndefined();
        expect(initialResponse.isLoading).toBe(false);

        act(() => { void performMutation(param); });

        const loadingResponse = result.current[1];
        expect(loadingResponse.data).toBeUndefined();
        expect(loadingResponse.isLoading).toBe(true);

        await waitForNextUpdate({ timeout: updateTimeout });

        const loadedResponse = result.current[1];
        expect(loadedResponse.data).toBeUndefined();
        expect(loadedResponse.isLoading).toBe(false);
        expect(loadedResponse.isError).toBe(true);
      });
    });
  });
};

// eslint-disable-next-line jest/no-export
export const shouldDefineTheQueryHook = (
  {
    api,
    data,
    param,
    useQuery,
  }: IShouldDefineTheQueryHook
) => {
  describe('should define the query hook', () => {
    describe('with a successful response', () => {
      it('should return the data', async () => {
        fetchMock.doMock();
        fetchMock.mockResponse(JSON.stringify(data));

        const {
          result,
          waitForNextUpdate,
        } = renderHook(
          () => useQuery(param),
          { wrapper: wrapperFor({ api }) },
        );
        const updateTimeout = 5000;
        const initialResponse = result.current;

        expect(initialResponse.data).toBeUndefined();
        expect(initialResponse.isLoading).toBe(true);

        await waitForNextUpdate({ timeout: updateTimeout });
        const nextResponse = result.current;

        expect(nextResponse.data).toBeDefined();
        expect(nextResponse.isLoading).toBe(false);
        expect(nextResponse.isSuccess).toBe(true);
      });
    });

    describe('with a failing response', () => {
      it('should set the status', async () => {
        fetchMock.doMock();
        fetchMock.mockReject(new Error('Internal Server Error'));

        const {
          result,
          waitForNextUpdate,
        } = renderHook(
          () => useQuery(param),
          { wrapper: wrapperFor({ api }) },
        );
        const updateTimeout = 5000;
        const initialResponse = result.current;

        expect(initialResponse.data).toBeUndefined();
        expect(initialResponse.isLoading).toBe(true);

        await waitForNextUpdate({ timeout: updateTimeout });
        const nextResponse = result.current;

        expect(nextResponse.data).toBeUndefined();
        expect(nextResponse.isLoading).toBe(false);
        expect(nextResponse.isError).toBe(true);
      });
    });
  });
};
