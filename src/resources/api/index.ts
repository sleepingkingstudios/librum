import type {
  UseMutation,
  UseQuery,
} from '@api';
import type {
  ResourceApiEndpointConfiguration,
  ResourceConfiguration,
} from '../types';
import { injectEndpoint } from './endpoint';

export { useResourceQuery } from './hooks/use-resource-query';

const defaultEndpoints: ResourceApiEndpointConfiguration = {
  index: {
    member: false,
    method: 'GET',
    url: '',
  },
};

type GenerateResourcesApiProps = {
  endpoints?: ResourceApiEndpointConfiguration,
} & ResourceConfiguration;

export const generateResourcesApi = ({
  baseUrl,
  endpoints,
  resourceName,
  singularName,
  scope,
}: GenerateResourcesApiProps): Record<string, UseMutation | UseQuery> => {
  const configured: ResourceApiEndpointConfiguration = {
    ...defaultEndpoints,
    ...(endpoints || {}),
  };

  return Object
    .entries(configured)
    .reduce(
      (memo, tuple) => {
        const [action, endpoint] = tuple;

        if (endpoint === false) { return memo; }

        const injected = injectEndpoint({
          baseUrl,
          endpoint: {
            action,
            ...endpoint,
          },
          resourceName,
          singularName,
          scope,
        });

        return {
          ...memo,
          ...injected,
        };
      },
      {},
    );
};
