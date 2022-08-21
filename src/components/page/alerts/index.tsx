import * as React from 'react';
import { map } from 'lodash';

import { useAlerts } from '@alerts';
import type { Alert as IAlert } from '@alerts'
import { Alert } from '@components/alert';

const renderAlert = (alert: IAlert): JSX.Element => {
  const { uuid } = alert;

  return (
    <li key={uuid}>
      <Alert alert={alert} />
    </li>
  )
};

export const PageAlerts = (): JSX.Element => {
  const { alerts } = useAlerts();

  if (alerts.length === 0) { return null; }

  return (
    <ul className="alerts pb-3">
      { map(alerts, renderAlert) }
    </ul>
  );
};
