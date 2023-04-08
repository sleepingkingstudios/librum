import * as React from 'react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@test-helpers/rendering';

import { UserUpdatePasswordForm } from './form';
import { responseWithStatus } from '@api';
import type { Refetch } from '@api';
import { useUpdateUserPasswordRequest } from './request';

jest.mock('./request');

const mockUseRequest =
  useUpdateUserPasswordRequest as jest.MockedFunction<typeof useUpdateUserPasswordRequest>;

describe('<UserUpdatePasswordForm />', () => {
  const closeForm = jest.fn();
  const response = responseWithStatus({ status: 'uninitialized' });
  const performRequest: jest.MockedFunction<Refetch> = jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (options) => new Promise(resolve => resolve(response))
  );

  beforeEach(() => {
    mockUseRequest.mockClear();

    mockUseRequest.mockImplementation(() => [response, performRequest]);
  });

  it('should render the form', () => {
    const { getByRole } = render(
      <UserUpdatePasswordForm closeForm={closeForm} />,
    );
    const submit = getByRole('button', { name: 'Update Password' });

    expect(submit).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <UserUpdatePasswordForm closeForm={closeForm} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the user clicks the "Update Password" button', () => {
    it('should submit the form', async () => {
      const { getByLabelText, getByRole } = render(
        <UserUpdatePasswordForm closeForm={closeForm} />,
      );
      const expected = {
        body: {
          oldPassword: 'tronlives',
          newPassword: 'ifightfortheusers',
          confirmPassword: 'ifightfortheusers',
        },
      };

      await userEvent.type(getByLabelText('Old Password'), 'tronlives');

      await userEvent.type(getByLabelText('New Password'), 'ifightfortheusers');

      await userEvent.type(
        getByLabelText('Confirm Password'),
        'ifightfortheusers',
      );

      await userEvent.click(getByRole('button', { name: 'Update Password'}));

      expect(performRequest).toHaveBeenCalledWith(expected);
    });
  });

  describe('when the request is loading', () => {
    const loadingResponse = responseWithStatus({ status: 'loading' });

    beforeEach(() => {
      mockUseRequest.mockImplementation(
        () => [loadingResponse, performRequest],
      );
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserUpdatePasswordForm closeForm={closeForm} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request returns a failure response', () => {
    const failureResponse = responseWithStatus({ status: 'failure' });

    beforeEach(() => {
      mockUseRequest.mockImplementation(
        () => [failureResponse, performRequest],
      );
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserUpdatePasswordForm closeForm={closeForm} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request returns a success response', () => {
    const successResponse = responseWithStatus({ status: 'success' });

    beforeEach(() => {
      mockUseRequest.mockImplementation(
        () => [successResponse, performRequest],
      );
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserUpdatePasswordForm closeForm={closeForm} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
