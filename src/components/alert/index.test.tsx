import * as React from 'react';
import { v4 as generateUuid } from 'uuid';
import { faSatelliteDish } from '@fortawesome/free-solid-svg-icons';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@test-helpers/rendering';

import { Alert } from './index';
import { useAlerts as mockUseAlerts } from '@alerts/mocks';
import type { Alert as IAlert } from '@alerts';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@alerts', () => require('@alerts/mocks'));

const { dismissAlert } = mockUseAlerts();

describe('<Alert />', () => {
  const alert: IAlert = {
    dismissable: false,
    message: 'Attempting to connect to Moon base...',
    persistent: false,
    type: 'info',
    uuid: generateUuid(),
  };

  beforeEach(() => { dismissAlert.mockClear(); });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <Alert alert={alert} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the alert is dismissable', () => {
    const dismissableAlert: IAlert = {
      ...alert,
      dismissable: true,
    }

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Alert alert={dismissableAlert} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('dismissing the alert', () => {
      it('should dismiss the alert', async () => {
        const { uuid } = dismissableAlert;
        const { getByRole } = render(
          <Alert alert={dismissableAlert} />
        );

        const button = getByRole('button');

        expect(button).toBeVisible();

        await userEvent.click(button);

        expect(dismissAlert).toHaveBeenCalledWith(uuid);
      });
    });
  });

  describe('when the alert has an icon', () => {
    const alertWithIcon: IAlert = {
      ...alert,
      icon: faSatelliteDish,
    };

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Alert alert={alertWithIcon} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the alert type is "failure"', () => {
    const failureAlert: IAlert = {
      ...alert,
      type: 'failure',
    };

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Alert alert={failureAlert} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the alert has an icon', () => {
      const alertWithIcon: IAlert = {
        ...failureAlert,
        icon: faSatelliteDish,
      };

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Alert alert={alertWithIcon} />
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('when the alert type is "success"', () => {
    const successAlert: IAlert = {
      ...alert,
      type: 'success',
    };

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Alert alert={successAlert} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the alert has an icon', () => {
      const alertWithIcon: IAlert = {
        ...successAlert,
        icon: faSatelliteDish,
      };

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Alert alert={alertWithIcon} />
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('when the alert type is "warning"', () => {
    const warningAlert: IAlert = {
      ...alert,
      type: 'warning',
    };

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Alert alert={warningAlert} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the alert has an icon', () => {
      const alertWithIcon: IAlert = {
        ...warningAlert,
        icon: faSatelliteDish,
      };

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Alert alert={alertWithIcon} />
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
