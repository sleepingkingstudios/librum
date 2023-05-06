import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import {
  responseWithError,
  responseWithStatus,
} from '@api';
import type {
  ApiError,
  HttpMethod,
} from '@api';
import { notFoundError } from '@api/errors';

import { handleNotFoundMiddleware } from './handle-not-found';

describe('Resources API hooks', () => {
  describe('handleNotFoundMiddleware()', () => {
    const action = 'publish';
    const member = true;
    const resourceName = 'rareBooks';
    const middleware =
      handleNotFoundMiddleware({ action, member, resourceName });
    const performRequest = jest.fn();
    const displayAlert = jest.fn();
    const navigate = jest.fn();
    const config = { alerts: { displayAlert }, navigate };
    const applied = middleware(performRequest, config);
    const response = responseWithStatus({ status: 'uninitialized' });
    const url = 'www.example.com';
    const options = { method: 'put' as HttpMethod };

    beforeEach(() => {
      displayAlert.mockClear();

      navigate.mockClear();

      performRequest
        .mockImplementation(() => {
          return new Promise((resolve) => resolve(response));
        })
        .mockClear();
    });

    it('should be a function', () => {
      expect(typeof handleNotFoundMiddleware).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof middleware).toBe('function');
    });

    it('should return a function that returns a function', () => {
      expect(typeof applied).toBe('function');
    });

    it('should perform the request', async () => {
      await applied(url, options);

      expect(performRequest).toHaveBeenCalledWith(url, options);
    });

    it('should return the response', async () => {
      expect(await applied(url, options)).toEqual(response);
    });

    it('should not display an alert', async () => {
      await applied(url, options);

      expect(displayAlert).not.toHaveBeenCalled();
    });

    it('should not navigate the page', async () => {
      await applied(url, options);

      expect(navigate).not.toHaveBeenCalled();
    });

    describe('with a failing response', () => {
      const response = responseWithStatus({ status: 'failure' });

      beforeEach(() => {
        performRequest.mockImplementation(() => {
          return new Promise((resolve) => resolve(response));
        });
      });

      it('should return the response', async () => {
        expect(await applied(url, options)).toEqual(response);
      });

      it('should not display an alert', async () => {
        await applied(url, options);

        expect(displayAlert).not.toHaveBeenCalled();
      });

      it('should not navigate the page', async () => {
        await applied(url, options);

        expect(navigate).not.toHaveBeenCalled();
      });
    });

    describe('with a failing response with an error', () => {
      const error: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: 'test.customError',
      };
      const response = responseWithError({ error });

      beforeEach(() => {
        performRequest.mockImplementation(() => {
          return new Promise((resolve) => resolve(response));
        });
      });

      it('should return the response', async () => {
        expect(await applied(url, options)).toEqual(response);
      });

      it('should not display an alert', async () => {
        await applied(url, options);

        expect(displayAlert).not.toHaveBeenCalled();
      });

      it('should not navigate the page', async () => {
        await applied(url, options);

        expect(navigate).not.toHaveBeenCalled();
      });
    });

    describe('with a failing response with a Not Found error', () => {
      const error: ApiError = {
        data: {
          attributeValue: 'gideon-9',
        },
        message: 'Something went wrong',
        type: notFoundError,
      };
      const response = responseWithError({ error });

      beforeEach(() => {
        performRequest.mockImplementation(() => {
          return new Promise((resolve) => resolve(response));
        });
      });

      it('should return the response', async () => {
        expect(await applied(url, options)).toEqual(response);
      });

      it('should display an alert', async () => {
        const expected = {
          context: 'resources:rareBooks:publish:request',
          icon: faMagnifyingGlass,
          message: 'Rare Book not found with slug "gideon-9"',
          type: 'failure',
        };

        await applied(url, options);

        expect(displayAlert).toHaveBeenCalledWith(expected);
      });

      it('should navigate to the collection page', async () => {
        await applied(url, options);

        expect(navigate).toHaveBeenCalledWith('/rare-books');
      });
    });
  });
});
