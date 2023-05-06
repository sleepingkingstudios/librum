import {
  generateAlertContext,
  generateAlerts,
  generateUrl,
} from './utils';
import type { DisplayAlertProps } from '@alerts';
import type { AlertDirective } from '@api';

describe('Resources API hooks utils', () => {
  describe('generateAlertContext', () => {
    const action = 'publish';
    const resourceName = 'rareBooks';

    it('should be a function', () => {
      expect(typeof generateAlertContext).toBe('function');
    });

    it('should generate the alert context', () => {
      const expected = 'resources:rareBooks:publish:request';

      expect(generateAlertContext({ action, resourceName })).toEqual(expected);
    });

    describe('with scope: an empty string', () => {
      const scope = '';

      it('should generate the alert context', () => {
        const expected = 'resources:rareBooks:publish:request';

        expect(
          generateAlertContext({ action, resourceName, scope })
        ).toEqual(expected);
      });
    });

    describe('with scope: value', () => {
      const scope = 'lendingLibrary';

      it('should generate the alert context', () => {
        const expected = 'resources:lendingLibrary:rareBooks:publish:request';

        expect(
          generateAlertContext({ action, resourceName, scope })
        ).toEqual(expected);
      });
    });

    describe('with scope: multipart value', () => {
      const scope = 'lendingLibrary/collections';

      it('should generate the alert context', () => {
        const expected =
          'resources:lendingLibrary:collections:rareBooks:publish:request';

        expect(
          generateAlertContext({ action, resourceName, scope })
        ).toEqual(expected);
      });
    });
  });

  describe('generateAlerts()', () => {
    const action = 'publish';
    const resourceName = 'rareBooks';

    it('should be a function', () => {
      expect(typeof generateAlerts).toBe('function');
    });

    describe('with member: false and query: false', () => {
      const member = false;
      const query = false;

      it('should generate the alert directives', () => {
        const failureAlert: DisplayAlertProps = {
          context: 'resources:rareBooks:publish:request',
          message: 'Unable to publish rare books',
          type: 'failure',
        };
        const successAlert: DisplayAlertProps = {
          context: 'resources:rareBooks:publish:request',
          message: 'Successfully published rare books',
          type: 'success',
        };
        const expected: AlertDirective[] = [
          {
            display: failureAlert,
            status: 'errored',
          },
          {
            display: failureAlert,
            status: 'failure',
          },
          {
            display: successAlert,
            status: 'success',
          },
        ];

        expect(generateAlerts({
          action,
          member,
          query,
          resourceName,
        })).toEqual(expected);
      });

      describe('with alerts: value', () => {
        const alerts: AlertDirective[] = [{
          display: { message: 'Powering up reactor...' },
          status: 'success',
        }];

        it('should return the configured alert directives', () => {
          expect(generateAlerts({
            action,
            alerts,
            member,
            query,
            resourceName,
          })).toEqual(alerts);
        });
      });

      describe('with scope: value', () => {
        const scope = 'library';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:publish:request',
            message: 'Unable to publish rare books',
            type: 'failure',
          };
          const successAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:publish:request',
            message: 'Successfully published rare books',
            type: 'success',
          };
          const expected: AlertDirective[] = [
            {
              display: failureAlert,
              status: 'errored',
            },
            {
              display: failureAlert,
              status: 'failure',
            },
            {
              display: successAlert,
              status: 'success',
            },
          ];

          expect(generateAlerts({
            action,
            member,
            query,
            resourceName,
            scope,
          })).toEqual(expected);
        });
      });
    });

    describe('with member: false and query: true', () => {
      const member = false;
      const query = true;

      it('should generate the alert directives', () => {
        const failureAlert: DisplayAlertProps = {
          context: 'resources:rareBooks:publish:request',
          message: 'Unable to publish rare books',
          type: 'failure',
        };
        const expected: AlertDirective[] = [
          {
            display: failureAlert,
            status: 'errored',
          },
          {
            display: failureAlert,
            status: 'failure',
          },
          {
            dismiss: failureAlert.context,
            status: 'success',
          },
        ];

        expect(generateAlerts({
          action,
          member,
          query,
          resourceName,
        })).toEqual(expected);
      });

      describe('with alerts: value', () => {
        const alerts: AlertDirective[] = [{
          display: { message: 'Powering up reactor...' },
          status: 'success',
        }];

        it('should return the configured alert directives', () => {
          expect(generateAlerts({
            action,
            alerts,
            member,
            query,
            resourceName,
          })).toEqual(alerts);
        });
      });

      describe('with scope: value', () => {
        const scope = 'library';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:publish:request',
            message: 'Unable to publish rare books',
            type: 'failure',
          };
          const expected: AlertDirective[] = [
            {
              display: failureAlert,
              status: 'errored',
            },
            {
              display: failureAlert,
              status: 'failure',
            },
            {
              dismiss: failureAlert.context,
              status: 'success',
            },
          ];

          expect(generateAlerts({
            action,
            member,
            query,
            resourceName,
            scope,
          })).toEqual(expected);
        });
      });
    });

    describe('with member: true and query: false', () => {
      const member = true;
      const query = false;

      it('should generate the alert directives', () => {
        const failureAlert: DisplayAlertProps = {
          context: 'resources:rareBooks:publish:request',
          message: 'Unable to publish rare book',
          type: 'failure',
        };
        const successAlert: DisplayAlertProps = {
          context: 'resources:rareBooks:publish:request',
          message: 'Successfully published rare book',
          type: 'success',
        };
        const expected: AlertDirective[] = [
          {
            display: failureAlert,
            status: 'errored',
          },
          {
            display: failureAlert,
            status: 'failure',
          },
          {
            display: successAlert,
            status: 'success',
          },
        ];

        expect(generateAlerts({
          action,
          member,
          query,
          resourceName,
        })).toEqual(expected);
      });

      describe('with alerts: value', () => {
        const alerts: AlertDirective[] = [{
          display: { message: 'Powering up reactor...' },
          status: 'success',
        }];

        it('should return the configured alert directives', () => {
          expect(generateAlerts({
            action,
            alerts,
            member,
            query,
            resourceName,
          })).toEqual(alerts);
        });
      });

      describe('with scope: value', () => {
        const scope = 'library';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:publish:request',
            message: 'Unable to publish rare book',
            type: 'failure',
          };
          const successAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:publish:request',
            message: 'Successfully published rare book',
            type: 'success',
          };
          const expected: AlertDirective[] = [
            {
              display: failureAlert,
              status: 'errored',
            },
            {
              display: failureAlert,
              status: 'failure',
            },
            {
              display: successAlert,
              status: 'success',
            },
          ];

          expect(generateAlerts({
            action,
            member,
            query,
            resourceName,
            scope,
          })).toEqual(expected);
        });
      });

      describe('with singularName: value', () => {
        const singularName = 'uniqueBook';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:rareBooks:publish:request',
            message: 'Unable to publish unique book',
            type: 'failure',
          };
          const successAlert: DisplayAlertProps = {
            context: 'resources:rareBooks:publish:request',
            message: 'Successfully published unique book',
            type: 'success',
          };
          const expected: AlertDirective[] = [
            {
              display: failureAlert,
              status: 'errored',
            },
            {
              display: failureAlert,
              status: 'failure',
            },
            {
              display: successAlert,
              status: 'success',
            },
          ];

          expect(generateAlerts({
            action,
            member,
            query,
            resourceName,
            singularName,
          })).toEqual(expected);
        });
      });
    });

    describe('with member: true and query: true', () => {
      const member = true;
      const query = true;

      it('should generate the alert directives', () => {
        const failureAlert: DisplayAlertProps = {
          context: 'resources:rareBooks:publish:request',
          message: 'Unable to publish rare book',
          type: 'failure',
        };
        const expected: AlertDirective[] = [
          {
            display: failureAlert,
            status: 'errored',
          },
          {
            display: failureAlert,
            status: 'failure',
          },
          {
            dismiss: failureAlert.context,
            status: 'success',
          },
        ];

        expect(generateAlerts({
          action,
          member,
          query,
          resourceName,
        })).toEqual(expected);
      });

      describe('with alerts: value', () => {
        const alerts: AlertDirective[] = [{
          display: { message: 'Powering up reactor...' },
          status: 'success',
        }];

        it('should return the configured alert directives', () => {
          expect(generateAlerts({
            action,
            alerts,
            member,
            query,
            resourceName,
          })).toEqual(alerts);
        });
      });

      describe('with scope: value', () => {
        const scope = 'library';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:publish:request',
            message: 'Unable to publish rare book',
            type: 'failure',
          };
          const expected: AlertDirective[] = [
            {
              display: failureAlert,
              status: 'errored',
            },
            {
              display: failureAlert,
              status: 'failure',
            },
            {
              dismiss: failureAlert.context,
              status: 'success',
            },
          ];

          expect(generateAlerts({
            action,
            member,
            query,
            resourceName,
            scope,
          })).toEqual(expected);
        });
      });

      describe('with singularName: value', () => {
        const singularName = 'uniqueBook';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:rareBooks:publish:request',
            message: 'Unable to publish unique book',
            type: 'failure',
          };
          const expected: AlertDirective[] = [
            {
              display: failureAlert,
              status: 'errored',
            },
            {
              display: failureAlert,
              status: 'failure',
            },
            {
              dismiss: failureAlert.context,
              status: 'success',
            },
          ];

          expect(generateAlerts({
            action,
            member,
            query,
            resourceName,
            singularName,
          })).toEqual(expected);
        });
      });
    });
  });

  describe('generateUrl()', () => {
    const resourceName = 'rareBooks';

    it('should be a function', () => {
      expect(typeof generateUrl).toBe('function');
    });

    describe('with a collection action', () => {
      const action = 'published';
      const member = false;

      it('should generate the resource url', () => {
        const expected = '/api/rare_books/published';
        const actual = generateUrl({
          action,
          member,
          resourceName,
        });

        expect(actual).toEqual(expected);
      });

      describe('with baseUrl: value', () => {
        const baseUrl = 'path/to/rare_tomes';

        it('should generate the resource url', () => {
          const expected = '/path/to/rare_tomes/published';
          const actual = generateUrl({
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
            const expected = '/path/to/rare_tomes/published';
            const actual = generateUrl({
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
            const expected = '/path/to/rare_tomes/find_published';
            const actual = generateUrl({
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
            const expected = '/resources/published/rare_books';
            const actual = generateUrl({
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
            const expected = '/path/to/rare_tomes';
            const actual = generateUrl({
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
          const expected = '/api/lending_library/rare_books/published';
          const actual = generateUrl({
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
            const expected = '/api/lending_library/rare_books/find_published';
            const actual = generateUrl({
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
            const expected = '/published/rare_books';
            const actual = generateUrl({
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
            const expected = '/api/lending_library/rare_books';
            const actual = generateUrl({
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
          const expected =
            '/api/lending_library/collections/rare_books/published';
          const actual = generateUrl({
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
          const expected = '/api/rare_books/findPublished';
          const actual = generateUrl({
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
          const expected = '/published/rare_books';
          const actual = generateUrl({
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
          const expected = '/api/rare_books';
          const actual = generateUrl({
            action,
            member,
            resourceName,
            url,
          });

          expect(actual).toEqual(expected);
        });
      });
    });

    describe('with a member action', () => {
      const action = 'publish';
      const member = true;

      it('should generate the resource url', () => {
        const expected = '/api/rare_books/:rareBookId/publish';
        const actual = generateUrl({
          action,
          member,
          resourceName,
        });

        expect(actual).toEqual(expected);
      });

      describe('with baseUrl: value', () => {
        const baseUrl = 'path/to/rare_tomes';

        it('should generate the resource url', () => {
          const expected = '/path/to/rare_tomes/:rareBookId/publish';
          const actual = generateUrl({
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
            const expected = '/path/to/rare_tomes/:rareBookId/publish';
            const actual = generateUrl({
              action,
              baseUrl,
              member,
              resourceName,
              scope,
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with singularName: value', () => {
          const singularName = 'rareTome';

          it('should generate the resource url', () => {
            const expected = '/path/to/rare_tomes/:rareTomeId/publish';
            const actual = generateUrl({
              action,
              baseUrl,
              member,
              resourceName,
              singularName
            });

            expect(actual).toEqual(expected);
          });
        });

        describe('with url: a relative url', () => {
          const url = ':rareBookId/publish_book';

          it('should generate the resource url', () => {
            const expected = '/path/to/rare_tomes/:rareBookId/publish_book';
            const actual = generateUrl({
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
          const url = '/resources/publish/:rareBookId/rare_books';

          it('should generate the resource url', () => {
            const expected = '/resources/publish/:rareBookId/rare_books';
            const actual = generateUrl({
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
          const expected =
            '/api/lending_library/rare_books/:rareBookId/publish';
          const actual = generateUrl({
            action,
            member,
            resourceName,
            scope,
          });

          expect(actual).toEqual(expected);
        });

        describe('with url: a relative url', () => {
          const url = ':id/publish_book';

          it('should generate the resource url', () => {
            const expected = '/api/lending_library/rare_books/:id/publish_book';
            const actual = generateUrl({
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
          const url = '/resources/publish/:id/rare_books';

          it('should generate the resource url', () => {
            const expected = '/resources/publish/:id/rare_books';
            const actual = generateUrl({
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
          const expected =
            '/api/lending_library/collections/rare_books/:rareBookId/publish';
          const actual = generateUrl({
            action,
            member,
            resourceName,
            scope,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with singularName: value', () => {
        const singularName = 'rareTome';

        it('should generate the resource url', () => {
          const expected = '/api/rare_books/:rareTomeId/publish';
          const actual = generateUrl({
            action,
            member,
            resourceName,
            singularName,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with url: a relative url', () => {
        const url = ':rareBookId/publish_book';

        it('should generate the resource url', () => {
          const expected = '/api/rare_books/:rareBookId/publish_book';
          const actual = generateUrl({
            action,
            member,
            resourceName,
            url,
          });

          expect(actual).toEqual(expected);
        });
      });

      describe('with url: an absolute url', () => {
        const url = '/resources/publish/:rareBookId/rare_books';

        it('should generate the resource url', () => {
          const expected = '/resources/publish/:rareBookId/rare_books';
          const actual = generateUrl({
            action,
            member,
            resourceName,
            url,
          });

          expect(actual).toEqual(expected);
        });
      });
    });
  });
});
