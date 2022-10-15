import { match } from './matcher';
import {
  defaultOptions,
  defaultResponse,
} from '../test-helpers';
import type {
  EffectOptions,
  Response,
} from '../types';

describe('API effects matcher', () => {
  const options: EffectOptions = {
    ...defaultOptions,
    key: 'value',
  };

  it('should be a function', () => {
    expect(typeof match).toBe('function');
  });

  describe('with a non-matching errorType', () => {
    const failureResponse: Response = {
      ...defaultResponse,
      errorType: 'spec.example.genericError',
      hasError: true,
      isFailure: true,
      status: 'failure',
    };

    it('should not call the handler', () => {
      const handler = jest.fn();

      match(failureResponse, options)
        .on({ errorType: 'spec.example.customError' }, handler);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('with a matching errorType', () => {
    const failureResponse: Response = {
      ...defaultResponse,
      errorType: 'spec.example.genericError',
      hasError: true,
      isFailure: true,
      status: 'failure',
    };

    it('should call the handler', () => {
      const handler = jest.fn();

      match(failureResponse, options)
        .on({ errorType: 'spec.example.genericError' }, handler);

      expect(handler).toHaveBeenCalledWith(failureResponse, options);
    });
  });

  describe('with a non-matching status', () => {
    const failureResponse: Response = {
      ...defaultResponse,
      isFailure: true,
      status: 'failure',
    };

    it('should not call the handler', () => {
      const handler = jest.fn();

      match(failureResponse, options)
        .on({ status: 'success' }, handler);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('with a matching status', () => {
    const successResponse: Response = {
      ...defaultResponse,
      isSuccess: true,
      status: 'success',
    };

    it('should not call the handler', () => {
      const handler = jest.fn();

      match(successResponse, options)
        .on({ status: 'success' }, handler);

      expect(handler).toHaveBeenCalledWith(successResponse, options);
    });
  });

  describe('with chained conditions', () => {
    const failureResponse: Response = {
      ...defaultResponse,
      errorType: 'spec.example.genericError',
      hasError: true,
      isFailure: true,
      status: 'failure',
    };

    it('should call the matching handler', () => {
      const handleError = jest.fn();
      const handleFailure = jest.fn();
      const handleSuccess = jest.fn();

      match(failureResponse, options)
        .on({ status: 'success' }, handleSuccess)
        .on({ errorType: 'spec.example.genericError' }, handleError)
        .on({ status: 'failure' }, handleFailure);

      expect(handleSuccess).not.toHaveBeenCalled();
      expect(handleFailure).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalledWith(failureResponse, options);
    });
  });
});
