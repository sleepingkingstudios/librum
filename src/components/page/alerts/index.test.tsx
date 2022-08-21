import * as React from 'react';
import { v4 as generateUuid } from 'uuid';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { PageAlerts } from './index';
import { AlertsProvider } from '@alerts';
import type { Alert } from '@alerts';

describe('<Alerts />', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(
      <AlertsProvider>
        <PageAlerts />
      </AlertsProvider>,
      { router: true },
    );

    expect(asFragment()).toMatchSnapshot();
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
        type: 'failure',
        uuid: generateUuid(),
      },
    ];

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <AlertsProvider initialValue={alerts}>
          <PageAlerts />
        </AlertsProvider>,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
