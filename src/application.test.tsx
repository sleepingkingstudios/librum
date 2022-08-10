import * as React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Application } from './application';

describe('<Application>', () => {
  it('should render the login page', () => {
    const { getByRole } = render(<Application />);

    expect(getByRole('button', { name: 'Log In' })).toBeVisible();
  });
});
