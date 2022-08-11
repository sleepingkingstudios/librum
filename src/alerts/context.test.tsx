import * as React from 'react';
import { map } from 'lodash';
import { v4 as generateUuid } from 'uuid';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AlertsContext } from './context';
import type {
  Alert,
  DisplayAlertProps,
} from './types';

interface IAlertsDisplay {
  dismiss?: string;
  dismissAll?: boolean;
  display?: DisplayAlertProps;
}

const renderAlert = (alert: Alert): JSX.Element => {
  const { uuid } = alert;

  return (
    <li key={uuid}>Alert: { JSON.stringify(alert) }</li>
  );
};

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
  } = React.useContext(AlertsContext);

  if (dismiss !== null) {
    dismissAlert(dismiss);
  }

  if (dismissAll) {
    dismissAllAlerts();
  }

  if (display) {
    displayAlert(display);
  }

  return (
    <ul>
      { map(alerts, renderAlert) }
    </ul>
  );
};

describe('AlertsContext', () => {
  it('should display an empty list', () => {
    const { queryAllByRole } = render(<AlertsDisplay />);

    const items = queryAllByRole('listitem');

    expect(items).toHaveLength(0);
  });

  describe('with a provider', () => {
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
    ];

    it('should display the provided alerts', () => {
      const context = {
        alerts,
        dismissAlert: jest.fn(),
        dismissAllAlerts: jest.fn(),
        displayAlert: jest.fn(),
      };

      const { queryAllByRole } = render(
        <AlertsContext.Provider value={context}>
          <AlertsDisplay />
        </AlertsContext.Provider>
      );

      const items = queryAllByRole('listitem');

      expect(items).toHaveLength(2);
    });

    it('should return the dismiss alert helper', () => {
      const { uuid } = alerts[1];
      const dismissAlert = jest.fn();

      const context = {
        alerts,
        dismissAlert,
        dismissAllAlerts: jest.fn(),
        displayAlert: jest.fn(),
      };

      render(
        <AlertsContext.Provider value={context}>
          <AlertsDisplay dismiss={uuid} />
        </AlertsContext.Provider>
      );

      expect(dismissAlert).toHaveBeenCalledWith(uuid);
    });

    it('should return the dismiss all alerts helper', () => {
      const dismissAllAlerts = jest.fn();

      const context = {
        alerts,
        dismissAlert: jest.fn(),
        dismissAllAlerts,
        displayAlert: jest.fn(),
      };

      render(
        <AlertsContext.Provider value={context}>
          <AlertsDisplay dismissAll />
        </AlertsContext.Provider>
      );

      expect(dismissAllAlerts).toHaveBeenCalled();
    });

    it('should return the display alert helper', () => {
      const alert: DisplayAlertProps = {
        message: 'Evacuate? In our moment of triumph?',
        type: 'failure',
      }
      const displayAlert = jest.fn();

      const context = {
        alerts,
        dismissAlert: jest.fn(),
        dismissAllAlerts: jest.fn(),
        displayAlert,
      };

      render(
        <AlertsContext.Provider value={context}>
          <AlertsDisplay display={alert} />
        </AlertsContext.Provider>
      );

      expect(displayAlert).toHaveBeenCalledWith(alert);
    });
  });
});
