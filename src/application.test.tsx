import * as React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Application } from './application';

describe('<Application>', () => {
  it('should be poetry', () => {
    render(<Application />);

    const poetry = screen.getByText(/Which is life, and which the dream\?/);

    expect(poetry).toBeVisible();
  });
});
