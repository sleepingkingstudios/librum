import type {
  Effect,
  UseQuery,
} from '@api';
import { displayAlerts } from '@api/effects';
import { useQueryRequest } from '@api/hooks';
import type { AlertDirective } from '@api/effects/display-alerts';
import { generateAlerts } from '../effects';
import type {
  ResourceQueryParams,
  UseResourceQuery,
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
}: {
  action: string,
  alerts?: false | AlertDirective[],
  effects?: Effect[],
  member: boolean,
  resourceName: string,
  scope?: string,
  singularName?: string,
  useQuery: UseQuery,
}): UseResourceQuery => {
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
