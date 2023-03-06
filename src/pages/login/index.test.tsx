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
} from '@api/test-helpers';
import { useRequest } from './request';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock('./request');

const mockRequest = useRequest as jest.MockedFunction<typeof useRequest>;
const request = jest.fn();

mockRequest.mockImplementation(() => [request, defaultResponse]);

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

      expect(request).toHaveBeenCalledWith(expectedParams);
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
