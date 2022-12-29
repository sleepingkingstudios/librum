import { injectEndpoint } from './endpoint';

jest.mock('@api');

describe('Resource API', () => {
  describe('injectEndpoint()', () => {
    const resourceName = 'rareBooks';

    it('should be a function', () => {
      expect(typeof injectEndpoint).toBe('function');
    });

    describe('with a collection mutation', () => {
      const action = 'create';
      const endpoint = {
        member: false,
        method: 'post',
      };

      it('should generate the resource query', () => {
        const endpoints = injectEndpoint({
          action,
          endpoint,
          resourceName,
        });
        const expected = {
          method: 'POST',
          type: 'mutation',
          url: 'rare_books/create',
        };

        expect('useCreateResources' in endpoints).toBe(true);

        const { useCreateResources } = endpoints;

        expect(typeof useCreateResources).toBe('function');
        expect(useCreateResources()).toEqual(expected);
      });

      describe('with an empty object', () => {
        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint,
            resourceName,
          });
          const expected = {
            method: 'POST',
            type: 'mutation',
            url: 'rare_books/create',
          };

          expect('useCreateResources' in endpoints).toBe(true);

          const { useCreateResources } = endpoints;

          expect(typeof useCreateResources).toBe('function');
          expect(useCreateResources({})).toEqual(expected);
        });
      });

      describe('with query params', () => {
        const params = { validate: 'false' };

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint,
            resourceName,
          });
          const expected = {
            method: 'POST',
            params,
            type: 'mutation',
            url: 'rare_books/create',
          };

          expect('useCreateResources' in endpoints).toBe(true);

          const { useCreateResources } = endpoints;

          expect(typeof useCreateResources).toBe('function');
          expect(useCreateResources({ params })).toEqual(expected);
        });
      });

      describe('with request body', () => {
        const body = { author: 'Clausewitz' };

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint,
            resourceName,
          });
          const expected = {
            body,
            method: 'POST',
            type: 'mutation',
            url: 'rare_books/create',
          };

          expect('useCreateResources' in endpoints).toBe(true);

          const { useCreateResources } = endpoints;

          expect(typeof useCreateResources).toBe('function');
          expect(useCreateResources({ body })).toEqual(expected);
        });
      });

      describe('with url wildcards', () => {
        const wildcards = { namespace: 'library' };
        const url = '/rare_books/:namespace/create';

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint: { ...endpoint, url },
            resourceName,
          });
          const expected = {
            method: 'POST',
            type: 'mutation',
            url: `rare_books/${wildcards.namespace}/create`,
          };

          expect('useCreateResources' in endpoints).toBe(true);

          const { useCreateResources } = endpoints;

          expect(typeof useCreateResources).toBe('function');
          expect(useCreateResources({ wildcards })).toEqual(expected);
        });
      });
    });

    describe('with a collection query', () => {
      const action = 'published';
      const endpoint = {
        member: false,
        method: 'get',
      };

      it('should generate the resource query', () => {
        const endpoints = injectEndpoint({
          action,
          endpoint,
          resourceName,
        });
        const expected = {
          method: 'GET',
          type: 'query',
          url: 'rare_books/published',
        };

        expect('usePublishedResources' in endpoints).toBe(true);

        const { usePublishedResources } = endpoints;

        expect(typeof usePublishedResources).toBe('function');
        expect(usePublishedResources()).toEqual(expected);
      });

      describe('with an empty object', () => {
        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint,
            resourceName,
          });
          const expected = {
            method: 'GET',
            type: 'query',
            url: 'rare_books/published',
          };

          expect('usePublishedResources' in endpoints).toBe(true);

          const { usePublishedResources } = endpoints;

          expect(typeof usePublishedResources).toBe('function');
          expect(usePublishedResources({})).toEqual(expected);
        });
      });

      describe('with query params', () => {
        const params = { order: 'title[desc]' };

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint,
            resourceName,
          });
          const expected = {
            method: 'GET',
            params,
            type: 'query',
            url: 'rare_books/published',
          };

          expect('usePublishedResources' in endpoints).toBe(true);

          const { usePublishedResources } = endpoints;

          expect(typeof usePublishedResources).toBe('function');
          expect(usePublishedResources({ params })).toEqual(expected);
        });
      });

      describe('with url wildcards', () => {
        const wildcards = { namespace: 'library' };
        const url = '/rare_books/:namespace/published';

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint: { ...endpoint, url },
            resourceName,
          });
          const expected = {
            method: 'GET',
            type: 'query',
            url: 'rare_books/library/published',
          };

          expect('usePublishedResources' in endpoints).toBe(true);

          const { usePublishedResources } = endpoints;

          expect(typeof usePublishedResources).toBe('function');
          expect(usePublishedResources({ wildcards })).toEqual(expected);
        });
      });
    });

    describe('with a member mutation', () => {
      const action = 'publish';
      const endpoint = {
        member: true,
        method: 'put',
      };

      it('should generate the resource query', () => {
        const endpoints = injectEndpoint({
          action,
          endpoint,
          resourceName,
        });
        const wildcards = { id: 'on-war' };
        const expected = {
          method: 'PUT',
          type: 'mutation',
          url: `rare_books/${wildcards.id}/publish`,
        };

        expect('usePublishResource' in endpoints).toBe(true);

        const { usePublishResource } = endpoints;

        expect(typeof usePublishResource).toBe('function');
        expect(usePublishResource({ wildcards })).toEqual(expected);
      });

      describe('with query params', () => {
        const params = { include: 'author' };
        const wildcards = { id: 'on-war' };

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint,
            resourceName,
          });
          const expected = {
            method: 'PUT',
            params,
            type: 'mutation',
            url: `rare_books/${wildcards.id}/publish`,
          };

          expect('usePublishResource' in endpoints).toBe(true);

          const { usePublishResource } = endpoints;

          expect(typeof usePublishResource).toBe('function');
          expect(usePublishResource({ params, wildcards })).toEqual(expected);
        });
      });

      describe('with request body', () => {
        const body = { author: 'Clausewitz' };
        const wildcards = { id: 'on-war' };

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint,
            resourceName,
          });
          const expected = {
            body,
            method: 'PUT',
            type: 'mutation',
            url: `rare_books/${wildcards.id}/publish`,
          };

          expect('usePublishResource' in endpoints).toBe(true);

          const { usePublishResource } = endpoints;

          expect(typeof usePublishResource).toBe('function');
          expect(usePublishResource({ body, wildcards })).toEqual(expected);
        });
      });

      describe('with url wildcards', () => {
        const wildcards = { id: 'on-war', namespace: 'library' };
        const url = '/rare_books/:namespace/:id/publish';

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint: { ...endpoint, url },
            resourceName,
          });
          const expected = {
            method: 'PUT',
            type: 'mutation',
            url: `rare_books/${wildcards.namespace}/${wildcards.id}/publish`,
          };

          expect('usePublishResource' in endpoints).toBe(true);

          const { usePublishResource } = endpoints;

          expect(typeof usePublishResource).toBe('function');
          expect(usePublishResource({ wildcards })).toEqual(expected);
        });
      });
    });

    describe('with a member query', () => {
      const action = 'show';
      const endpoint = {
        member: true,
        method: 'get',
      };

      it('should generate the resource query', () => {
        const endpoints = injectEndpoint({
          action,
          endpoint,
          resourceName,
        });
        const wildcards = { id: 'on-war' };
        const expected = {
          method: 'GET',
          type: 'query',
          url: `rare_books/${wildcards.id}/show`,
        };

        expect('useShowResource' in endpoints).toBe(true);

        const { useShowResource } = endpoints;

        expect(typeof useShowResource).toBe('function');
        expect(useShowResource({ wildcards })).toEqual(expected);
      });

      describe('with query params', () => {
        const params = { include: 'author' };
        const wildcards = { id: 'on-war' };

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint,
            resourceName,
          });
          const expected = {
            method: 'GET',
            params,
            type: 'query',
            url: `rare_books/${wildcards.id}/show`,
          };

          expect('useShowResource' in endpoints).toBe(true);

          const { useShowResource } = endpoints;

          expect(typeof useShowResource).toBe('function');
          expect(useShowResource({ params, wildcards }))
            .toEqual(expected);
        });
      });

      describe('with url wildcards', () => {
        const wildcards = { id: 'on-war', namespace: 'library' };
        const url = '/rare_books/:namespace/:id/show';

        it('should generate the resource query', () => {
          const endpoints = injectEndpoint({
            action,
            endpoint: { ...endpoint, url },
            resourceName,
          });
          const expected = {
            method: 'GET',
            type: 'query',
            url: `rare_books/${wildcards.namespace}/${wildcards.id}/show`,
          };

          expect('useShowResource' in endpoints).toBe(true);

          const { useShowResource } = endpoints;

          expect(typeof useShowResource).toBe('function');
          expect(useShowResource({ wildcards }))
            .toEqual(expected);
        });
      });
    });
  });
});
