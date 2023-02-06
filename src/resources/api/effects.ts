import {
  camelCase,
  kebabCase,
} from 'lodash';

import type { DisplayAlertProps } from '@alerts';
import type { AlertDirective } from '@api/effects/display-alerts';
import {
  pastTense,
  singularize,
} from '@utils/inflector';

const generateContext = ({
  resourceName,
  scope,
}: {
  resourceName: string,
  scope?: string,
}): string => {
  if (scope && scope.length > 0) {
    return `resources:${camelCase(scope)}:${camelCase(resourceName)}:request`;
  }

  return `resources:${camelCase(resourceName)}:request`;
}

export const generateAlerts = ({
  action,
  member,
  query,
  resourceName,
  singularName,
  scope,
}: {
  action: string,
  member: boolean,
  query: boolean,
  resourceName: string,
  singularName?: string,
  scope?: string,
}): AlertDirective[] => {
  const context = generateContext({ resourceName, scope });
  const friendlyName =
    kebabCase(
      member ?
        (singularName || singularize(resourceName)) :
        resourceName
    )
    .replace('-', ' ');
  const failureAlert: DisplayAlertProps = {
    context,
    message: `Unable to ${action} ${friendlyName}`,
    type: 'failure',
  };

  if (query) {
    return [
      {
        display: failureAlert,
        status: 'errored',
      },
      {
        display: failureAlert,
        status: 'failure',
      },
    ];
  }

  const successAlert: DisplayAlertProps = {
    context,
    message: `Successfully ${pastTense(action)} ${friendlyName}`,
    type: 'success',
  };

  return [
    {
      display: failureAlert,
      status: 'errored',
    },
    {
      display: failureAlert,
      status: 'failure',
    },
    {
      display: successAlert,
      status: 'success',
    },
  ];
};
