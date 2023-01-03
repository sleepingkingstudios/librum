import * as React from 'react';

import { DemoPage } from './index';
import { render } from '@test-helpers/rendering';

jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock('@core/navigation', () => require('@core/navigation/mocks'));

describe('<DemoPage />', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<DemoPage />);

    expect(asFragment()).toMatchSnapshot();
  });
});
