import type { UseQuery } from '@api';
import { responseWithStatus } from '@api/request';
import type { AlertDirective } from '@api/request';
import { defaultResult } from '@api/test-helpers';
import type {
  ResourceApiEndpointConfiguration,
  ResourceConfiguration,
} from '../types';
import type { ResourceApiHooks } from './types';

const refetch = jest.fn();
const response = responseWithStatus({ status: 'success' });

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

export const generateAlerts = () => [] as AlertDirective[];

export const generateUrl = () => 'api/rare_books';

export const useResourceQuery = jest.fn(() => [response, refetch]);
