import * as React from 'react';

import '@testing-library/jest-dom';

import { PageFooter } from './index';
import { render } from '@test-helpers/rendering';

describe('<PageFooter>', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<PageFooter />);

    expect(asFragment()).toMatchSnapshot();
  });
});
