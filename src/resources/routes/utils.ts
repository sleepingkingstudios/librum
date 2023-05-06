import { kebabCase } from 'lodash';

export const configuredRouteFor = ({
  resourceName,
  route,
  scope,
}: {
  resourceName: string,
  route?: string,
  scope?: string,
}): string => {
  if (route && route.length > 0) {
    if (route[0] === '/') { return route; }

    return `/${route}`;
  }

  if (scope && scope.length > 0) {
    return `/${kebabCase(scope)}/${kebabCase(resourceName)}`;
  }

  return `/${kebabCase(resourceName)}`;
};
