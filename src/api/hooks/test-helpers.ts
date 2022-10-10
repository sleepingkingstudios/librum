import type {
  Alert,
  AlertsContext,
} from '@alerts';
import type { Dispatch } from '@store';
import type { EffectOptions } from '../types';
import type {
  Response,
  UseQueryResult,
} from './types';

const alerts: AlertsContext = {
  alerts: [] as Alert[],
  dismissAlert: jest.fn(),
  dismissAllAlerts: jest.fn(),
  displayAlert: jest.fn(),
}
const dispatch: Dispatch = jest.fn();

export const defaultOptions: EffectOptions = {
  alerts,
  dispatch,
};

export const defaultResponse: Response = {
  hasData: false,
  hasError: false,
  isUninitialized: false,
  isLoading: false,
  isErrored: false,
  isFailure: false,
  isSuccess: false,
  status: 'unknown',
};

export const defaultResult: UseQueryResult = {
  isUninitialized: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  refetch: jest.fn(),
};
