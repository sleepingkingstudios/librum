import { generateAlerts } from './effects';
import type { DisplayAlertProps } from '@alerts';
import type { AlertDirective } from '@api/effects/display-alerts';

describe('Resource API effects', () => {
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
          context: 'resources:rareBooks:request',
          message: 'Unable to publish rare books',
          type: 'failure',
        };
        const successAlert: DisplayAlertProps = {
          context: 'resources:rareBooks:request',
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

      describe('with scope: value', () => {
        const scope = 'library';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:request',
            message: 'Unable to publish rare books',
            type: 'failure',
          };
          const successAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:request',
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
          context: 'resources:rareBooks:request',
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
        ];

        expect(generateAlerts({
          action,
          member,
          query,
          resourceName,
        })).toEqual(expected);
      });

      describe('with scope: value', () => {
        const scope = 'library';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:request',
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
          context: 'resources:rareBooks:request',
          message: 'Unable to publish rare book',
          type: 'failure',
        };
        const successAlert: DisplayAlertProps = {
          context: 'resources:rareBooks:request',
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

      describe('with scope: value', () => {
        const scope = 'library';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:request',
            message: 'Unable to publish rare book',
            type: 'failure',
          };
          const successAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:request',
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
            context: 'resources:rareBooks:request',
            message: 'Unable to publish unique book',
            type: 'failure',
          };
          const successAlert: DisplayAlertProps = {
            context: 'resources:rareBooks:request',
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
          context: 'resources:rareBooks:request',
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
        ];

        expect(generateAlerts({
          action,
          member,
          query,
          resourceName,
        })).toEqual(expected);
      });

      describe('with scope: value', () => {
        const scope = 'library';

        it('should generate the alert directives', () => {
          const failureAlert: DisplayAlertProps = {
            context: 'resources:library:rareBooks:request',
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
            context: 'resources:rareBooks:request',
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
});
