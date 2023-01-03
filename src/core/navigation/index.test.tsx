import * as React from 'react';

import '@testing-library/jest-dom';

import { CoreNavigation } from './index';
import { Page } from '@components/page';
import { render } from '@test-helpers/rendering';

jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock(
  '@components/page/navigation',
  () => require('@components/page/navigation/mocks'),
);

const PageWithNavigation = () => (
  <Page navigation={<CoreNavigation />}>
    This space unintentionally left blank.
  </Page>
);

describe('<CoreNavigation />', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(
      <PageWithNavigation />,
      { router: true },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
