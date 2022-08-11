import * as React from 'react';

import type {
  Alert,
  DismissAlert,
  DismissAllAlerts,
  DisplayAlert,
  DisplayAlertProps,
} from './types';

const alerts: Alert[] = [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const dismissAlert: DismissAlert = (uuid: string) => {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const displayAlert: DisplayAlert = (alert: DisplayAlertProps) => {};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const dismissAllAlerts: DismissAllAlerts = () => {};

export const AlertsContext = React.createContext({
  alerts,
  dismissAlert,
  dismissAllAlerts,
  displayAlert,
});
