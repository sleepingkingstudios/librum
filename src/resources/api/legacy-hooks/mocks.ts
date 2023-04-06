import { defaultResponse } from '@api/test-helpers';
import type { UseResourceQuery } from '../types';

const resourceQuery: jest.MockedFunction<UseResourceQuery> =
  jest.fn(() => defaultResponse);

export const useResourceQuery: jest.MockedFunction<() => UseResourceQuery> =
  jest.fn(() => resourceQuery);
