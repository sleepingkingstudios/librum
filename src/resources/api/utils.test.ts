import {
  generateBaseUrl,
  generateEndpointName,
  generateResourceUrl,
} from './utils';

describe('Resource API utils', () => {
  describe('generateBaseUrl()', () => {
    const resourceName = 'rareBooks';

    it('should be a function', () => {
      expect(typeof generateBaseUrl).toBe('function');
    });

    it('should generate the base url', () => {
      expect(generateBaseUrl({ resourceName })).toBe('rare_books');
    });

    describe('with scope: value', () => {
      const scope = 'lendingLibrary';

      it('should generate the base url', () => {
        expect(generateBaseUrl({ resourceName, scope }))
          .toBe('lending_library/rare_books');
      });
    });

    describe('with scope: multipart value', () => {
      const scope = 'lendingLibrary/collections';

      it('should generate the base url', () => {
        expect(generateBaseUrl({ resourceName, scope }))
          .toBe('lending_library/collections/rare_books');
      });
    });
  });

  describe('generateEndpointName()', () => {
    const resourceName = 'rareBooks';

    it('should be a function', () => {
      expect(typeof generateEndpointName).toBe('function');
    });

    describe('with a collection action', () => {
      const action = 'index';
      const member = false;

      it('should generate the endpoint name', () => {
        const expected = 'IndexRareBooks';
        const actual = generateEndpointName({
          action,
          member,
          resourceName,
        });

        expect(actual).toEqual(expected);
      });

      describe('with scope: value', () => {
        const scope = 'lendingLibrary';

        it('should generate the endpoint name', () => {
          const expected = 'LendingLibraryIndexRareBooks';
          const actual = generateEndpointName({
            action,
            member,
            scope,
            resourceName,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with scope: multipart value', () => {
        const scope = 'lendingLibrary/collections';

        it('should generate the endpoint name', () => {
          const expected = 'LendingLibraryCollectionsIndexRareBooks';
          const actual = generateEndpointName({
            action,
            member,
            scope,
            resourceName,
          });

          expect(actual).toEqual(expected);
        });
      });
    });

    describe('with a singular action', () => {
      const action = 'show';
      const member = true;

      it('should generate the endpoint name', () => {
        const expected = 'ShowRareBook';
        const actual = generateEndpointName({
          action,
          member,
          resourceName,
        });

        expect(actual).toEqual(expected);
      });

      describe('with singularName: value', () => {
        const singularName = 'rareTome';

        it('should generate the endpoint name', () => {
          const expected = 'ShowRareTome';
          const actual = generateEndpointName({
            action,
            member,
            resourceName,
            singularName,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with scope: value', () => {
        const scope = 'lendingLibrary';

        it('should generate the endpoint name', () => {
          const expected = 'LendingLibraryShowRareBook';
          const actual = generateEndpointName({
            action,
            member,
            scope,
            resourceName,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with scope: multipart value', () => {
        const scope = 'lendingLibrary/collections';

        it('should generate the endpoint name', () => {
          const expected = 'LendingLibraryCollectionsShowRareBook';
          const actual = generateEndpointName({
            action,
            member,
            scope,
            resourceName,
          });

          expect(actual).toEqual(expected);
        });
      });
    });
  });

  describe('generateResourceUrl()', () => {
    const resourceName = 'rareBooks';

    it('should be a function', () => {
      expect(typeof generateResourceUrl).toBe('function');
    });

    describe('with a collection action', () => {
      const action = 'published';
      const member = false;

      it('should generate the resource url', () => {
        const expected = 'rare_books/published';
        const actual = generateResourceUrl({
          action,
          member,
          resourceName,
        });

        expect(actual).toEqual(expected);
      });

      describe('with baseUrl: value', () => {
        const baseUrl = 'path/to/rare_tomes';

        it('should generate the resource url', () => {
          const expected = 'path/to/rare_tomes/published';
          const actual = generateResourceUrl({
            action,
            baseUrl,
            member,
            resourceName,
          });

          expect(actual).toEqual(expected);
        });

        describe('with scope: value', () => {
          const scope = 'lendingLibrary';

          it('should generate the resource url', () => {
            const expected = 'path/to/rare_tomes/published';
            const actual = generateResourceUrl({
              action,
              baseUrl,
              member,
              resourceName,
              scope,
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with url: a relative url', () => {
          const url = 'find_published';

          it('should generate the resource url', () => {
            const expected = 'path/to/rare_tomes/find_published';
            const actual = generateResourceUrl({
              action,
              baseUrl,
              member,
              resourceName,
              url,
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with url: an absolute url', () => {
          const url = '/resources/published/rare_books';

          it('should generate the resource url', () => {
            const expected = 'resources/published/rare_books';
            const actual = generateResourceUrl({
              action,
              baseUrl,
              member,
              resourceName,
              url,
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with url: an empty string', () => {
          const url = '';

          it('should generate the resource url', () => {
            const expected = 'path/to/rare_tomes';
            const actual = generateResourceUrl({
              action,
              baseUrl,
              member,
              resourceName,
              url,
            });

            expect(actual).toEqual(expected);
          });
        });
      });

      describe('with scope: value', () => {
        const scope = 'lendingLibrary';

        it('should generate the resource url', () => {
          const expected = 'lending_library/rare_books/published';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            scope,
          });

          expect(actual).toEqual(expected);
        });

        describe('with url: a relative url', () => {
          const url = 'find_published';

          it('should generate the resource url', () => {
            const expected = 'lending_library/rare_books/find_published';
            const actual = generateResourceUrl({
              action,
              member,
              resourceName,
              scope,
              url,
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with url: an absolute url', () => {
          const url = '/published/rare_books';

          it('should generate the resource url', () => {
            const expected = 'published/rare_books';
            const actual = generateResourceUrl({
              action,
              member,
              resourceName,
              scope,
              url,
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with url: an empty string', () => {
          const url = '';

          it('should generate the resource url', () => {
            const expected = 'lending_library/rare_books';
            const actual = generateResourceUrl({
              action,
              member,
              resourceName,
              scope,
              url,
            });

            expect(actual).toEqual(expected);
          });
        });
      });

      describe('with scope: multipart value', () => {
        const scope = 'lendingLibrary/collections';

        it('should generate the resource url', () => {
          const expected = 'lending_library/collections/rare_books/published';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            scope,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with url: a relative url', () => {
        const url = 'findPublished';

        it('should generate the resource url', () => {
          const expected = 'rare_books/findPublished';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            url,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with url: an absolute url', () => {
        const url = '/published/rare_books';

        it('should generate the resource url', () => {
          const expected = 'published/rare_books';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            url,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with url: an empty string', () => {
        const url = '';

        it('should generate the resource url', () => {
          const expected = 'rare_books';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            url,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with wildcards: value', () => {
        const wildcards = { authorId: 'clausewitz', otherParameter: 'value' };

        it('should generate the resource url', () => {
          const expected = 'rare_books/published';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            wildcards,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with wildcards: invalid value', () => {
        const url = '/published/:namespace/rare_books';
        const wildcards = {
          authorId: 'clausewitz',
          otherParameter: 'value'
        };

        beforeEach(() => {
          jest
            .spyOn(console, 'log')
            .mockImplementation((): null => null);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should throw an error', () => {
          const expected =
            'invalid wildcard ":namespace" in url ' +
            '"published/:namespace/rare_books" - valid keys are :authorId, ' +
            ':otherParameter';

          expect(
            () => generateResourceUrl({
              action,
              member,
              resourceName,
              url,
              wildcards,
            })
          ).toThrow(expected);
        });
      });

      describe('with wildcards: valid value', () => {
        const url = '/published/:namespace/rare_books';
        const wildcards = {
          authorId: 'clausewitz',
          namespace: 'military-theory',
          otherParameter: 'value'
        };

        it('should generate the resource url', () => {
          const expected = 'published/military-theory/rare_books';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            url,
            wildcards,
          });

          expect(actual).toEqual(expected);
        });
      });
    });

    describe('with a member action', () => {
      const action = 'publish';
      const member = true;
      const wildcards = { id: 'on-war' };

      it('should generate the resource url', () => {
        const expected = 'rare_books/on-war/publish';
        const actual = generateResourceUrl({
          action,
          member,
          resourceName,
          wildcards,
        });

        expect(actual).toEqual(expected);
      });

      describe('with baseUrl: value', () => {
        const baseUrl = 'path/to/rare_tomes';

        it('should generate the resource url', () => {
          const expected = 'path/to/rare_tomes/on-war/publish';
          const actual = generateResourceUrl({
            action,
            baseUrl,
            member,
            resourceName,
            wildcards,
          });

          expect(actual).toEqual(expected);
        });

        describe('with scope: value', () => {
          const scope = 'lendingLibrary';

          it('should generate the resource url', () => {
            const expected = 'path/to/rare_tomes/on-war/publish';
            const actual = generateResourceUrl({
              action,
              baseUrl,
              member,
              resourceName,
              scope,
              wildcards,
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with url: a relative url', () => {
          const url = ':id/publish_book';

          it('should generate the resource url', () => {
            const expected = 'path/to/rare_tomes/on-war/publish_book';
            const actual = generateResourceUrl({
              action,
              baseUrl,
              member,
              resourceName,
              url,
              wildcards,
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with url: an absolute url', () => {
          const url = '/resources/publish/:id/rare_books';

          it('should generate the resource url', () => {
            const expected = 'resources/publish/on-war/rare_books';
            const actual = generateResourceUrl({
              action,
              baseUrl,
              member,
              resourceName,
              url,
              wildcards,
            });

            expect(actual).toEqual(expected);
          });
        });
      });

      describe('with scope: value', () => {
        const scope = 'lendingLibrary';

        it('should generate the resource url', () => {
          const expected = 'lending_library/rare_books/on-war/publish';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            scope,
            wildcards,
          });

          expect(actual).toEqual(expected);
        });

        describe('with url: a relative url', () => {
          const url = ':id/publish_book';

          it('should generate the resource url', () => {
            const expected = 'lending_library/rare_books/on-war/publish_book';
            const actual = generateResourceUrl({
              action,
              member,
              resourceName,
              scope,
              url,
              wildcards,
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with url: an absolute url', () => {
          const url = '/resources/publish/:id/rare_books';

          it('should generate the resource url', () => {
            const expected = 'resources/publish/on-war/rare_books';
            const actual = generateResourceUrl({
              action,
              member,
              resourceName,
              scope,
              url,
              wildcards,
            });

            expect(actual).toEqual(expected);
          });
        });
      });

      describe('with scope: multipart value', () => {
        const scope = 'lendingLibrary/collections';

        it('should generate the resource url', () => {
          const expected =
            'lending_library/collections/rare_books/on-war/publish';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            scope,
            wildcards,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with url: a relative url', () => {
        const url = ':id/publish_book';

        it('should generate the resource url', () => {
          const expected = 'rare_books/on-war/publish_book';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            url,
            wildcards,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with url: an absolute url', () => {
        const url = '/resources/publish/:id/rare_books';

        it('should generate the resource url', () => {
          const expected = 'resources/publish/on-war/rare_books';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            url,
            wildcards,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with wildcards: invalid value', () => {
        const url = '/published/:namespace/rare_books/:id';
        const invalidWildcards = {
          authorId: 'clausewitz',
          id: 'on-war',
          otherParameter: 'value'
        };

        beforeEach(() => {
          jest
            .spyOn(console, 'log')
            .mockImplementation((): null => null);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should throw an error', () => {
          const expected =
            'invalid wildcard ":namespace" in url ' +
            '"published/:namespace/rare_books/:id" - valid keys are ' +
            ':authorId, :id, :otherParameter';

          expect(
            () => generateResourceUrl({
              action,
              member,
              resourceName,
              url,
              wildcards: invalidWildcards,
            })
          ).toThrow(expected);
        });
      });

      describe('with wildcards: missing value', () => {
        beforeEach(() => {
          jest
            .spyOn(console, 'log')
            .mockImplementation((): null => null);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('should throw an error', () => {
          const expected =
            'invalid wildcard ":id" in url "rare_books/:id/publish"';

          expect(
            () => generateResourceUrl({
              action,
              member,
              resourceName,
            })
          ).toThrow(expected);
        });
      });

      describe('with wildcards: valid value', () => {
        const url = '/published/:namespace/rare_books/:id';
        const validWildcards = {
          authorId: 'clausewitz',
          id: 'on-war',
          namespace: 'military-theory',
          otherParameter: 'value'
        };

        it('should generate the resource url', () => {
          const expected = 'published/military-theory/rare_books/on-war';
          const actual = generateResourceUrl({
            action,
            member,
            resourceName,
            url,
            wildcards: validWildcards,
          });

          expect(actual).toEqual(expected);
        });
      });
    });
  });
});
