export type ResourceApiProperties = {
  baseUrl?: string,
  resourceName: string,
  singularName?: string,
  scope?: string,
};

export type ResourceEndpointDefinition = {
  member: boolean,
  method?: string,
  url?: string,
};

export type ResourceEndpointProperties = {
  action: string,
  endpoint: ResourceEndpointDefinition,
  plural?: boolean,
} & ResourceApiProperties;

export type ResourceMutationParams = {
  body?: Record<string, unknown>,
  params?: Record<string, string>,
  wildcards?: Record<string, string>,
};

export type ResourceQueryParams = {
  params?: Record<string, string>,
  wildcards?: Record<string, string>,
};
