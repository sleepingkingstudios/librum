import { v4 as generateUuid } from 'uuid';
import { faSatelliteDish } from '@fortawesome/free-solid-svg-icons';

import {
  addAlert,
  removeAlert,
  removeAllAlerts,
} from './utils';
import type {
  Alert,
  DisplayAlertProps,
} from './types';

const fixtures: Alert[] = [
  {
    dismissable: true,
    message: 'Successfully activated reactor',
    persistent: false,
    type: 'success',
    uuid: generateUuid(),
  },
  {
    context: 'engineering:thermal',
    dismissable: false,
    message: 'Reactor overheat imminent',
    persistent: false,
    type: 'warning',
    uuid: generateUuid(),
  },
  {
    context: 'science:observations',
    dismissable: false,
    message: 'Increase in three-eyed fish observed',
    persistent: true,
    type: 'info',
    uuid: generateUuid(),
  },
];

describe('Alerts utils', () => {
  describe('addAlert()', () => {
    describe('with default props', () => {
      const alerts: Alert[] = [];
      const props: DisplayAlertProps = {
        message: 'Attempting to connect to Moon base...',
      };

      it('should add the alert to alerts', () => {
        const values: Alert[] = addAlert(alerts, props);
        const alert: Alert = values.pop();
        const {
          dismissable,
          icon,
          message,
          persistent,
          type,
          uuid,
        } = alert;

        expect(values).toEqual(alerts);
        expect(dismissable).toBe(true);
        expect(icon).toBeUndefined();
        expect(message).toEqual(props.message);
        expect(persistent).toBe(false);
        expect(type).toBe('info');
        expect(typeof uuid).toBe('string');
      });
    });

    describe('with context: value', () => {
      const alerts: Alert[] = [];
      const props: DisplayAlertProps = {
        context: 'space:communications',
        message: 'Attempting to connect to Moon base...',
      };

      it('should add the alert to alerts', () => {
        const values: Alert[] = addAlert(alerts, props);
        const alert: Alert = values.pop();
        const {
          context,
          dismissable,
          icon,
          message,
          persistent,
          type,
          uuid,
        } = alert;

        expect(values).toEqual(alerts);
        expect(context).toEqual(props.context);
        expect(dismissable).toBe(true);
        expect(icon).toBeUndefined();
        expect(message).toEqual(props.message);
        expect(persistent).toBe(false);
        expect(type).toBe('info');
        expect(typeof uuid).toBe('string');
      });
    });

    describe('with dismissable: false', () => {
      const alerts: Alert[] = [];
      const props: DisplayAlertProps = {
        dismissable: false,
        message: 'Attempting to connect to Moon base...',
      };

      it('should add the alert to alerts', () => {
        const values: Alert[] = addAlert(alerts, props);
        const alert: Alert = values.pop();
        const {
          dismissable,
          icon,
          message,
          persistent,
          type,
          uuid,
        } = alert;

        expect(values).toEqual(alerts);
        expect(dismissable).toBe(props.dismissable);
        expect(icon).toBeUndefined();
        expect(message).toEqual(props.message);
        expect(persistent).toBe(false);
        expect(type).toBe('info');
        expect(typeof uuid).toBe('string');
      });
    });

    describe('with icon: value', () => {
      const alerts: Alert[] = [];
      const props: DisplayAlertProps = {
        icon: faSatelliteDish,
        message: 'Attempting to connect to Moon base...',
      };

      it('should add the alert to alerts', () => {
        const values: Alert[] = addAlert(alerts, props);
        const alert: Alert = values.pop();
        const {
          dismissable,
          icon,
          message,
          persistent,
          type,
          uuid,
        } = alert;

        expect(values).toEqual(alerts);
        expect(dismissable).toBe(true);
        expect(icon).toEqual(props.icon);
        expect(message).toEqual(props.message);
        expect(persistent).toBe(false);
        expect(type).toBe('info');
        expect(typeof uuid).toBe('string');
      });
    });

    describe('with persistent: true', () => {
      const alerts: Alert[] = [];
      const props: DisplayAlertProps = {
        message: 'Attempting to connect to Moon base...',
        persistent: true,
      };

      it('should add the alert to alerts', () => {
        const values: Alert[] = addAlert(alerts, props);
        const alert: Alert = values.pop();
        const {
          dismissable,
          icon,
          message,
          persistent,
          type,
          uuid,
        } = alert;

        expect(values).toEqual(alerts);
        expect(dismissable).toBe(true);
        expect(icon).toBeUndefined();
        expect(message).toEqual(props.message);
        expect(persistent).toBe(props.persistent);
        expect(type).toBe('info');
        expect(typeof uuid).toBe('string');
      });
    });

    describe('with type: value', () => {
      const alerts: Alert[] = [];
      const props: DisplayAlertProps = {
        message: 'Attempting to connect to Moon base...',
        type: 'failure',
      };

      it('should add the alert to alerts', () => {
        const values: Alert[] = addAlert(alerts, props);
        const alert: Alert = values.pop();
        const {
          dismissable,
          icon,
          message,
          persistent,
          type,
          uuid,
        } = alert;

        expect(values).toEqual(alerts);
        expect(dismissable).toBe(true);
        expect(icon).toBeUndefined();
        expect(message).toEqual(props.message);
        expect(persistent).toBe(false);
        expect(type).toBe(props.type);
        expect(typeof uuid).toBe('string');
      });
    });

    describe('when there are many alerts', () => {
      describe('with default props', () => {
        const alerts: Alert[] = fixtures;
        const props: DisplayAlertProps = {
          message: 'Attempting to connect to Moon base...',
        };

        it('should add the alert to alerts', () => {
          const values: Alert[] = addAlert(alerts, props);

          const alert: Alert = values.pop();
          const {
            dismissable,
            icon,
            message,
            persistent,
            type,
            uuid,
          } = alert;

          expect(values).toEqual(alerts);
          expect(dismissable).toBe(true);
          expect(icon).toBeUndefined();
          expect(message).toEqual(props.message);
          expect(persistent).toBe(false);
          expect(type).toBe('info');
          expect(typeof uuid).toBe('string');
        });
      });

      describe('with context: value', () => {
        const alerts: Alert[] = fixtures;
        const props: DisplayAlertProps = {
          context: 'engineering:thermal',
          message: 'Sub-zero temperatures detected outside',
        };
        const expected = [alerts[0], alerts[2]];

        describe('when there is an existing alert with that context', () => {
          it('should remove the previous alert and add the alert to alerts', () => {
            const values: Alert[] = addAlert(alerts, props);

            const alert: Alert = values.pop();
            const {
              dismissable,
              icon,
              message,
              persistent,
              type,
              uuid,
            } = alert;

            expect(values).toEqual(expected);
            expect(dismissable).toBe(true);
            expect(icon).toBeUndefined();
            expect(message).toEqual(props.message);
            expect(persistent).toBe(false);
            expect(type).toBe('info');
            expect(typeof uuid).toBe('string');
          });
        });
      });
    });
  });

  describe('removeAlert()', () => {
    describe('when there are no alerts', () => {
      const alerts: Alert[] = [];

      describe('with a context', () => {
        const context = 'space:theFinalFrontier';

        it('should return the alerts', () => {
          expect(removeAlert(alerts, context)).toEqual(alerts);
        });
      });

      describe('with a uuid', () => {
        const uuid = generateUuid();

        it('should return the alerts', () => {
          expect(removeAlert(alerts, uuid)).toEqual(alerts);
        });
      });
    });

    describe('when there are many alerts', () => {
      const alerts: Alert[] = fixtures;

      describe('with a context that does not match any alerts', () => {
        const context = 'space:theFinalFrontier';

        it('should return the alerts', () => {
          expect(removeAlert(alerts, context)).toEqual(alerts);
        });
      });

      describe('with a context matches an alert', () => {
        const context = 'science:observations';
        const expected = [alerts[0], alerts[1]];

        it('should return the non-matching alerts', () => {
          expect(removeAlert(alerts, context)).toEqual(expected);
        });
      });

      describe('with a uuid that does not match an alert', () => {
        const uuid = generateUuid();

        it('should return the alerts', () => {
          expect(removeAlert(alerts, uuid)).toEqual(alerts);
        });
      });

      describe('with a uuid that matches an alert', () => {
        const { uuid } = alerts[1];
        const expected = [alerts[0], alerts[2]];

        it('should return the non-matching alerts', () => {
          expect(removeAlert(alerts, uuid)).toEqual(expected);
        });
      });
    });
  });

  describe('removeAllAlerts()', () => {
    describe('when there are no alerts', () => {
      const alerts: Alert[] = [];

      it('should return the alerts', () => {
        expect(removeAllAlerts(alerts)).toEqual(alerts);
      });
    });

    describe('when there are many alerts', () => {
      const alerts: Alert[] = fixtures;
      const expected = [alerts[2]];

      it('should return the persistent alerts', () => {
        expect(removeAllAlerts(alerts)).toEqual(expected);
      });

      describe('with removePersistent: true', () => {
        const removePersistent = true;

        it('should return an empty array', () => {
          expect(removeAllAlerts(alerts, { removePersistent }))
            .toEqual([]);
        });
      });
    });
  });
});
