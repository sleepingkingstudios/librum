import type {
  Alert,
  DismissAlert,
  DismissAllAlerts,
  DisplayAlert,
} from '@alerts';

type MockAlertsContext = {
  alerts: Alert[],
  dismissAlert: jest.MockedFunction<DismissAlert>,
  dismissAllAlerts: jest.MockedFunction<DismissAllAlerts>,
  displayAlert: jest.MockedFunction<DisplayAlert>,
};

type MockUseAlerts = jest.MockedFunction<() => MockAlertsContext>;

const alerts: MockAlertsContext = {
  alerts: [] as Alert[],
  dismissAlert: jest.fn(),
  dismissAllAlerts: jest.fn(),
  displayAlert: jest.fn(),
};

export const useAlerts: MockUseAlerts = jest.fn(() => alerts);
