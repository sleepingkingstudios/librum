import {
  camelCase,
  kebabCase,
  snakeCase,
} from 'lodash';

import type { DisplayAlertProps } from '@alerts';
import type { AlertDirective } from '@api';
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

export const generateAlertContext = ({
  action,
  resourceName,
  scope,
}: {
  action: string,
  resourceName: string,
  scope?: string,
}): string => {
  const context = `${camelCase(resourceName)}:${action}:request`;

  if (scope && scope.length > 0) {
    const formatted = scope.split('/').map(camelCase).join(':');

    return `resources:${formatted}:${context}`;
  }

  return `resources:${context}`;
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

  const context = generateAlertContext({ action, resourceName, scope });
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
  singularName,
  url,
}: {
  action: string,
  baseUrl?: string,
  member: boolean,
  resourceName: string,
  scope?: string,
  singularName?: string,
  url?: string,
}): string => {
  let generated;

  if (typeof url === 'string' && url[0] === '/') { return url; }

  generated = generateBaseUrl({ baseUrl, resourceName, scope });

  if (typeof url === 'string' && url.length > 0) {
    return `/${generated}/${url}`;
  }

  if (member) {
    generated = `${generated}/:${singularName || singularize(resourceName)}Id`;
  }

  if (url === '') { return `/${generated}`; }

  return `/${generated}/${action}`;
};
