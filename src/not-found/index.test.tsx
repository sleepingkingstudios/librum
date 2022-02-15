import * as React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import { NotFoundPage } from './index';

describe('<NotFoundPage>', () => {
  it('should navigate back to the home page', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    const link = getByRole('link', { name: 'Turn Back' });

    expect(link).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(<NotFoundPage />, { wrapper: MemoryRouter });

    expect(asFragment()).toMatchSnapshot();
  });
});
