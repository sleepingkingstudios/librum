import * as React from 'react';

import { AlertsContext } from './context';
import type {
  Alert,
  DismissAlert,
  DismissAllAlerts,
  DisplayAlert,
} from './types';
import {
  addAlert,
  removeAlert,
  removeAllAlerts,
} from './utils';

interface IAlertsProvider {
  children: React.ReactNode;
  initialValue?: Alert[],
}

export const AlertsProvider = ({
  initialValue = [] as Alert[],
  children,
}: IAlertsProvider): JSX.Element => {
  const [alerts, setAlerts] = React.useState<Alert[]>(initialValue);

  const dismissAlert: DismissAlert =
    (uuidOrContext) => setAlerts(removeAlert(alerts, uuidOrContext));
  const dismissAllAlerts: DismissAllAlerts =
    ({ removePersistent }) => setAlerts(removeAllAlerts(alerts, { removePersistent }));
  const displayAlert: DisplayAlert =
    (alert) => setAlerts(addAlert(alerts, alert));
  const context = {
    alerts,
    dismissAlert,
    dismissAllAlerts,
    displayAlert,
  };

  dismissAlert.annotations = {
    name: 'alerts:dismissAlert',
    type: 'hook:function',
  };
  dismissAllAlerts.annotations = {
    name: 'alerts:dismissAllAlerts',
    type: 'hook:function',
  };
  displayAlert.annotations = {
    name: 'alerts:displayAlert',
    type: 'hook:function',
  };

  return (
    <AlertsContext.Provider value={context}>
      { children }
    </AlertsContext.Provider>
  );
}
