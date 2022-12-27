import type {
  EndpointDefinition as NativeEndpointDefinition,
} from '@reduxjs/toolkit/query/react';

import { api } from '@api';
import type {
  ApiSuccess,
  UseMutation,
  UseQuery,
} from '@api';
import { upperCamelCase } from '@utils/text';
import type {
  ResourceEndpointProperties,
  ResourceMutationParams,
  ResourceQueryParams,
} from './types';
import {
  generateEndpointName,
  generateResourceUrl,
} from './utils';

export type Builder = {
  mutation: BuilderQueryFunction,
  query: BuilderQueryFunction,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type BuilderQueryFunction = <Response = unknown, Param = unknown>({
  query,
}: {
  query: InnerQueryFunction,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => NativeEndpointDefinition<any, any, any, any, string>;
type InnerQueryFunction = (arg?: unknown) => {
  body?: Record<string, unknown>,
  method: string,
  params?: Record<string, string>,
  url: string,
};

const buildMutationEndpoint = ({
  action,
  baseUrl,
  endpoint,
  endpointName,
  resourceName,
  scope,
}: { endpointName: string } & ResourceEndpointProperties) => {
  const {
    member,
    method,
    url,
  } = endpoint;

  return (builder: Builder) => ({
    [endpointName]: builder.mutation<ApiSuccess<Record<string, unknown>>, unknown>({
      query: (arg?: ResourceMutationParams) => {
        const { body, params, wildcards } = arg || {};

        const resourceUrl = generateResourceUrl({
          action,
          baseUrl,
          member,
          resourceName,
          scope,
          url,
          wildcards,
        });

        return {
          ...(body ? { body }: {}),
          ...(params ? { params }: {}),
          method: method.toUpperCase(),
          url: resourceUrl,
        };
      },
    }),
  });
};

const buildQueryEndpoint = ({
  action,
  baseUrl,
  endpoint,
  endpointName,
  resourceName,
  scope,
}: { endpointName: string } & ResourceEndpointProperties) => {
  const {
    member,
    method,
    url,
  } = endpoint;

  return (builder: Builder) => ({
    [endpointName]: builder.query<ApiSuccess<Record<string, unknown>>, unknown>({
      query: (arg?: ResourceQueryParams) => {
        const { params, wildcards } = arg || {};

        const resourceUrl = generateResourceUrl({
          action,
          baseUrl,
          member,
          resourceName,
          scope,
          url,
          wildcards,
        });

        return {
          ...(params ? { params }: {}),
          method: method.toUpperCase(),
          url: resourceUrl,
        };
      },
    }),
  });
};

const buildEndpoint = ({
  action,
  baseUrl,
  endpoint,
  endpointName,
  resourceName,
  scope,
}: { endpointName: string } & ResourceEndpointProperties) => {
  const { method } = endpoint;
  const builder = method.toLowerCase() === 'get' ?
    buildQueryEndpoint :
    buildMutationEndpoint;

  return builder({
    action,
    baseUrl,
    endpoint,
    endpointName,
    resourceName,
    scope,
  });
};

export const injectEndpoint = ({
  action,
  baseUrl,
  endpoint,
  resourceName,
  singularName,
  scope,
}: ResourceEndpointProperties): Record<string, UseQuery | UseMutation> => {
  const {
    member,
    method,
  } = endpoint;
  const endpointName = generateEndpointName({
    action,
    member,
    resourceName,
    singularName,
    scope,
  });
  const endpoints = buildEndpoint({
    action,
    baseUrl,
    endpoint,
    endpointName,
    resourceName,
    scope,
  });
  const injected =
    api.injectEndpoints({ endpoints }) as Record<string, unknown>;
  const key = `use${upperCamelCase(action)}Resource${member ? '' : 's'}`;
  let useEndpoint;

  if (method.toLowerCase() === 'get') {
    useEndpoint = injected[`use${endpointName}Query`] as UseQuery;
  } else {
    useEndpoint = injected[`use${endpointName}Mutation`] as UseMutation;
  }

  return { [key]: useEndpoint };
};
