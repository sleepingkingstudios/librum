import '@testing-library/jest-dom';
import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react';

import { useQuery } from './use-query';
import { fetchRequest } from '../fetch-request';
import type {
  HttpMethod,
  Middleware,
  MiddlewareOptions,
  PerformRequest,
  RefetchOptions,
  Response,
} from '../types';
import { withStatus } from '../utils';

jest.mock('../fetch-request');

type RenderHookOptions = {
  config?: MiddlewareOptions,
  method?: HttpMethod,
  middleware?: Middleware[],
  request?: RefetchOptions,
};

const mockRequest = fetchRequest as jest.MockedFunction<PerformRequest>;

describe('API request hooks', () => {
  describe('useQuery()', () => {
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
          const [response, refetch] = useQuery({
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
    const loadingResponse = withStatus({ status: 'loading' });
    const successResponse = withStatus({ status: 'success' });

    beforeEach(() => {
      handleResponse.mockClear();

      mockRequest.mockClear();

      mockResponse(successResponse);
    });

    it('should be a function', () => {
      expect(typeof useQuery).toBe('function');
    });

    it('should perform the request', async () => {
      renderResponse({});

      await waitFor(
        () => { expect(mockRequest).toHaveBeenCalledWith(url, {}); },
      );
    });

    it('should set the loading and success responses', async () => {
      renderResponse({});

      await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));
      expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);
      expect(handleResponse.mock.calls[1]).toEqual([loadingResponse]);
      expect(handleResponse.mock.calls[2]).toEqual([successResponse]);
    });

    describe('when the query is loading', () => {
      const loadingResponse = withStatus({ status: 'loading' });

      beforeEach(() => {
        mockRequest.mockReset();

        mockResponse(loadingResponse);
      });

      it('should not retry the request', async () => {
        const { result } = renderResponse({});

        await waitFor(() => { expect(mockRequest).toHaveBeenCalled(); });

        // Hack to ensure the request has finished.
        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));

        mockRequest.mockClear();

        act(() => result.current());

        await waitFor(() => { expect(mockRequest).not.toHaveBeenCalled(); });
      });
    });

    describe('when the query returns a failing response', () => {
      const failureResponse = withStatus({ status: 'failure' });

      beforeEach(() => {
        mockRequest.mockReset();

        mockResponse(failureResponse);
      });

      it('should perform the request', async () => {
        renderResponse({});

        await waitFor(
          () => { expect(mockRequest).toHaveBeenCalledWith(url, {}); },
        );
      });

      it('should set the loading and failure responses', async () => {
        renderResponse({});

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));
        expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);
        expect(handleResponse.mock.calls[1]).toEqual([loadingResponse]);
        expect(handleResponse.mock.calls[2]).toEqual([failureResponse]);
      });
    });

    describe('when the query is called', () => {
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
      const requestComplete = (): void => {
        const calls = handleResponse.mock.calls;
        const response: Response = (calls[calls.length - 1] as Response[])[0];
        const { status } = response;

        expect(['failure', 'success']).toContain(status);
      };

      beforeEach(() => {
        mockRequest.mockReset();

        mockResponse(failureResponse);
      });

      it('should perform the request twice', async () => {
        const { result } = renderResponse({});

        await waitFor(() => { expect(mockRequest).toHaveBeenCalled(); });

        await waitFor(requestComplete);

        mockResponse(successResponse);

        act(() => result.current());

        await waitFor(() => expect(mockRequest.mock.calls).toHaveLength(2));
      });

      it('should set the retrying and success responses', async () => {
        const { result } = renderResponse({});

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));
        expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);
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
      const requestComplete = (): void => {
        const calls = handleResponse.mock.calls;
        const response: Response = (calls[calls.length - 1] as Response[])[0];
        const { status } = response;

        expect(['failure', 'success']).toContain(status);
      };

      it('should perform the request twice', async () => {
        const { result } = renderResponse({});

        await waitFor(() => { expect(mockRequest).toHaveBeenCalled(); });

        await waitFor(requestComplete);

        mockResponse(successResponse);

        act(() => result.current(request));

        await waitFor(() => expect(mockRequest.mock.calls).toHaveLength(2));
        expect(mockRequest).toHaveBeenCalledWith(url, request);
      });
    });

    describe('when the hook is rerendered', () => {
      describe('when the params do not match', () => {
        const wildcards = { id: 'the-art-of-war' };

        it('should not retry the request', async () => {
          const { rerender } = renderResponse({});

          await waitFor(() => { expect(mockRequest).toHaveBeenCalled(); });

          // Hack to ensure the request has finished.
          await waitFor(
            () => expect(handleResponse.mock.calls).toHaveLength(3)
          );

          mockRequest.mockClear();

          mockResponse(successResponse);

          rerender({ request: { wildcards }});

          await waitFor(
            () => {
              expect(mockRequest).toHaveBeenCalledWith(url, { wildcards });
          });
        });
      });

      describe('when the params match', () => {
        it('should retry the request', async () => {
          const { rerender } = renderResponse({});

          await waitFor(() => { expect(mockRequest).toHaveBeenCalled(); });

          // Hack to ensure the request has finished.
          await waitFor(
            () => expect(handleResponse.mock.calls).toHaveLength(3)
          );

          mockRequest.mockClear();

          rerender({});

          await waitFor(() => { expect(mockRequest).not.toHaveBeenCalled(); });
        });
      });
    });

    describe('when the hook is rendered with params', () => {
      const wildcards = { id: 'on-war' };

      it('should perform the request', async () => {
        renderResponse({ request: { wildcards }});

        await waitFor(
          () => {
            expect(mockRequest).toHaveBeenCalledWith(url, { wildcards });
          },
        );
      });

      describe('when the hook is rerendered', () => {
        describe('when the params do not match', () => {
          it('should not retry the request', async () => {
            const newWildcards = { id: 'the-art-of-war' };
            const { rerender } = renderResponse({ request: { wildcards } });

            await waitFor(() => { expect(mockRequest).toHaveBeenCalled(); });

            // Hack to ensure the request has finished.
            await waitFor(
              () => expect(handleResponse.mock.calls).toHaveLength(3)
            );

            mockRequest.mockClear();

            mockResponse(successResponse);

            rerender({ request: { wildcards: newWildcards }});

            await waitFor(
              () => {
                expect(mockRequest)
                  .toHaveBeenCalledWith(url, { wildcards: newWildcards });
            });
          });
        });

        describe('when the params match', () => {
          it('should retry the request', async () => {
            const { rerender } = renderResponse({ request: { wildcards } });

            await waitFor(() => { expect(mockRequest).toHaveBeenCalled(); });

            // Hack to ensure the request has finished.
            await waitFor(
              () => expect(handleResponse.mock.calls).toHaveLength(3)
            );

            mockRequest.mockClear();

            rerender({ request: { wildcards } });

            await waitFor(
              () => { expect(mockRequest).not.toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe('with method: value', () => {
      const method = 'post';

      it('should perform the request', async () => {
        renderResponse({ method });

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
      const expectedOptions = {
        headers: { Authorization: getState('authorization') }
      };

      it('should perform the request', async () => {
        renderResponse({ config, middleware });

        await waitFor(
          () => {
            expect(mockRequest).toHaveBeenCalledWith(url, expectedOptions);
          },
        );
      });
    });
  });
});
