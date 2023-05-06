import { configuredRouteFor } from './utils';

describe('<ResourcesRoutes /> utils', () => {
  describe('configuredRouteFor()', () => {
    const resourceName = 'rareBooks';

    it('should be a function', () => {
      expect(typeof configuredRouteFor).toBe('function');
    });

    it('should generate the resource route', () => {
      expect(configuredRouteFor({ resourceName })).toBe('/rare-books');
    });

    describe('with route: an empty string', () => {
      const route = '';

      it('should generate the resource route', () => {
        expect(configuredRouteFor({ resourceName, route })).toBe('/rare-books');
      });
    });

    describe('with route: absolute value', () => {
      const route = '/custom/resource/path';

      it('should return the configured route', () => {
        expect(configuredRouteFor({ resourceName, route })).toEqual(route);
      });
    });

    describe('with route: relative value', () => {
      const route = 'custom/resource/path';

      it('should return the configured route', () => {
        expect(configuredRouteFor({ resourceName, route })).toBe(`/${route}`);
      });
    });

    describe('with scope: value', () => {
      const scope = 'lendingLibrary';

      it('should generate the resource route', () => {
        const expected = '/lending-library/rare-books';

        expect(configuredRouteFor({ resourceName, scope })).toEqual(expected);
      });
    });
  });
});
