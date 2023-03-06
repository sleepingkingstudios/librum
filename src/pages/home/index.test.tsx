import * as React from 'react';

import '@testing-library/jest-dom';

import { HomePage } from './index';
import { render } from '@test-helpers/rendering';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@core/navigation', () => require('@core/navigation/mocks'));

describe('<HomePage>', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<HomePage />);

    expect(asFragment()).toMatchSnapshot();
  });
});
