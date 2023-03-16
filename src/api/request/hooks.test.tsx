import * as React from 'react';

import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useRequest } from './hooks';
import { render } from '@test-helpers/rendering';
import { fetchRequest } from './fetch-request';
import type {
  PerformRequest,
  RefetchOptions,
  RequestOptions,
  Response,
} from './types';
import {
  withData,
  withStatus,
} from './utils';

jest.mock('./fetch-request');

const mockRequest = fetchRequest as jest.MockedFunction<PerformRequest>;

const RequestWrapper = ({
  handleResponse,
  options = {},
  request = {},
  url,
}: {
  handleResponse: (response: Response) => void,
  options?: RequestOptions,
  request?: RefetchOptions,
  url: string,
}): JSX.Element => {
  const [response, performRequest] = useRequest({ options, url });
  const onClick = () => performRequest(request);

  handleResponse(response);

  return (
    <div>
      <button onClick={onClick}>Refetch</button>
    </div>
  );
};

describe('API request hooks', () => {
  describe('useRequest()', () => {
    const url = 'www.example.com';
    const handleResponse = jest.fn();
    const mockResponse = (response: Response) => {
      mockRequest.mockImplementationOnce(
        () => new Promise(resolve => resolve(response))
      );
    };
    const renderHook = ({
      options = {},
      request = {},
    }: {
      options?: RequestOptions,
      request?: RefetchOptions,
    }) => render(
      <RequestWrapper
        handleResponse={handleResponse}
        options={options}
        request={request}
        url={url}
      />,
      {},
      false,
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
      renderHook({});

      expect(mockRequest).not.toHaveBeenCalled();
    });

    it('should set the uninitialized response', () => {
      renderHook({});

      expect(handleResponse.mock.calls).toHaveLength(1);
      expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);
    });

    describe('when the query returns a failing response', () => {
      const loadingResponse = withStatus({ status: 'loading' });
      const failureResponse = withStatus({ status: 'failure' });

      beforeEach(() => { mockResponse(failureResponse); });

      it('should perform the request', async () => {
        const { getByRole } = renderHook({});
        const button = getByRole('button');

        await userEvent.click(button);

        expect(mockRequest).toHaveBeenCalledWith(url, {});
      });

      it('should set the loading and failure responses', async () => {
        const { getByRole } = renderHook({});
        const button = getByRole('button');

        expect(handleResponse.mock.calls).toHaveLength(1);
        expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);

        await userEvent.click(button);

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
        const { getByRole } = renderHook({});
        const button = getByRole('button');

        await userEvent.click(button);

        expect(mockRequest).toHaveBeenCalled();
      });

      it('should set the loading and success responses', async () => {
        const { getByRole } = renderHook({});
        const button = getByRole('button');

        expect(handleResponse.mock.calls).toHaveLength(1);
        expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);

        await userEvent.click(button);

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));
        expect(handleResponse.mock.calls[1]).toEqual([loadingResponse]);
        expect(handleResponse.mock.calls[2]).toEqual([successResponse]);
      });
    });

    describe('when the query is loading', () => {
      const loadingResponse = withStatus({ status: 'loading' });

      beforeEach(() => { mockResponse(loadingResponse); });

      it('should not perform the request', async () => {
        const { getByRole } = renderHook({});
        const button = getByRole('button');

        await userEvent.click(button);

        mockRequest.mockClear();

        await userEvent.click(button);

        expect(mockRequest).not.toHaveBeenCalled();
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

      beforeEach(() => { mockResponse(failureResponse); });

      it('should perform the request twice', async () => {
        const { getByRole } = renderHook({});
        const button = getByRole('button');

        await userEvent.click(button);

        expect(mockRequest).toHaveBeenCalled();

        mockResponse(successResponse);

        await userEvent.click(button);

        await waitFor(() => expect(mockRequest.mock.calls).toHaveLength(2));
      });

      it('should set the retrying and success responses', async () => {
        const { getByRole } = renderHook({});
        const button = getByRole('button');

        expect(handleResponse.mock.calls).toHaveLength(1);
        expect(handleResponse.mock.calls[0]).toEqual([uninitializedResponse]);

        await userEvent.click(button);

        await waitFor(() => expect(handleResponse.mock.calls).toHaveLength(3));
        expect(handleResponse.mock.calls[1]).toEqual([loadingResponse]);
        expect(handleResponse.mock.calls[2]).toEqual([failureResponse]);

        mockResponse(successResponse);

        await userEvent.click(button);

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
        const { getByRole } = renderHook({ request });
        const button = getByRole('button');

        await userEvent.click(button);

        expect(mockRequest).toHaveBeenCalledWith(url, request);
      });
    });

    describe('with query options', () => {
      const options = {
        headers: { 'X-Custom-Header': 'value' },
        params: { order: 'desc' },
      };

      const response = withStatus({ status: 'success' });

      beforeEach(() => { mockResponse(response); });

      it('should perform the request', async () => {
        const { getByRole } = renderHook({ options });
        const button = getByRole('button');

        await userEvent.click(button);

        expect(mockRequest).toHaveBeenCalledWith(url, options);
      });

      describe('when the query is called with options', () => {
        const request = {
          body: JSON.stringify({ ok: true }),
          params: { order: 'asc' },
        };
        const expected = {
          ...options,
          ...request,
        };
        const response = withStatus({ status: 'success' });

        beforeEach(() => { mockResponse(response); });

        it('should perform the request', async () => {
          const { getByRole } = renderHook({ options, request });
          const button = getByRole('button');

          await userEvent.click(button);

          expect(mockRequest).toHaveBeenCalledWith(url, expected);
        });
      });
    });
  });
});
