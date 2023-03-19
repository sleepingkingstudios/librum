import '@testing-library/jest-dom';
import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react';

import { useRequest } from './use-request';
import { fetchRequest } from '../fetch-request';
import type {
  HttpMethod,
  Middleware,
  MiddlewareOptions,
  PerformRequest,
  RefetchOptions,
  Response,
} from '../types';
import {
  withData,
  withStatus,
} from '../utils';

jest.mock('../fetch-request');

type RenderHookOptions = {
  config?: MiddlewareOptions,
  method?: HttpMethod,
  middleware?: Middleware[],
  request?: RefetchOptions,
};

const mockRequest = fetchRequest as jest.MockedFunction<PerformRequest>;

describe('API request hooks', () => {
  describe('useRequest()', () => {
    const url = 'www.example.com';
    const handleResponse = jest.fn();
    const mockResponse = (response: Response) => {
      mockRequest.mockImplementationOnce(
        () => new Promise(resolve => resolve(response))
      );
    };
    const renderResponse = (initialOptions: RenderHookOptions) => (
      renderHook(
        ({
          config = {},
          method,
          middleware = [],
          request = {},
        }: RenderHookOptions) => {
          const [response, refetch] = useRequest({
            config,
            method,
            middleware,
            url,
            ...request,
          });

          handleResponse(response);

          return refetch;
        },
        { initialProps: initialOptions },
      )
    );
    const uninitializedResponse = withStatus({ status: 'uninitialized' });

    beforeEach(() => {
      handleResponse.mockClear();

      mockRequest.mockClear();
    });

    it('should be a function', () => {
      expect(typeof useRequest).toBe('function');
    });

    it('should not perform the request', () => {
      renderResponse({});

      expect(mockRequest).not.toHaveBeenCalled();
    });

    it('should set the uninitialized response', () => {
      renderResponse({});

      expect(handleResponse.mock.calls).toHaveLength(1);
      expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);
    });

    describe('when the query returns a failing response', () => {
      const loadingResponse = withStatus({ status: 'loading' });
      const failureResponse = withStatus({ status: 'failure' });

      beforeEach(() => { mockResponse(failureResponse); });

      it('should perform the request', async () => {
        const { result } = renderResponse({});

        act(() => result.current());

        await waitFor(
          () => { expect(mockRequest).toHaveBeenCalledWith(url, {}); },
        );
      });

      it('should set the loading and failure responses', async () => {
        const { result } = renderResponse({});

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(1));
        expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);

        act(() => result.current());

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));
        expect(handleResponse.mock.calls[1]).toEqual([loadingResponse]);
        expect(handleResponse.mock.calls[2]).toEqual([failureResponse]);
      });
    });

    describe('when the query returns a successful response', () => {
      const loadingResponse = withStatus({ status: 'loading' });
      const successResponse = withStatus({ status: 'success' });

      beforeEach(() => { mockResponse(successResponse); });

      it('should perform the request', async () => {
        const { result } = renderResponse({});

        act(() => result.current());

        await waitFor(
          () => { expect(mockRequest).toHaveBeenCalledWith(url, {}); },
        );
      });

      it('should set the loading and success responses', async () => {
        const { result } = renderResponse({});

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(1));
        expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);

        act(() => result.current());

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));
        expect(handleResponse.mock.calls[1]).toEqual([loadingResponse]);
        expect(handleResponse.mock.calls[2]).toEqual([successResponse]);
      });
    });

    describe('when the query is loading', () => {
      const loadingResponse = withStatus({ status: 'loading' });

      beforeEach(() => { mockResponse(loadingResponse); });

      it('should not perform the request', async () => {
        const { result } = renderResponse({});

        act(() => result.current());

        await waitFor(() => { expect(mockRequest).toHaveBeenCalled(); });

        // Hack to ensure the request has finished.
        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));

        mockRequest.mockClear();

        act(() => result.current());

        await waitFor(() => { expect(mockRequest).not.toHaveBeenCalled(); });
      });
    });

    describe('when the query is retried', () => {
      const loadingResponse = withStatus({ status: 'loading' });
      const failureResponse: Response = {
        ...withStatus({ status: 'failure', }),
        hasData: true,
        hasError: true,
        data: { ok: false },
        error: 'Something went wrong',
      };
      const retryingResponse = withStatus({
        response: failureResponse,
        status: 'loading',
      });
      const successResponse = withData({
        data: { ok: true },
        response: withStatus({ status: 'success' }),
      });
      const requestComplete = (): void => {
        const calls = handleResponse.mock.calls;
        const response: Response = (calls[calls.length - 1] as Response[])[0];
        const { status } = response;

        expect(['failure', 'success']).toContain(status);
      };

      beforeEach(() => { mockResponse(failureResponse); });

      it('should perform the request twice', async () => {
        const { result } = renderResponse({});

        act(() => result.current());

        await waitFor(() => { expect(mockRequest).toHaveBeenCalled(); });

        await waitFor(requestComplete);

        mockResponse(successResponse);

        act(() => result.current());

        await waitFor(() => expect(mockRequest.mock.calls).toHaveLength(2));
      });

      it('should set the retrying and success responses', async () => {
        const { result } = renderResponse({});

        expect(handleResponse.mock.calls).toHaveLength(1);
        expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);

        act(() => result.current());

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));
        expect(handleResponse.mock.calls[1]).toEqual([loadingResponse]);
        expect(handleResponse.mock.calls[2]).toEqual([failureResponse]);

        mockResponse(successResponse);

        act(() => result.current());

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(5));
        expect(handleResponse.mock.calls[3]).toEqual([retryingResponse]);
        expect(handleResponse.mock.calls[4]).toEqual([successResponse]);
      });
    });

    describe('when the query is called with options', () => {
      const request = {
        body: JSON.stringify({ ok: true }),
        params: { order: 'asc' },
      };
      const response = withStatus({ status: 'success' });

      beforeEach(() => { mockResponse(response); });

      it('should perform the request', async () => {
        const { result } = renderResponse({});

        act(() => result.current(request));

        await waitFor(
          () => { expect(mockRequest).toHaveBeenCalledWith(url, request); },
        );
      });
    });

    describe('with method: value', () => {
      const method = 'post';
      const response = withStatus({ status: 'success' });

      beforeEach(() => { mockResponse(response); });

      it('should perform the request', async () => {
        const { result } = renderResponse({ method });

        act(() => result.current());

        await waitFor(
          () => { expect(mockRequest).toHaveBeenCalledWith(url, { method }); },
        );
      });
    });

    describe('with middleware: value', () => {
      const authorizationMiddleware: Middleware = (fn, config) => {
        const getState = config.getState as (key: string) => string;
        const authorization = getState('authorization');

        return (url, options) => {
          const headers = {
            ...(options.headers || {}),
            Authorization: authorization,
          };

          return fn(url, { ...options, headers });
        };
      };
      const getState = (key: string): string => {
        if (key === 'authorization') { return 'Bearer 12345'; }

        return null;
      };
      const config: MiddlewareOptions = { getState };
      const middleware: Middleware[] = [authorizationMiddleware];
      const response = withStatus({ status: 'success' });
      const expectedOptions = {
        headers: { Authorization: getState('authorization') }
      };

      beforeEach(() => { mockResponse(response); });

      it('should perform the request', async () => {
        const { result } = renderResponse({ config, middleware });

        act(() => result.current());

        await waitFor(
          () => {
            expect(mockRequest).toHaveBeenCalledWith(url, expectedOptions);
          },
        );
      });

      describe('when the query is called with options', () => {
        const request = {
          body: JSON.stringify({ ok: true }),
          params: { order: 'asc' },
        };
        const expectedOptions = {
          headers: { Authorization: getState('authorization') },
          ...request,
        };

        it('should perform the request', async () => {
          const { result } = renderResponse({ config, middleware });

          act(() => result.current(request));

          await waitFor(
            () => {
              expect(mockRequest).toHaveBeenCalledWith(url, expectedOptions);
            },
          );
        });
      });
    });
  });
});
