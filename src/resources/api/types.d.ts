import type {
  Effect,
  Response,
  UseQuery,
} from '@api';
import type { AlertDirective } from '@api/effects/display-alerts';

export type ResourceApiHooks = Record<string, UseMutation | UseQuery>;

export type ResourceMutationParams = {
  body?: Record<string, unknown>,
  params?: Record<string, string>,
  wildcards?: Record<string, string>,
};

export type ResourceQueryParams = {
  params?: Record<string, string>,
  wildcards?: Record<string, string>,
};

export type UseResourceQuery = (arg?: ResourceQueryParams) => Response;

export type UseResourceQueryProps = {
  action: string,
  alerts?: false | AlertDirective[],
  effects?: Effect[],
  member: boolean,
  resourceName: string,
  scope?: string,
  singularName?: string,
  useQuery: UseQuery,
};
