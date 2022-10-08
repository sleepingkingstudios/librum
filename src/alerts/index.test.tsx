import * as React from 'react';
import { map } from 'lodash';
import { v4 as generateUuid } from 'uuid';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { render } from '@test-helpers/rendering';
import { useAlerts } from './index';
import { AlertsProvider } from './provider';
import type {
  Alert,
  DismissAlert,
  DismissAllAlerts,
  DismissAllAlertsOptions,
  DisplayAlert,
  DisplayAlertProps,
} from './types';

interface IAlertsDisplay {
  dismiss?: string;
  dismissAll?: boolean;
  display?: DisplayAlertProps;
}

interface IRenderDismissAlertButton {
  dismissAlert: DismissAlert,
  uuid: string;
}

interface IRenderDismissAllAlertsButton {
  dismissAllAlerts: DismissAllAlerts,
  options: DismissAllAlertsOptions,
}

interface IRenderDisplayAlertButton {
  alert: DisplayAlertProps;
  displayAlert: DisplayAlert;
}

const renderAlert = (alert: Alert): JSX.Element => {
  const {
    message,
    uuid,
  } = alert;

  return (
    <li key={uuid}>{ message }</li>
  );
};

const renderDismissAlertButton = ({
  dismissAlert,
  uuid,
}: IRenderDismissAlertButton): JSX.Element => {
  if (uuid === null) { return null; }

  const onClick = () => { dismissAlert(uuid); }

  return (
    <button onClick={onClick}>Dismiss Alert</button>
  );
};

const renderDismissAllAlertsButton = ({
  dismissAllAlerts,
  options,
}: IRenderDismissAllAlertsButton): JSX.Element => {
  const onClick = () => { dismissAllAlerts(options); }

  return (
    <button onClick={onClick}>Dismiss All Alerts</button>
  );
};

const renderDisplayAlertButton = ({
  alert = null,
  displayAlert,
}: IRenderDisplayAlertButton) => {
  if (alert === null) { return null; }

  const onClick = () => { displayAlert(alert); }

  return (
    <button onClick={onClick}>Display Alert</button>
  );
}

const AlertsDisplay = ({
  dismiss = null,
  dismissAll = false,
  display = null,
}: IAlertsDisplay): JSX.Element => {
  const {
    alerts,
    dismissAlert,
    dismissAllAlerts,
    displayAlert,
  } = useAlerts();
  const options: DismissAllAlertsOptions = { removePersistent: dismissAll };

  return (
    <>
      { renderDismissAlertButton({ dismissAlert, uuid: dismiss }) }
      { renderDismissAllAlertsButton({ dismissAllAlerts, options }) }
      { renderDisplayAlertButton({ alert: display, displayAlert }) }
      <ul>
        { map(alerts, renderAlert) }
      </ul>
    </>
  );
};

describe('useAlerts', () => {
  it('should display an empty list', () => {
    const { queryAllByRole } = render(
      <AlertsProvider>
        <AlertsDisplay />
      </AlertsProvider>,
      { router: true },
    );

    const items = queryAllByRole('listitem');

    expect(items).toHaveLength(0);
  });

  describe('displaying an alert', () => {
    const props: DisplayAlertProps = {
      message: 'Attempting to connect to Moon base...',
    };

    it('should display the alert', async () => {
      const expected = [
        'Attempting to connect to Moon base...',
      ];
      const {
        getByRole,
        queryAllByRole,
      } = render(
        <AlertsProvider>
          <AlertsDisplay display={props} />
        </AlertsProvider>,
        { router: true },
      );

      const itemsBefore = queryAllByRole('listitem');

      expect(itemsBefore).toHaveLength(0);

      const button = getByRole('button', { name: 'Display Alert' });

      await userEvent.click(button);

      const itemsAfter = queryAllByRole('listitem');

      expect(itemsAfter).toHaveLength(1);

      expect(
        map(itemsAfter, (item: HTMLElement) => item.textContent)
      ).toEqual(expected);
    });
  });

  describe('when there are many alerts', () => {
    const alerts: Alert[] = [
      {
        dismissable: true,
        message: 'Successfully activated reactor',
        persistent: false,
        type: 'success',
        uuid: generateUuid(),
      },
      {
        dismissable: false,
        icon: faRadiation,
        message: 'Reactor overheat imminent',
        persistent: false,
        type: 'warning',
        uuid: generateUuid(),
      },
      {
        dismissable: false,
        message: 'Increase in three-eyed fish observed',
        persistent: true,
        type: 'info',
        uuid: generateUuid(),
      },
    ];

    it('should display the alerts', () => {
      const expected = [
        'Successfully activated reactor',
        'Reactor overheat imminent',
        'Increase in three-eyed fish observed',
      ];
      const { queryAllByRole } = render(
        <AlertsProvider initialValue={alerts}>
          <AlertsDisplay />
        </AlertsProvider>,
        { router: true },
      );

      const items = queryAllByRole('listitem');

      expect(items).toHaveLength(3);

      expect(
        map(items, (item: HTMLElement) => item.textContent)
      ).toEqual(expected);
    });

    describe('dismissing an alert', () => {
      it('should dismiss the alert', async () => {
        const expected = [
          'Successfully activated reactor',
          'Increase in three-eyed fish observed',
        ];
        const {
          getByRole,
          queryAllByRole,
        } = render(
          <AlertsProvider initialValue={alerts}>
            <AlertsDisplay dismiss={alerts[1].uuid} />
          </AlertsProvider>,
          { router: true },
        );

        const button = getByRole('button', { name: 'Dismiss Alert' });

        await userEvent.click(button);

        const items = queryAllByRole('listitem');

        expect(items).toHaveLength(2);

        expect(
          map(items, (item: HTMLElement) => item.textContent)
        ).toEqual(expected);
      });
    });

    describe('dismissing all alerts', () => {
      it('should dismiss all non-persistent alerts', async () => {
        const expected = [
          'Increase in three-eyed fish observed',
        ];
        const {
          getByRole,
          queryAllByRole,
        } = render(
          <AlertsProvider initialValue={alerts}>
            <AlertsDisplay dismissAll={false} />
          </AlertsProvider>,
          { router: true },
        );

        const button = getByRole('button', { name: 'Dismiss All Alerts' });

        await userEvent.click(button);

        const items = queryAllByRole('listitem');

        expect(items).toHaveLength(1);

        expect(
          map(items, (item: HTMLElement) => item.textContent)
        ).toEqual(expected);
      });

      describe('with removePersistent: true', () => {
        it('should dismiss all alerts', async () => {
          const {
            getByRole,
            queryAllByRole,
          } = render(
            <AlertsProvider initialValue={alerts}>
              <AlertsDisplay dismissAll={true} />
            </AlertsProvider>,
            { router: true },
          );

          const button = getByRole('button', { name: 'Dismiss All Alerts' });

          await userEvent.click(button);

          const items = queryAllByRole('listitem');

          expect(items).toHaveLength(0);
        });
      });
    });

    describe('displaying an alert', () => {
      const props: DisplayAlertProps = {
        message: 'Attempting to connect to Moon base...',
      };

      it('should display the alert', async () => {
        const expected = [
          'Successfully activated reactor',
          'Reactor overheat imminent',
          'Increase in three-eyed fish observed',
          'Attempting to connect to Moon base...',
        ];
        const {
          getByRole,
          queryAllByRole,
        } = render(
          <AlertsProvider initialValue={alerts}>
            <AlertsDisplay display={props} />
          </AlertsProvider>,
          { router: true },
        );

        const button = getByRole('button', { name: 'Display Alert' });

        await userEvent.click(button);

        const items = queryAllByRole('listitem');

        expect(items).toHaveLength(4);

        expect(
          map(items, (item: HTMLElement) => item.textContent)
        ).toEqual(expected);
      });
    });
  });
});
