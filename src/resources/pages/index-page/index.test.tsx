import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceIndexPage } from './index';
import type { ResourcePageOptions } from '@resources/components/page';
import { render } from '@test-helpers/rendering';
import { MockTable } from './mocks';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('./contents', () => require('@resources/pages/index-page/mocks'));

describe('<ResourceIndexPage />', () => {
  const action = 'index';
  const member = false;
  const page: ResourcePageOptions = { member };
  const resourceName = 'rareBooks';

  const renderIndexPage = () => render(
    <ResourceIndexPage
      Table={MockTable}
      action={action}
      page={page}
      resourceName={resourceName}
    />,
    {
      router: true,
      store: true,
    },
  );

  it('should render the contents', () => {
    const { getByText } = renderIndexPage();

    const table = getByText('There are 3 books!');

    expect(table).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = renderIndexPage();

    expect(asFragment()).toMatchSnapshot();
  });
});
