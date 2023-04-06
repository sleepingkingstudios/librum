import type {
  ResourceApiEndpointConfiguration,
  ResourceConfiguration,
} from '../types';
import { injectEndpoint } from './endpoint';
import type { ResourceApiHooks } from './types';

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
}: GenerateResourcesApiProps): ResourceApiHooks => {
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
