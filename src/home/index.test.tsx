import * as React from 'react';

import '@testing-library/jest-dom';

import { HomePage } from './index';
import { Page } from '@components/page';
import { render } from '@test-helpers/rendering';

jest.mock('@components/page');

const mockPage = Page as jest.MockedFunction<typeof Page>;

mockPage.mockImplementation(
  ({ children }) => (<div id="page">{ children }</div>)
);

describe('<HomePage>', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<HomePage />);

    expect(asFragment()).toMatchSnapshot();
  });
});
