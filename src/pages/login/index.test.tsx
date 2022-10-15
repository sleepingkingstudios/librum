import * as React from 'react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@test-helpers/rendering';

import { LoginPage } from './index';
import {
  defaultResponse,
  loadingResponse,
  failureResponse,
  successResponse,
} from '@api/hooks/test-helpers';
import { Page } from '@components/page';
import { useRequest } from './request';

jest.mock('@components/page');
jest.mock('./request');

const mockPage = Page as jest.MockedFunction<typeof Page>;
const mockRequest = useRequest as jest.MockedFunction<typeof useRequest>;
const request = jest.fn();

mockRequest.mockImplementation(() => [request, defaultResponse]);
mockPage.mockImplementation(
  ({ children }) => (<div id="page">{ children }</div>)
);

describe('<LoginPage>', () => {
  it('should render the form', () => {
    const { getByRole } = render(<LoginPage />);
    const submit = getByRole('button', { name: 'Log In' });

    expect(submit).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(<LoginPage />);

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the user clicks the "Log In" button', () => {
    it('should submit the form', async () => {
      const { getByLabelText, getByRole } = render(<LoginPage />);
      const expectedParams = {
        username: 'Alan Bradley',
        password: 'tronlives',
      };

      await userEvent.type(getByLabelText('Username'), 'Alan Bradley');

      await userEvent.type(getByLabelText('Password'), 'tronlives');

      await userEvent.click(getByRole('button', { name: 'Log In'}));

      expect(request).toHaveBeenCalledWith(expectedParams, expect.anything());
    });
  });

  describe('when the request is loading', () => {
    beforeEach(() => {
      mockRequest.mockImplementation(() => [request, loadingResponse]);
    })

    it('should match the snapshot', () => {
      const { asFragment } = render(<LoginPage />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request returns a failure response', () => {
    beforeEach(() => {
      mockRequest.mockImplementation(() => [request, failureResponse]);
    })

    it('should match the snapshot', () => {
      const { asFragment } = render(<LoginPage />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request returns a successful response', () => {
    beforeEach(() => {
      mockRequest.mockImplementation(() => [request, successResponse]);
    })

    it('should match the snapshot', () => {
      const { asFragment } = render(<LoginPage />);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
