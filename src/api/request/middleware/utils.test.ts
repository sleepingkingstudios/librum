import { matchResponse } from './utils';
import type {
  MiddlewareOptions,
  Response,
} from '../types';
import {
  withError,
  withStatus,
} from '../utils';

describe('API response middleware utils', () => {
  describe('matchResponse()', () => {
    const options: MiddlewareOptions = { key: 'value' };

    it('should be a function', () => {
      expect(typeof matchResponse).toBe('function');
    });

    describe('with a non-matching errorType', () => {
      const failureResponse: Response = withError({
        error: 'Something went wrong',
        errorType: 'spec.example.genericError',
        response: withStatus({ status: 'failure' }),
      });

      it('should not call the handler', () => {
        const handler = jest.fn();

        matchResponse(failureResponse, options)
          .on({ errorType: 'spec.example.customError' }, handler);

        expect(handler).not.toHaveBeenCalled();
      });
    });

    describe('with a matching errorType', () => {
      const failureResponse: Response = withError({
        error: 'Something went wrong',
        errorType: 'spec.example.genericError',
        response: withStatus({ status: 'failure' }),
      });

      it('should call the handler', () => {
        const handler = jest.fn();

        matchResponse(failureResponse, options)
          .on({ errorType: 'spec.example.genericError' }, handler);

        expect(handler).toHaveBeenCalledWith(failureResponse, options);
      });
    });

    describe('with a non-matching status', () => {
      const failureResponse: Response = withStatus({ status: 'failure' });

      it('should not call the handler', () => {
        const handler = jest.fn();

        matchResponse(failureResponse, options)
          .on({ status: 'success' }, handler);

        expect(handler).not.toHaveBeenCalled();
      });
    });

    describe('with a matching status', () => {
      const successResponse: Response = withStatus({ status: 'success' });

      it('should not call the handler', () => {
        const handler = jest.fn();

        matchResponse(successResponse, options)
          .on({ status: 'success' }, handler);

        expect(handler).toHaveBeenCalledWith(successResponse, options);
      });
    });

    describe('with chained conditions', () => {
      const failureResponse: Response = withError({
        error: 'Something went wrong',
        errorType: 'spec.example.genericError',
        response: withStatus({ status: 'failure' }),
      });

      it('should call the matching handler', () => {
        const handleError = jest.fn();
        const handleFailure = jest.fn();
        const handleSuccess = jest.fn();

        matchResponse(failureResponse, options)
          .on({ status: 'success' }, handleSuccess)
          .on({ errorType: 'spec.example.genericError' }, handleError)
          .on({ status: 'failure' }, handleFailure);

        expect(handleSuccess).not.toHaveBeenCalled();
        expect(handleFailure).not.toHaveBeenCalled();
        expect(handleError).toHaveBeenCalledWith(failureResponse, options);
      });
    });
  });
});
