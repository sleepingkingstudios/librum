import type { UseQuery } from '@api';
import { defaultResult } from '@api/test-helpers';
import type {
  ResourceApiEndpointConfiguration,
  ResourceConfiguration,
} from '../types';
import type { ResourceApiHooks } from './types';

const useIndexResources: jest.MockedFunction<UseQuery> =
  jest.fn(() => defaultResult);

type GenerateResourcesApiProps = {
  endpoints?: ResourceApiEndpointConfiguration,
} & ResourceConfiguration;

type GenerateResourcesApi =
  (options: GenerateResourcesApiProps) => ResourceApiHooks;

export const generateResourcesApi: jest.MockedFunction<GenerateResourcesApi> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jest.fn((...args) => ({
    useIndexResources,
  }));
