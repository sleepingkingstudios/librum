import * as React from 'react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@test-helpers/rendering';

import { UserUpdatePasswordForm } from './form';
import type {
  Mutation,
  MutationStatus,
  UseRequest,
} from '@api';
import {
  useMutation,
  useRequest,
} from './request';

jest.mock('@user/password/api');
jest.mock('./request');

const mockMutation = useMutation as jest.MockedFunction<Mutation>;
const mockRequest = useRequest as jest.MockedFunction<UseRequest>;
const mutation = jest.fn();
const mutationStatus: MutationStatus = { isLoading: false };
const request = jest.fn();

mockMutation.mockImplementation(
  () => [mutation, mutationStatus],
);

mockRequest.mockImplementation(() => request);

type anyMockedFunction = jest.MockedFunction<() => unknown>;

describe('<UserUpdatePasswordForm />', () => {
  const closeForm = jest.fn();

  it('should render the form', () => {
    const { getByRole } = render(
      <UserUpdatePasswordForm closeForm={closeForm} />,
      { store: true }
    );
    const submit = getByRole('button', { name: 'Update Password' });

    expect(submit).toBeVisible();
  });

  it('should initialize the request', () => {
    const options = {
      closeForm,
      destroySession: expect.any(Function) as anyMockedFunction,
      dispatch: expect.any(Function) as anyMockedFunction,
      displayAlert: expect.any(Function) as anyMockedFunction,
      setItem: expect.any(Function) as anyMockedFunction,
    };

    render(
      <UserUpdatePasswordForm closeForm={closeForm} />,
      { store: true }
    );

    expect(useRequest).toHaveBeenCalledWith({
      mutation,
      options,
    });
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <UserUpdatePasswordForm closeForm={closeForm} />,
      { store: true }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the user submits the form', () => {
    it('should call the request', async () => {
      const { getByLabelText, getByRole } = render(
        <UserUpdatePasswordForm closeForm={closeForm} />,
        { store: true }
      );
      const expected = {
        oldPassword: 'tronlives',
        newPassword: 'ifightfortheusers',
        confirmPassword: 'ifightfortheusers'
      };

      await userEvent.type(getByLabelText('Old Password'), 'tronlives');

      await userEvent.type(getByLabelText('New Password'), 'ifightfortheusers');

      await userEvent.type(getByLabelText('Confirm Password'), 'ifightfortheusers');

      await userEvent.click(getByRole('button', { name: 'Update Password'}));

      expect(request).toHaveBeenCalledWith(expected, expect.anything());
    });
  });
});
