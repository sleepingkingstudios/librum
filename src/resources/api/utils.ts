import { snakeCase } from 'lodash';

import { applyWildcards } from '@api/utils';
import { singularize } from '@utils/inflector';
import { upperCamelCase } from '@utils/text';

const baseUrlFor = ({
  baseUrl,
  resourceName,
  scope,
}: {
  baseUrl?: string,
  resourceName: string,
  scope: string,
}): string => {
  if (baseUrl && baseUrl.length > 0) { return baseUrl; }

  return generateBaseUrl({ resourceName, scope });
};

export const generateBaseUrl = ({
  resourceName,
  scope,
}: {
  resourceName: string,
  scope?: string,
}): string => {
  if (!scope || scope.length === 0) { return snakeCase(resourceName); }

  const formatted = scope.split('/').map(snakeCase).join('/');

  return `${formatted}/${snakeCase(resourceName)}`;
};

export const generateEndpointName = ({
  action,
  member,
  resourceName,
  singularName,
  scope,
}: {
  action: string,
  member: boolean,
  resourceName: string,
  singularName?: string,
  scope?: string,
}): string => {
  const name =
    member ? (singularName || singularize(resourceName)) : resourceName;
  const unscoped = `${upperCamelCase(action)}${upperCamelCase(name)}`;

  if (!scope || scope.length === 0) { return unscoped; }

  return `${upperCamelCase(scope)}${unscoped}`;
};

export const generateResourceUrl = ({
  action,
  baseUrl,
  member,
  resourceName,
  scope,
  url,
  wildcards,
}: {
  action: string,
  baseUrl?: string,
  member: boolean,
  resourceName: string,
  scope?: string,
  url?: string,
  wildcards?: Record<string, string>,
}): string => {
  let generated;

  if (typeof url === 'string' && url[0] === '/') {
    generated = url.slice(1);
  } else if (typeof url === 'string') {
    generated = baseUrlFor({ baseUrl, resourceName, scope });

    if (url.length > 0) { generated = `${generated}/${url}`; }
  } else {
    generated = baseUrlFor({ baseUrl, resourceName, scope });

    if (member) { generated = `${generated}/:id`; }

    generated = `${generated}/${action}`;
  }

  return applyWildcards({ url: generated, wildcards });
}
