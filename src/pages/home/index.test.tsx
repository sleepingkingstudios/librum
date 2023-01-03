import * as React from 'react';

import '@testing-library/jest-dom';

import { HomePage } from './index';
import { render } from '@test-helpers/rendering';

jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock('@core/navigation', () => require('@core/navigation/mocks'));

describe('<HomePage>', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<HomePage />);

    expect(asFragment()).toMatchSnapshot();
  });
});
