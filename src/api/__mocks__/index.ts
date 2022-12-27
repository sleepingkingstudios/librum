type Builder = {
  mutation: BuilderMutation,
  query: BuilderQuery,
};

type BuilderInnerQuery = (arg?: unknown) => Record<string, string>;

type BuilderMutation = (query: { query: BuilderInnerQuery }) => BuilderMutationResult;

type BuilderMutationResult = {
  query: BuilderInnerQuery,
  type: 'mutation',
};

type BuilderQuery = (query: { query: BuilderInnerQuery }) => BuilderQueryResult;

type BuilderQueryResult = {
  query: BuilderInnerQuery,
  type: 'query',
};

type Endpoints = (builder: Builder) => Record<string, BuilderQueryResult>;

const mutation: BuilderMutation =
  ({ query }: { query: BuilderInnerQuery }): BuilderMutationResult => ({
    query,
    type: 'mutation',
  });
const query: BuilderQuery =
  ({ query }: { query: BuilderInnerQuery }): BuilderQueryResult => ({
    query,
    type: 'query',
  });
const builder: Builder = {
  mutation,
  query,
};

const injectEndpoints = jest.fn(
  ({ endpoints }: { endpoints: Endpoints }) => {
    const injected = endpoints(builder);

    return Object.fromEntries(
      Object
        .entries(injected)
        .map((tuple) => {
          const [originalKey, data] = tuple;
          const { query, type } = data;
          const suffix = type === 'query' ? 'Query' : 'Mutation';
          const key = `use${originalKey}${suffix}`;
          const fn = (arg?: unknown) => ({
            ...query(arg),
            type,
          });

          return [key, fn];
        })
    );
  }
);

export const api = { injectEndpoints };
