import * as React from 'react';
import { useLocation } from 'react-router-dom';

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
  const didMount = React.useRef(false);
  const [alerts, setAlerts] = React.useState<Alert[]>(initialValue);
  const location = useLocation();
  const { pathname } = location;

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

  React.useEffect(
    () => {
      if (!didMount.current) {
        didMount.current = true;

        return;
      }

      dismissAllAlerts({ removePersistent: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname],
  );

  return (
    <AlertsContext.Provider value={context}>
      { children }
    </AlertsContext.Provider>
  );
}
