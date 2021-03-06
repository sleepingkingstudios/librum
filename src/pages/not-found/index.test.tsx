import * as React from 'react';

import '@testing-library/jest-dom';

import { NotFoundPage } from './index';
import { Page } from '@components/page';
import { render } from '@test-helpers/rendering';

jest.mock('@components/page');

const mockPage = Page as jest.MockedFunction<typeof Page>;

mockPage.mockImplementation(
  ({ children }) => (<div id="page">{ children }</div>)
);

describe('<NotFoundPage>', () => {
  const theme = {
    headerDanger: '@headerBase text-green-500',
    hrMuted: '@hrBase border-green-500',
    linkDanger: '@linkBase text-green-500',
    textDanger: '@textBase text-green-500',
  }

  it('should navigate back to the home page', () => {
    const { getByRole } = render(<NotFoundPage />, { router: true });
    const link = getByRole('link', { name: 'Turn Back' });

    expect(link).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <NotFoundPage />,
      {
        router: true,
        theme
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
