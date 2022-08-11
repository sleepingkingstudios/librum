import * as React from 'react';

import { AlertsContext } from './context';

export { AlertsProvider } from './provider';
export type {
  Alert,
  AlertType,
  AlertsContext,
  DismissAlert,
  DismissAllAlerts,
  DisplayAlertProps,
  DisplayAlert,
  UseAlerts,
} from './types';

export const useAlerts = () => React.useContext(AlertsContext);
