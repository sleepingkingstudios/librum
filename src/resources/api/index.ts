import type {
  UseMutation,
  UseQuery,
} from '@api';
import { injectEndpoint } from './endpoint';
import type {
  ResourceApiParams,
  ResourceEndpointDefinition,
} from './types';

const defaultEndpoints: Record<string, ResourceEndpointDefinition> = {
  index: {
    member: false,
    method: 'GET',
    url: '',
  },
};

export const generateResourcesApi = ({
  baseUrl,
  endpoints,
  resourceName,
  singularName,
  scope,
}: ResourceApiParams): Record<string, UseMutation | UseQuery> => {
  const configured: Record<string, false | ResourceEndpointDefinition> = {
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
          action,
          baseUrl,
          endpoint,
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


  const injected = injectEndpoint({
    action: 'index',
    baseUrl,
    endpoint: {
      member: false,
      method: 'GET',
      url: '',
    },
    resourceName,
    scope,
  });

  return injected;
};
