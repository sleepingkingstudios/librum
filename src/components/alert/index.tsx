import * as React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
  faBomb,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faX,
} from '@fortawesome/free-solid-svg-icons';

import { useAlerts } from '@alerts';
import type { DismissAlert } from '@alerts';

import type {
  Alert as IAlert,
  AlertType,
} from '@alerts';
import { joinClassNames } from '@utils/react-utils';

interface IAlertProps {
  alert: IAlert;
  className?: string;
}

interface IDefaultIconProps {
  type: AlertType;
}

interface IRenderDismissButton {
  dismissAlert: DismissAlert;
  dismissable: boolean;
  uuid: string;
}

interface IRenderIconProps {
  icon?: IconDefinition;
  type: AlertType;
}

const defaultIcon = ({ type }: IDefaultIconProps): IconDefinition => {
  if (type === 'failure') {
    return faBomb;
  } else if (type === 'info') {
    return faCircleInfo;
  } else if (type === 'success') {
    return faCircleCheck;
  } else if (type === 'warning') {
    return faCircleExclamation;
  }

  return null;
};

const renderDismissButton = ({
  dismissAlert,
  dismissable,
  uuid,
}: IRenderDismissButton): JSX.Element => {
  if (!dismissable) { return null; }

  const onClick = () => {
    dismissAlert(uuid);
  }

  return (
    <button className="float-right link-plain" onClick={onClick}>
      <Icon icon={faX} />
    </button>
  );
};

const renderIcon = ({ icon, type }: IRenderIconProps): JSX.Element => {
  if (icon === null || icon === undefined) {
    return (
      <Icon className="pr-2" icon={defaultIcon({ type })} />
    );
  }

  return (
    <Icon className="pr-2" icon={icon} />
  )
};

export const Alert = ({
  alert,
  className,
}: IAlertProps): JSX.Element => {
  const {
    dismissable,
    icon,
    message,
    type,
    uuid,
  } = alert;
  const joinedClassName = joinClassNames(
    'alert',
    `alert-${type}`,
    className,
  );
  const { dismissAlert } = useAlerts();

  return (
    <div className={joinedClassName}>
      { renderDismissButton({ dismissAlert, dismissable, uuid }) }
      { renderIcon({ icon, type }) }
      { message }
    </div>
  );
};
