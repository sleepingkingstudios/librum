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
  render,
  waitFor,
} from '@testing-library/react';
import {
  renderHook,
} from "@testing-library/react-hooks";

import {
  IUser,
  actions,
  reducer as session,
} from '@session';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dispatch = (arg: any) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Endpoint = { initiate: (param: any) => any };

type GetDefaultMiddleware = () => Middleware[];

type Response = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: {
    error: string;
  },
  status: 'fulfilled' | 'rejected';
}

type QueryHookResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  isError: true | false;
  isFetching: true | false;
  isLoading: true | false;
  isSuccess: true | false;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryHook = (param?: any) => QueryHookResponse;

type Store = ReturnType<typeof configureStore>;

interface IApiService {
  endpoints: {
    [name: string]: Endpoint;
  };
  middleware: Middleware;
  reducer: Reducer;
}

interface IDispatchQuery {
  api: IApiService;
  endpoint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  param?: any;
  store?: Store;
}

interface IShouldDefineTheQueryHook {
  api: IApiService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  param?: any;
  request: IShouldMatchTheRequest;
  useQuery: QueryHook;
}

interface IShouldMatchTheRequest {
  headers?: { [name: string]: string };
  method?: string;
  url: string;
}

interface IShouldPerformTheQuery {
  api: IApiService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  endpoint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  param?: any;
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

const dispatchQuery = async (
  {
    api,
    endpoint,
    param,
    store,
  }: IDispatchQuery
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
}

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await dispatchQuery({ api, endpoint, param });

      shouldMatchTheRequest(request);
    });

    describe('with a successful response', () => {
      it('should fulfill the request', async () => {
        fetchMock.once(JSON.stringify(data));

        const response = await dispatchQuery({ api, endpoint });
        const { status } = response;

        expect(response.data).toEqual(data);
        expect(status).toBe('fulfilled');
      });
    });

    describe('with a failing response', () => {
      it('should reject the request', async () => {
        fetchMock.mockRejectOnce(new Error('Something went wrong'));

        const response = await dispatchQuery({ api, endpoint });
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

        await dispatchQuery({
          api,
          endpoint,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          param,
          store,
        });

        shouldMatchTheRequest(authenticatedRequest({ request, token }));
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
    request,
    useQuery,
  }: IShouldDefineTheQueryHook
) => {
  const Component = (): JSX.Element => {
    const { isFetching } = useQuery(param);

    if (isFetching) { return(<React.Fragment>Fetching...</React.Fragment>); }

    return (<React.Fragment>Done!</React.Fragment>);
  };

  const Wrapper = (
    { children, store }: { children: React.ReactNode, store?: Store }
  ): JSX.Element => {
    let configuredStore = store;

    if (!store) { configuredStore = createApiStore({ api }); }

    return (
      <Provider store={configuredStore}>{ children }</Provider>
    );
  };

  describe('should define the query hook', () => {
    it('should query the data', async () => {
      fetchMock.doMock();

      const { queryByText } = render(<Component />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(queryByText('Fetching...')).toBeNull();
      });

      expect(fetchMock).toHaveBeenCalled();

      shouldMatchTheRequest(request);
    });

    describe('with a successful response', () => {
      it('should return the data', async () => {
        fetchMock.doMock();
        fetchMock.mockResponse(JSON.stringify(data));

        const {
          result,
          waitForNextUpdate,
        } = renderHook(
          () => useQuery(param),
          { wrapper: Wrapper },
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
          { wrapper: Wrapper },
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

      it('should query the data', async () => {
        const store = createApiStore({ api });
        const dispatch: Dispatch = store.dispatch;
        const action = create({ token, user });

        dispatch(action);

        const WrapperWithStore = (
          { children }: { children: React.ReactNode }
        ) => (
          <Wrapper store={store}>{ children }</Wrapper>
        );
        const { queryByText } = render(
          <Component />,
          { wrapper: WrapperWithStore }
        );

        await waitFor(() => {
          expect(queryByText('Fetching...')).toBeNull();
        });

        expect(fetchMock).toHaveBeenCalled();

        shouldMatchTheRequest(authenticatedRequest({ request, token }));
      });
    });
  });
};
