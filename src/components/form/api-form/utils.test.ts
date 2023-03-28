import {
  handleSubmit,
  mapStatus,
} from './utils';
import { invalidParametersError } from '@api/errors';
import type {
  Refetch,
  Response,
} from '@api/request';
import {
  withError,
  withStatus,
} from '@api/request/utils';
import type {
  FormErrors,
  FormStatus,
  InvalidParametersError,
} from '../types';

describe('<ApiForm /> utils', () => {
  describe('handleSubmit()', () => {
    const refetch: jest.MockedFunction<Refetch> = jest.fn(
      () => new Promise(resolve => resolve(withStatus({ status: 'success' })))
    );
    const setStatus = jest.fn();
    const options = { setStatus };
    const values = { user: { name: 'Alan Bradley' } };
    const handler = handleSubmit(refetch);

    beforeEach(() => {
      refetch.mockClear();

      setStatus.mockClear();
    });

    it('should be a function', () => {
      expect(typeof handleSubmit).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof handler).toBe('function');
    });

    it('should perform the request', async () => {
      await handler(values, options);

      expect(refetch).toHaveBeenCalledWith({ body: values });
    });

    describe('when the request returns a failure response', () => {
      const response: Response = withStatus({ status: 'failure' });

      beforeEach(() => {
        refetch.mockImplementationOnce(
          () => new Promise(resolve => resolve(response))
        );
      });

      it('should set the form status', async () => {
        await handler(values, options);

        expect(setStatus).toHaveBeenCalledWith({ ok: false });
      });
    });

    describe('when the request returns a failure response with errors', () => {
      const errors: FormErrors = {
        'launchSite': [{
          data: {},
          message: "can't be blank",
          path: ['launchSite'],
          type: 'test.errorType',
        }],
      };
      const error: InvalidParametersError = {
        data: { errors },
        message: 'invalid request parameters',
        type: invalidParametersError,
      };
      const response = withError({
        error,
        errorType: error.type,
        response: withStatus({ status: 'failure' }),
      });
      const expected: FormStatus = {
        ok: false,
        errors,
      };

      beforeEach(() => {
        refetch.mockImplementationOnce(
          () => new Promise(resolve => resolve(response))
        );
      });

      it('should set the form status', async () => {
        await handler(values, options);

        expect(setStatus).toHaveBeenCalledWith(expected);
      });
    });

    describe('when the request returns a success response', () => {
      it('should set the form status', async () => {
        await handler(values, options);

        expect(setStatus).toHaveBeenCalledWith({ ok: true });
      });
    });
  });

  describe('mapStatus()', () => {
    it('should be a function', () => {
      expect(typeof mapStatus).toBe('function');
    });

    describe('with an uninitialized response', () => {
      const response = withStatus({ status: 'uninitialized' });

      it('should return a basic status', () => {
        expect(mapStatus(response)).toEqual({ ok: true });
      });
    });

    describe('with a loading response', () => {
      const response = withStatus({ status: 'loading' });

      it('should return a basic status', () => {
        expect(mapStatus(response)).toEqual({ ok: true });
      });
    });

    describe('with a success response', () => {
      const response = withStatus({ status: 'success' });

      it('should return a basic status', () => {
        expect(mapStatus(response)).toEqual({ ok: true });
      });
    });

    describe('with a failing response', () => {
      const response = withStatus({ status: 'failure' });

      it('should return a basic status', () => {
        expect(mapStatus(response)).toEqual({ ok: false });
      });
    });

    describe('with a failing response with a string error', () => {
      const response = withError({
        error: 'Something went wrong',
        response: withStatus({ status: 'failure' }),
      });

      it('should return a basic status', () => {
        expect(mapStatus(response)).toEqual({ ok: false });
      });
    });

    describe('with a failing response with an API error', () => {
      const response = withError({
        error: {
          data: {},
          message: 'Something went wrong',
          type: 'test.errorType',
        },
        errorType: 'test.errorType',
        response: withStatus({ status: 'failure' }),
      });

      it('should return a basic status', () => {
        expect(mapStatus(response)).toEqual({ ok: false });
      });
    });

    describe('with a failing response with an invalid parameters error', () => {
      const errors: FormErrors = {
        'launchSite': [{
          data: {},
          message: "can't be blank",
          path: ['launchSite'],
          type: 'test.errorType',
        }],
      };
      const error: InvalidParametersError = {
        data: { errors },
        message: 'invalid request parameters',
        type: invalidParametersError,
      };
      const response = withError({
        error,
        errorType: error.type,
        response: withStatus({ status: 'failure' }),
      });
      const expected: FormStatus = {
        ok: false,
        errors,
      };

      it('should return a basic status', () => {
        expect(mapStatus(response)).toEqual(expected);
      });
    });
  });
});
