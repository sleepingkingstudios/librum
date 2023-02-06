import { applyWildcards } from './utils';

describe('API utils', () => {
  describe('applyWildcards()', () => {
    beforeEach(() => {
      jest
        .spyOn(console, 'log')
        .mockImplementation((): null => null);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should be a function', () => {
      expect(typeof applyWildcards).toBe('function');
    });

    describe('with url: undefined', () => {
      it('should return an empty string', () => {
        expect(applyWildcards({ url: undefined, wildcards: {} })).toBe('');
      });
    });

    describe('with url: null', () => {
      it('should return an empty string', () => {
        expect(applyWildcards({ url: null, wildcards: {} })).toBe('');
      });
    });

    describe('with url: an empty string', () => {
      it('should return an empty string', () => {
        expect(applyWildcards({ url: '', wildcards: {} })).toBe('');
      });
    });

    describe('with url: a string with no wildcards', () => {
      const url = '/path/to/resource';

      it('should return the url', () => {
        expect(applyWildcards({ url, wildcards: {} })).toEqual(url);
      });

      describe('with extra wildcards', () => {
        const wildcards = { key: 'value' };

        it('should return the url', () => {
          expect(applyWildcards({ url, wildcards })).toEqual(url);
        });
      });
    });

    describe('with url: a string with one wildcard', () => {
      const url = '/path/to/resource/:id';

      describe('with empty wildcards', () => {
        const wildcards = {};

        it('should throw an error', () => {
          const expected = `invalid wildcard ":id" in url "${url}"`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with mismatched wildcards', () => {
        const wildcards = { key: 'value' };

        it('should throw an error', () => {
          const expected =
            `invalid wildcard ":id" in url "${url}" - valid keys are :key`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with valid wildcards', () => {
        const wildcards = { id: '12345' };

        it('should apply the wildcards to the url', () => {
          const expected = `/path/to/resource/${wildcards.id}`;

          expect(applyWildcards({ url, wildcards })).toEqual(expected);
        });
      });

      describe('with extra wildcards', () => {
        const wildcards = { id: '12345', key: 'value' };

        it('should apply the wildcards to the url', () => {
          const expected = `/path/to/resource/${wildcards.id}`;

          expect(applyWildcards({ url, wildcards })).toEqual(expected);
        });
      });
    });

    describe('with url: a string with multiple wildcards', () => {
      const url = '/path/:namespace/resource/:id';

      describe('with empty wildcards', () => {
        const wildcards = {};

        it('should throw an error', () => {
          const expected = `invalid wildcard ":namespace" in url "${url}"`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with mismatched wildcards', () => {
        const wildcards = { key: 'value' };

        it('should throw an error', () => {
          const expected =
            `invalid wildcard ":namespace" in url "${url}" - valid keys are :key`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with partial wildcards', () => {
        const wildcards = { namespace: 'library' };

        it('should throw an error', () => {
          const expected =
            `invalid wildcard ":id" in url "${url}" - valid keys are :namespace`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with valid wildcards', () => {
        const wildcards = { id: '12345', namespace: 'library' };

        it('should apply the wildcards to the url', () => {
          const expected =
            `/path/${wildcards.namespace}/resource/${wildcards.id}`;

          expect(applyWildcards({ url, wildcards })).toEqual(expected);
        });
      });

      describe('with extra wildcards', () => {
        const wildcards = { id: '12345', key: 'value', namespace: 'library' };

        it('should apply the wildcards to the url', () => {
          const expected =
            `/path/${wildcards.namespace}/resource/${wildcards.id}`;

          expect(applyWildcards({ url, wildcards })).toEqual(expected);
        });
      });
    });
  });
});
