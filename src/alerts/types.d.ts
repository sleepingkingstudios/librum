import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

export type AlertType = "failure" | "info" | "success" | "warning";

export type Alert = {
  dismissable: boolean;
  icon?: IconDefinition;
  message: string;
  persistent: boolean;
  type: AlertType;
  uuid: string;
}

export type DismissAlert = (uuid: string) => void;

export type DismissAlertsOptions = {
  removePersistent: boolean;
};

export type DismissAllAlerts = (options?: DismissAlertsOptions) => void;

export type DisplayAlertProps = {
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
  displayAlert: DisplayAlert,
};

export type UseAlerts = () => AlertsContext;
