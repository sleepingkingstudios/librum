import * as React from 'react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@test-helpers/rendering';

import { UserUpdatePasswordForm } from './form';
import {
  defaultResponse,
  loadingResponse,
  failureResponse,
  successResponse,
} from '@api/test-helpers';
import { useRequest } from './request';

jest.mock('./request');

const mockRequest = useRequest as jest.MockedFunction<typeof useRequest>;
const request = jest.fn();

mockRequest.mockImplementation(() => [request, defaultResponse]);

describe('<UserUpdatePasswordForm />', () => {
  const closeForm = jest.fn();

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
      const expectedParams = {
        oldPassword: 'tronlives',
        newPassword: 'ifightfortheusers',
        confirmPassword: 'ifightfortheusers',
      };

      await userEvent.type(getByLabelText('Old Password'), 'tronlives');

      await userEvent.type(getByLabelText('New Password'), 'ifightfortheusers');

      await userEvent.type(getByLabelText('Confirm Password'), 'ifightfortheusers');

      await userEvent.click(getByRole('button', { name: 'Update Password'}));

      expect(request).toHaveBeenCalledWith(expectedParams, expect.anything());
    });
  });

  describe('when the request is loading', () => {
    beforeEach(() => {
      mockRequest.mockImplementation(() => [request, loadingResponse]);
    })

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserUpdatePasswordForm closeForm={closeForm} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request returns a failure response', () => {
    beforeEach(() => {
      mockRequest.mockImplementation(() => [request, failureResponse]);
    })

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserUpdatePasswordForm closeForm={closeForm} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request returns a success response', () => {
    beforeEach(() => {
      mockRequest.mockImplementation(() => [request, successResponse]);
    })

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserUpdatePasswordForm closeForm={closeForm} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
