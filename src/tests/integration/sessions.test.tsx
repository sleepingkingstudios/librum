import * as React from 'react';

import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type {
  FetchResponse,
  Mutation,
  MutationStatus,
  UseMutation,
} from '@api';
import { LoginPage } from '@pages';
import type { User } from '@session';
import { useCreateSessionMutation } from '@session/api';
import { render } from '@test-helpers/rendering';

jest.mock('@session/api');

const useMutation = useCreateSessionMutation as jest.MockedFunction<UseMutation>;
const mutation: jest.MockedFunction<Mutation> = jest.fn(
  () => ({ error: { status: 500, error: 'Something went wrong' } })
);
const mutationStatus: MutationStatus = { isLoading: false };

useMutation.mockImplementation(() => [mutation, mutationStatus]);

describe('(Integration) sessions', () => {
  beforeEach(() => { mutation.mockClear(); });

  afterEach(() => { localStorage.clear(); })

  it('should render the login form', () => {
    const { getByRole } = render(
      <LoginPage />,
      {
        router: true,
        store: true,
      },
    );
    const submit = getByRole('button', { name: 'Log In' });

    expect(submit).toBeVisible();
  });

  it('should not display the user message', () => {
    const { queryByText } = render(
      <LoginPage />,
      {
        router: true,
        store: true,
      },
    );

    expect(queryByText(/logged in/)).toBeNull();
  });

  describe('when the user submits the form', () => {
    it('should call the mutation', async () => {
      const { getByRole } = render(
        <LoginPage />,
        {
          router: true,
          store: true,
        },
      );
      const expected = {
        username: '',
        password: '',
      };

      userEvent.click(getByRole('button', { name: 'Log In'}));

      await waitFor(() => {
        expect(mutation).toHaveBeenCalledWith(expected);
      });
    });
  });

  describe('when the user enters data', () => {
    describe('when the user submits the form', () => {
      it('should call the mutation', async () => {
        const { getByLabelText, getByRole } = render(
          <LoginPage />,
          {
            router: true,
            store: true,
          },
        );
        const expected = {
          username: 'Alan Bradley',
          password: 'tronlives',
        };

        userEvent.type(getByLabelText('Username'), 'Alan Bradley');

        userEvent.type(getByLabelText('Password'), 'tronlives');

        userEvent.click(getByRole('button', { name: 'Log In'}));

        await waitFor(() => {
          expect(mutation).toHaveBeenCalledWith(expected);
        });
      });

      describe('when the api returns a failing response', () => {
        it('should not display the user message', async () => {
          const { getByLabelText, getByRole, queryByText } = render(
            <LoginPage />,
            {
              router: true,
              store: true,
            },
          );

          userEvent.type(getByLabelText('Username'), 'Alan Bradley');

          userEvent.type(getByLabelText('Password'), 'tronlives');

          userEvent.click(getByRole('button', { name: 'Log In'}));

          await waitFor(() => {
            expect(mutation).toHaveBeenCalled();
          });

          expect(queryByText(/Logged in/)).toBeNull();
        });

        it('should not store the session', async () => {
          localStorage.clear();

          const { getByLabelText, getByRole } = render(
            <LoginPage />,
            {
              router: true,
              store: true,
            },
          );

          userEvent.type(getByLabelText('Username'), 'Alan Bradley');

          userEvent.type(getByLabelText('Password'), 'tronlives');

          userEvent.click(getByRole('button', { name: 'Log In'}));

          await waitFor(() => {
            expect(mutation).toHaveBeenCalled();
          });

          expect(localStorage.getItem('session')).toBeNull();
        });
      });

      describe('when the api returns a successful response', () => {
        it('should update the session', async () => {
          const { getByLabelText, getByRole, queryByText } = render(
            <LoginPage />,
            {
              router: true,
              store: true,
            },
          );
          const user: User = {
            email: 'alan.bradley@example.com',
            id: '00000000-0000-0000-0000-000000000000',
            role: 'user',
            slug: 'alan-bradley',
            username: 'Alan Bradley',
          };
          const token = '12345';
          const response: FetchResponse<{ token: string, user: User }> = {
            data: {
              ok: true,
              data: {
                token,
                user,
              },
            },
          };

          mutation.mockImplementationOnce(() => response);

          userEvent.type(getByLabelText('Username'), 'Alan Bradley');

          userEvent.type(getByLabelText('Password'), 'tronlives');

          userEvent.click(getByRole('button', { name: 'Log In'}));

          await waitFor(() => {
            expect(mutation).toHaveBeenCalled();
          });

          const message = queryByText(/logged in/);

          expect(message).toBeVisible();
        });

        it('should store the session', async () => {
          localStorage.clear();

          const { getByLabelText, getByRole } = render(
            <LoginPage />,
            {
              router: true,
              store: true,
            },
          );
          const user: User = {
            email: 'alan.bradley@example.com',
            id: '00000000-0000-0000-0000-000000000000',
            role: 'user',
            slug: 'alan-bradley',
            username: 'Alan Bradley',
          };
          const token = '12345';
          const response: FetchResponse<{ token: string, user: User }> = {
            data: {
              ok: true,
              data: {
                token,
                user,
              },
            },
          };
          const session = {
            authenticated: true,
            token,
            user,
          };
          const value = JSON.stringify(session);

          mutation.mockImplementationOnce(() => response);

          userEvent.type(getByLabelText('Username'), 'Alan Bradley');

          userEvent.type(getByLabelText('Password'), 'tronlives');

          userEvent.click(getByRole('button', { name: 'Log In'}));

          await waitFor(() => {
            expect(mutation).toHaveBeenCalled();
          });

          expect(localStorage.getItem('session')).toBe(value);
        });
      });
    });
  });
});
