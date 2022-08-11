import {
  defaultTo,
  filter,
} from 'lodash';
import { v4 as generateUuid } from 'uuid';

import type {
  Alert,
  DismissAlertsOptions,
  DisplayAlertProps,
} from './types';

const alertDoesNotHaveUuid = (
  uuid: string
) => (
  alert: Alert
) => (alert.uuid !== uuid);

const alertIsPersistent = (alert: Alert) => (alert.persistent === true);

const createAlert = (
  props: DisplayAlertProps,
): Alert => {
  const { icon, message } = props;
  const dismissable = defaultTo(props.dismissable, true);
  const persistent = defaultTo(props.persistent, false);
  const type = defaultTo(props.type, 'info');
  const uuid = generateUuid();
  const alert: Alert = {
    dismissable,
    icon,
    message,
    persistent,
    type,
    uuid,
  };

  return alert;
};

export const addAlert = (
  alerts: Alert[],
  props: DisplayAlertProps,
): Alert[] => {
  const alert: Alert = createAlert(props);

  return [...alerts, alert];
};

export const removeAlert = (
  alerts: Alert[],
  uuid: string,
): Alert[] => (
  filter(alerts, alertDoesNotHaveUuid(uuid))
);

export const removeAllAlerts = (
  alerts: Alert[],
  options?: DismissAlertsOptions,
): Alert[] => {
  if (options !== null && options !== undefined) {
    const { removePersistent } = options;

    if (removePersistent) {
      return [] as Alert[];
    }
  }

  return (
    filter(alerts, alertIsPersistent)
  );
};
