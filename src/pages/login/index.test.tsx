import * as React from 'react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@test-helpers/rendering';

import { LoginPage } from './index';
import { responseWithStatus } from '@api';
import type {
  Refetch,
  Response,
} from '@api';
import { useLoginRequest } from './request';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock('./request');

const mockUseLoginRequest =
  useLoginRequest as jest.MockedFunction<typeof useLoginRequest>;

describe('<LoginPage>', () => {
  const refetch: jest.MockedFunction<Refetch> = jest.fn();
  const response: Response = responseWithStatus({ status: 'uninitialized' });

  beforeEach(() => {
    mockUseLoginRequest
      .mockClear()
      .mockImplementation(() => [response, refetch]);
  });

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
    beforeEach(() => {
      refetch.mockImplementation(
        () => new Promise(resolve => resolve(response))
      );
    })

    it('should submit the form', async () => {
      const { getByLabelText, getByRole } = render(<LoginPage />);
      const expected = {
        body: {
          username: 'Alan Bradley',
          password: 'tronlives',
        }
      };

      await userEvent.type(getByLabelText('Username'), 'Alan Bradley');

      await userEvent.type(getByLabelText('Password'), 'tronlives');

      await userEvent.click(getByRole('button', { name: 'Log In'}));

      expect(refetch).toHaveBeenCalledWith(expected);
    });
  });

  describe('when the request is loading', () => {
    const loadingResponse: Response = responseWithStatus({ status: 'loading' });

    beforeEach(() => {
      mockUseLoginRequest.mockImplementation(() => [loadingResponse, refetch]);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<LoginPage />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request returns a failure response', () => {
    const failureResponse: Response = responseWithStatus({ status: 'failure' });

    beforeEach(() => {
      mockUseLoginRequest.mockImplementation(() => [failureResponse, refetch]);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<LoginPage />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request returns a successful response', () => {
    const successResponse: Response = responseWithStatus({ status: 'success' });

    beforeEach(() => {
      mockUseLoginRequest.mockImplementation(() => [successResponse, refetch]);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<LoginPage />);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
