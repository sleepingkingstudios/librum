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

export const AlertsProvider = ({
  initialValue = [] as Alert[],
  children,
}: {
  children: React.ReactNode,
  initialValue?: Alert[],
}): JSX.Element => {
  const [alerts, setAlerts] = React.useState<Alert[]>(initialValue);
  const location = useLocation();
  const { pathname } = location;
  const lastPathname = React.useRef(pathname);

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

  React.useEffect(
    () => {
      if (lastPathname.current === pathname) { return; }

      lastPathname.current = pathname;

      setAlerts(removeAllAlerts(alerts, { removePersistent: false }));
    },
    [alerts, lastPathname, pathname, setAlerts],
  );

  return (
    <AlertsContext.Provider value={context}>
      { children }
    </AlertsContext.Provider>
  );
}
