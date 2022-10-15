import { logResponse } from './log-response';
import {
  defaultOptions,
  defaultResponse,
} from '../test-helpers';
import type {
  Effect,
  Response,
} from '../types';

describe('API effects logResponse()', () => {
  const label = 'CustomRequest';
  const log = jest.fn();
  const options = {
    ...defaultOptions,
    log,
  };
  const effect: Effect = logResponse(label);
  const response: Response = {
    ...defaultResponse,
    isLoading: true,
    status: 'loading',
  };

  beforeEach(() => { log.mockClear(); });

  it('should be a function', () => {
    expect(typeof logResponse).toBe('function');
  });

  it('should return a function', () => {
    expect(typeof effect).toBe('function');
  });

  it('should log the response', () => {
    effect(response, options);

    expect(log).toHaveBeenCalledWith(`${label}, response:`, response);
  });
});
