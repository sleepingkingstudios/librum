import { displayAlerts } from '@api/effects';
import { useQueryRequest } from '@api/hooks';
import { generateAlerts } from '../effects';
import type {
  ResourceQueryParams,
  UseResourceQuery,
  UseResourceQueryProps,
} from '../types';

export const useResourceQuery = ({
  action,
  alerts,
  effects,
  member,
  resourceName,
  scope,
  singularName,
  useQuery,
}: UseResourceQueryProps): UseResourceQuery => {
  const configuredEffects = effects ? [...effects] : [];

  if (alerts === undefined || alerts === null) {
    const configuredAlerts = generateAlerts({
      action,
      member,
      query: true,
      resourceName,
      singularName,
      scope,
    });

    configuredEffects.unshift(displayAlerts(configuredAlerts));
  } else if (alerts) {
    configuredEffects.unshift(displayAlerts(alerts));
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (arg?: ResourceQueryParams) => useQueryRequest({
    arg,
    effects: configuredEffects,
    useQuery,
  });
};
