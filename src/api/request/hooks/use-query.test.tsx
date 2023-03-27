import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useQuery } from './use-query';
import type {
  HttpMethod,
  UseQueryOptions,
  UseRequest,
  UseRequestOptions,
} from '../types';
import { useRequest } from './use-request';
import { withStatus } from '../utils';

jest.mock('./use-request');

const mockUseRequest = useRequest as jest.MockedFunction<UseRequest>;

describe('API request hooks', () => {
  describe('useQuery()', () => {
    const url = 'www.example.com';
    const uninitializedResponse = withStatus({ status: 'uninitialized' });
    const successResponse = withStatus({ status: 'success' });
    const performRequest = jest.fn();
    const defaultOptions: UseRequestOptions = {
      config: {},
      method: 'get',
      middleware: [],
      url,
    };
    const options = { url };

    beforeEach(() => {
      mockUseRequest.mockClear();
      mockUseRequest.mockImplementationOnce(() => [
        uninitializedResponse,
        performRequest,
      ]);

      performRequest.mockClear();
      performRequest.mockImplementation(() => (
        new Promise(resolve => resolve(successResponse))
      ));
    });

    it('should be a function', () => {
      expect(typeof useQuery).toBe('function');
    });

    it('should wrap useRequest', () => {
      renderHook(() => useQuery(options));

      expect(mockUseRequest).toHaveBeenCalledWith(defaultOptions);
    });

    it('should return the response', () => {
      const { result } = renderHook(() => useQuery(options));

      const [response] = result.current;

      expect(response).toEqual(uninitializedResponse);
    });

    it('should call performRequest', () => {
      renderHook(() => useQuery(options));

      expect(performRequest).toHaveBeenCalledWith({});
    });

    describe('when the hook is rerendered', () => {
      describe('when the request params are not equal', () => {
        const request = { params: { order: 'asc' } };

        it('should call performRequest', () => {
          const { rerender } = renderHook(
            (opts: UseQueryOptions) => useQuery(opts),
            { initialProps: options },
          );

          expect(performRequest.mock.calls).toHaveLength(1);
          expect(performRequest).toHaveBeenCalledWith({});

          mockUseRequest.mockImplementationOnce(() => [
            successResponse,
            performRequest,
          ]);

          rerender({ ...options, ...request });

          expect(performRequest.mock.calls).toHaveLength(2);
          expect(performRequest).toHaveBeenCalledWith(request);
        });
      });

      describe('when the request params are equal', () => {
        it('should not call performRequest', () => {
          const { rerender } = renderHook(
            (opts: UseQueryOptions) => useQuery(opts),
            { initialProps: options },
          );

          expect(performRequest.mock.calls).toHaveLength(1);

          rerender({ ...options });

          expect(performRequest.mock.calls).toHaveLength(1);
        });
      });
    });

    describe('with options: value', () => {
      const options = {
        method: 'post' as HttpMethod,
        url,
      };
      const expectedOptions: UseRequestOptions = {
        config: {},
        method: 'post',
        middleware: [],
        url,
      };

      it('should wrap useRequest', () => {
        renderHook(() => useQuery(options));

        expect(mockUseRequest).toHaveBeenCalledWith(expectedOptions);
      });

      it('should call performRequest', () => {
        renderHook(() => useQuery(options));

        expect(performRequest).toHaveBeenCalledWith({});
      });
    });

    describe('with request: value', () => {
      const request = { body: { ok: true }, params: { order: 'desc' } };

      it('should wrap useRequest', () => {
        renderHook(() => useQuery({ ...options, ...request }));

        expect(mockUseRequest).toHaveBeenCalledWith(defaultOptions);
      });

      it('should call performRequest', () => {
        renderHook(() => useQuery({ ...options, ...request }));

        expect(performRequest).toHaveBeenCalledWith(request);
      });

      describe('when the hook is rerendered', () => {
        describe('when the request params are not equal', () => {
          const otherRequest = {
            body: { ok: true },
            params: { order: 'asc' },
          };

          it('should call performRequest', () => {
            const { rerender } = renderHook(
              (opts: UseQueryOptions) => useQuery(opts),
              { initialProps: { ...options, ...request } },
            );

            expect(performRequest.mock.calls).toHaveLength(1);
            expect(performRequest).toHaveBeenCalledWith(request);

            mockUseRequest.mockImplementationOnce(() => [
              successResponse,
              performRequest,
            ]);

            rerender({ ...options, ...otherRequest });

            expect(performRequest.mock.calls).toHaveLength(2);
            expect(performRequest).toHaveBeenCalledWith(otherRequest);
          });
        });

        describe('when the request params are equal', () => {
          it('should not call performRequest', () => {
            const { rerender } = renderHook(
              (opts: UseQueryOptions) => useQuery(opts),
              { initialProps: { ...options, ...request } },
            );

            expect(performRequest.mock.calls).toHaveLength(1);

            mockUseRequest.mockImplementationOnce(() => [
              successResponse,
              performRequest,
            ]);

            rerender({ ...options, ...request });

            expect(performRequest.mock.calls).toHaveLength(1);
          });
        });
      });
    });
  });
});
