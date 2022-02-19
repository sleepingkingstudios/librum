import * as React from 'react';

import '@testing-library/jest-dom';

import { PageFooter } from './footer';
import { render } from '@test-helpers/rendering';

describe('<PageFooter>', () => {
  const theme = {
    textMuted: 'text-[#ff3366]',
  };

  it('should match the snapshot', () => {
    const { asFragment } = render(<PageFooter />, { theme });

    expect(asFragment()).toMatchSnapshot();
  });
});
