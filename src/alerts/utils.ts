import {
  defaultTo,
  filter,
} from 'lodash';
import { v4 as generateUuid } from 'uuid';

import type {
  Alert,
  DismissAllAlertsOptions,
  DisplayAlertProps,
} from './types';

const alertDoesNotHaveContext = (
  context: string | null,
) => (
  alert: Alert
) => (context === null || context === undefined || alert.context !== context)

const uuidPattern =
  /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;

const alertDoesNotHaveUuid = (
  uuid: string
) => (
  alert: Alert
) => (alert.uuid !== uuid);

const alertIsPersistent = (alert: Alert) => (alert.persistent === true);

const createAlert = (
  props: DisplayAlertProps,
): Alert => {
  const { context, icon, message } = props;
  const dismissable = defaultTo(props.dismissable, true);
  const persistent = defaultTo(props.persistent, false);
  const type = defaultTo(props.type, 'info');
  const uuid = generateUuid();
  const alert: Alert = {
    context,
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
  const { context } = alert;

  return [...filter(alerts, alertDoesNotHaveContext(context)), alert];
};

export const removeAlert = (
  alerts: Alert[],
  uuidOrContext: string,
): Alert[] => {
  if (uuidPattern.test(uuidOrContext)) {
    return filter(alerts, alertDoesNotHaveUuid(uuidOrContext));
  }

  return filter(alerts, alertDoesNotHaveContext(uuidOrContext));
};

export const removeAllAlerts = (
  alerts: Alert[],
  options?: DismissAllAlertsOptions,
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
