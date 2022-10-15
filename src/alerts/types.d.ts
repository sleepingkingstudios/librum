import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

export type AlertType = "failure" | "info" | "success" | "warning";

export type Alert = {
  context?: string;
  dismissable: boolean;
  icon?: IconDefinition;
  message: string;
  persistent: boolean;
  type: AlertType;
  uuid: string;
}

export type DismissAlert = (uuidOrContext: string) => void;

export type DismissAllAlertsOptions = {
  removePersistent: boolean;
};

export type DismissAllAlerts = (options?: DismissAllAlertsOptions) => void;

export type DisplayAlertProps = {
  context?: string;
  dismissable?: boolean;
  icon?: IconDefinition;
  message: string;
  persistent?: boolean;
  type?: AlertType;
}

export type DisplayAlert = (alert: DisplayAlertProps) => void;

export type AlertsContext = {
  alerts: Alert[],
  dismissAlert: DismissAlert,
  dismissAllAlerts: DismissAllAlerts,
  displayAlert: DisplayAlert,
};

export type UseAlerts = () => AlertsContext;
