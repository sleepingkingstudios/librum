import {
  camelCase,
  kebabCase,
  snakeCase,
} from 'lodash';

import type { DisplayAlertProps } from '@alerts';
import type { AlertDirective } from '@api/request';
import {
  pastTense,
  singularize,
} from '@utils/inflector';

const generateBaseUrl = ({
  baseUrl,
  resourceName,
  scope,
}: {
  baseUrl?: string,
  resourceName: string,
  scope?: string,
}): string => {
  if (baseUrl) { return baseUrl; }

  if (!scope || scope.length === 0) {
    return `api/${snakeCase(resourceName)}`;
  }

  const formatted = scope.split('/').map(snakeCase).join('/');

  return `api/${formatted}/${snakeCase(resourceName)}`;
};

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
};

export const generateAlerts = ({
  action,
  alerts,
  member,
  query,
  resourceName,
  scope,
  singularName,
}: {
  action: string,
  alerts?: AlertDirective[],
  member: boolean,
  query: boolean,
  resourceName: string,
  scope?: string,
  singularName?: string,
}): AlertDirective[] => {
  if (alerts) { return alerts; }

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
      {
        dismiss: context,
        status: 'success',
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

export const generateUrl = ({
  action,
  baseUrl,
  member,
  resourceName,
  scope,
  url,
}: {
  action: string,
  baseUrl?: string,
  member: boolean,
  resourceName: string,
  scope?: string,
  url?: string,
}): string => {
  let generated;

  if (typeof url === 'string' && url[0] === '/') {
    return url.slice(1);
  }

  generated = generateBaseUrl({ baseUrl, resourceName, scope });

  if (typeof url === 'string') {
    if (url.length === 0) { return generated; }

    return `${generated}/${url}`;
  }

  if (member) { generated = `${generated}/:id`; }

  generated = `${generated}/${action}`;

  return generated;
};
