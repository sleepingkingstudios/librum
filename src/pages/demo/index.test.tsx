import * as React from 'react';

import { DemoPage } from './index';
import { render } from '@test-helpers/rendering';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@core/navigation', () => require('@core/navigation/mocks'));

describe('<DemoPage />', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<DemoPage />);

    expect(asFragment()).toMatchSnapshot();
  });
});
