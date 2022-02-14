import * as React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { PageFooter } from './footer';

describe('<PageFooter>', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<PageFooter />);

    expect(asFragment()).toMatchSnapshot();
  });
});
