import * as React from 'react';

import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@test-helpers/rendering';

import { LoginPage } from './index';
import type {
  Mutation,
  MutationStatus,
  UseRequest,
} from '@api';
import { Page } from '@components/page';
import {
  useMutation,
  useRequest,
} from './request';

jest.mock('@components/page');
jest.mock('@session/api');
jest.mock('./request');

const mockMutation = useMutation as jest.MockedFunction<Mutation>;
const mockPage = Page as jest.MockedFunction<typeof Page>;
const mockRequest = useRequest as jest.MockedFunction<UseRequest>;
const mutation = jest.fn();
const mutationStatus: MutationStatus = { isLoading: false };
const request = jest.fn();

mockMutation.mockImplementation(
  () => [mutation, mutationStatus],
);

mockPage.mockImplementation(
  ({ children }) => (<div id="page">{ children }</div>)
);

mockRequest.mockImplementation(() => request);

type anyMockedFunction = jest.MockedFunction<() => unknown>;

describe('<LoginPage>', () => {
  it('should render the form', () => {
    const { getByRole } = render(
      <LoginPage />,
      { store: true }
    );
    const submit = getByRole('button', { name: 'Log In' });

    expect(submit).toBeVisible();
  });

  it('should initialize the request', () => {
    const options = {
      createSession: expect.any(Function) as anyMockedFunction,
      dismissAlert: expect.any(Function) as anyMockedFunction,
      dispatch: expect.any(Function) as anyMockedFunction,
      displayAlert: expect.any(Function) as anyMockedFunction,
      setItem: expect.any(Function) as anyMockedFunction,
    };

    render(
      <LoginPage />,
      { store: true }
    );

    expect(useRequest).toHaveBeenCalledWith({
      mutation,
      options,
    });
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <LoginPage />,
      { store: true }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the user submits the form', () => {
    it('should call the request', async () => {
      const { getByLabelText, getByRole } = render(
        <LoginPage />,
        { store: true }
      );
      const expected = {
        username: 'Alan Bradley',
        password: 'tronlives',
      };

      userEvent.type(getByLabelText('Username'), 'Alan Bradley');

      userEvent.type(getByLabelText('Password'), 'tronlives');

      userEvent.click(getByRole('button', { name: 'Log In'}));

      await waitFor(() => {
        expect(request).toHaveBeenCalledWith(expected, expect.anything());
      });
    });
  });
});
