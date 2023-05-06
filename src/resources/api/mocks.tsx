import { responseWithStatus } from '@api';
import type {
  Refetch,
  Response,
} from '@api';

type UseResourceQuery = (props: unknown) => [Response, Refetch];

export { generateAlerts } from './utils';

export const useResourceQuery: jest.MockedFunction<UseResourceQuery> = jest.fn(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (props) => [responseWithStatus({ status: 'uninitialized' }), jest.fn()]
);
