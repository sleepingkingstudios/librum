import * as React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FancyHr } from './index';

describe('<FancyHr>', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<FancyHr />);

    expect(asFragment()).toMatchSnapshot();
  });

  test.todo('@todo');
});
