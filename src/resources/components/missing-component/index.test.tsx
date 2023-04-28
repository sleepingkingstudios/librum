import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceMissingComponent } from './index';
import { render } from '@test-helpers/rendering';

describe('<ResourceMissingComponent />', () => {
  const name = 'Widget';

  it('should match the snapshot', () => {
    const { asFragment } = render(<ResourceMissingComponent name={name} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
