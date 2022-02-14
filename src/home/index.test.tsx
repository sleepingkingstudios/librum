import * as React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { HomePage } from './index';

describe('<HomePage>', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<HomePage />);

    expect(asFragment()).toMatchSnapshot();
  });
});
