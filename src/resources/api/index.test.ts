import { generateResourcesApi } from './index';
import type {
  ResourceApiParams,
  ResourceEndpointDefinition,
} from './types';

jest.mock('@api');

describe('Resource API', () => {
  describe('generateResourcesApi()', () => {
    const shouldGenerateTheStandardActions = ({
      expectedUrl,
      extraEndpoints = [],
      index = true,
      options,
      wildcards,
    }: {
      expectedUrl: string,
      extraEndpoints?: string[],
      options?: ResourceApiParams,
      index?: 'skip' | boolean,
      wildcards?: Record<string, string>,
    }): void => {
      it('should generate the resources API endpoints', () => {
        const api = generateResourcesApi(options);
        const expected = [...extraEndpoints];

        if (index) { expected.push('useIndexResources'); }

        expect(Object.keys(api)).toHaveLength(expected.length);

        expected.forEach((key: string): void => {
          expect(key in api).toBe(true);
        });
      });

      if (index && index !== 'skip') {
        it('should generate the index resources API', () => {
          const api = generateResourcesApi(options);
          const expected = {
            method: 'GET',
            type: 'query',
            url: expectedUrl,
          };

          expect('useIndexResources' in api).toBe(true);
          expect(api.useIndexResources({ wildcards })).toEqual(expected);
        });
      }
    }

    const resourceName = 'rareBooks';
    const id = 'on-war';

    it('should be a function', () => {
      expect(typeof generateResourcesApi).toBe('function');
    });

    shouldGenerateTheStandardActions({
      expectedUrl: 'rare_books',
      options: { resourceName },
    });

    describe('with additional endpoints', () => {
      const endpoints = {
        publish: {
          member: true,
          method: 'PUT',
        },
        published: {
          member: false,
          method: 'GET',
        },
      };

      shouldGenerateTheStandardActions({
        expectedUrl: 'rare_books',
        extraEndpoints: ['usePublishResource', 'usePublishedResources'],
        options: { endpoints, resourceName },
      });

      it('should generate the publish resource API', () => {
        const api = generateResourcesApi({ endpoints, resourceName });
        const wildcards = { id };
        const expected = {
          method: 'PUT',
          type: 'mutation',
          url: `rare_books/${wildcards.id}/publish`,
        };

        expect('usePublishResource' in api).toBe(true);
        expect(api.usePublishResource({ wildcards })).toEqual(expected);
      });

      it('should generate the published resources API', () => {
        const api = generateResourcesApi({ endpoints, resourceName });
        const expected = {
          method: 'GET',
          type: 'query',
          url: 'rare_books/published',
        };

        expect('usePublishedResources' in api).toBe(true);
        expect(api.usePublishedResources()).toEqual(expected);
      });
    });

    describe('with baseUrl: value', () => {
      const baseUrl = 'namespaces/:namespace/rare_books';
      const wildcards = { namespace: 'library' };

      shouldGenerateTheStandardActions({
        expectedUrl: `namespaces/${wildcards.namespace}/rare_books`,
        options: { baseUrl, resourceName },
        wildcards,
      });
    });

    describe('with endpoints: { index: false }', () => {
      const endpoints: Record<string, false | ResourceEndpointDefinition> = {
        index: false,
      };

      shouldGenerateTheStandardActions({
        expectedUrl: 'rare_books',
        index: false,
        options: { endpoints, resourceName },
      });
    });

    describe('with endpoints: { index: value }', () => {
      const endpoints: Record<string, false | ResourceEndpointDefinition> = {
        index: {
          method: 'GET',
          member: false,
          url: '/:namespace/rare_books',
        },
      };

      shouldGenerateTheStandardActions({
        expectedUrl: 'rare_books',
        index: 'skip',
        options: { endpoints, resourceName },
      });

      it('should generate the index resources API', () => {
        const api = generateResourcesApi({ endpoints, resourceName });
        const wildcards = { namespace: 'library' };
        const expected = {
          method: 'GET',
          type: 'query',
          url: 'library/rare_books',
        };

        expect('useIndexResources' in api).toBe(true);
        expect(api.useIndexResources({ wildcards })).toEqual(expected);
      });
    });

    describe('with scope: value', () => {
      const scope = 'lendingLibrary';

      shouldGenerateTheStandardActions({
        expectedUrl: 'lending_library/rare_books',
        options: { resourceName, scope },
      });
    });
  });
});