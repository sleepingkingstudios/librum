import type {
  Alert,
  AlertsContext,
} from '@alerts';
import type { Dispatch } from '@store';
import type {
  ApiError,
  ApiFailure,
  ApiSuccess,
  EffectOptions,
  Response,
  ResponseStatus,
  UseMutationResult,
  UseQueryResult,
} from './types';

const alerts: AlertsContext = {
  alerts: [] as Alert[],
  dismissAlert: jest.fn(),
  dismissAllAlerts: jest.fn(),
  displayAlert: jest.fn(),
}
const dispatch: Dispatch = jest.fn();
const data: Record<string, unknown> = {
  user: {
    firstName: 'Alan',
    lastName: 'Bradley',
  },
};
const error: ApiError = {
  data: {},
  message: 'Something went wrong',
  type: 'spec.errors.genericError',
};
const apiFailure: ApiFailure = {
  ok: false,
  error,
};
const apiFailureWithData: ApiFailure = {
  ok: false,
  data,
  error,
};
const apiSuccess: ApiSuccess = {
  ok: true,
  data,
};

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
  status: 'unknown' as ResponseStatus,
};

export const defaultResult: UseMutationResult & UseQueryResult = {
  isUninitialized: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  refetch: jest.fn(),
  reset: jest.fn(),
};

export const failureResponse = {
  ...defaultResponse,
  error,
  errorType: error.type,
  hasError: true,
  isFailure: true,
  status: 'failure' as ResponseStatus,
};

export const failureResult = {
  ...defaultResult,
  error: {
    data: apiFailure,
    status: 400,
  },
  isError: true,
};

export const failureResultWithData = {
  ...defaultResult,
  error: {
    data: apiFailureWithData,
    status: 400,
  },
  isError: true,
};

export const loadingResponse = {
  ...defaultResponse,
  isLoading: true,
  status: 'loading' as ResponseStatus,
};

export const loadingResult = {
  ...defaultResult,
  isLoading: true,
};

export const successResponse = {
  ...defaultResponse,
  data,
  hasData: true,
  isSuccess: true,
  status: 'success' as ResponseStatus,
};

export const successResult = {
  ...defaultResult,
  data: apiSuccess,
  isSuccess: true,
};
