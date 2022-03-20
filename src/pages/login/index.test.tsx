import * as React from 'react';

import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LoginPage } from './index';
import type {
  Mutation,
  UseMutation,
} from '@components/form/types';
import { Page } from '@components/page';
import { selector } from '@session';
import type {
  Session,
  User,
} from '@session';
import { useCreateSessionMutation } from '@session/api';
import { useSelector } from '@store';
import type { FetchResponse } from '@store/api';
import { render } from '@test-helpers/rendering';

jest.mock('@components/page');
jest.mock('@session/api');

const mockPage = Page as jest.MockedFunction<typeof Page>;
const useMutation = useCreateSessionMutation as jest.MockedFunction<UseMutation>;
const mutation: jest.MockedFunction<Mutation> = jest.fn(
  () => ({ error: { status: 500, error: 'Something went wrong' } })
);

mockPage.mockImplementation(
  ({ children }) => {
    const session: Session = useSelector(selector);
    let message: React.ReactNode = null;

    if ('user' in session) {
      const { user } = session;

      message = (<p>Logged in as { user.username }</p>);
    }

    return (
      <div id="page">
        { message }

        { children }
      </div>
    );
  }
);

useMutation.mockImplementation(() => [mutation, {}]);

describe('<LoginPage>', () => {
  beforeEach(() => { mutation.mockClear(); });

  it('should render the form', () => {
    const { getByRole } = render(
      <LoginPage />,
      { store: true }
    );
    const submit = getByRole('button', { name: 'Submit' });

    expect(submit).toBeVisible();
  });

  it('should not display the user message', () => {
    const { queryByText } = render(
      <LoginPage />,
      { store: true }
    );

    expect(queryByText(/Logged in/)).toBeNull();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <LoginPage />,
      { store: true }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the user submits the form', () => {
    it('should call the mutation', async () => {
      const { getByRole } = render(
        <LoginPage />,
        { store: true }
      );
      const expected = {
        username: '',
        password: '',
      };

      userEvent.click(getByRole('button', { name: 'Submit'}));

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
          { store: true }
        );
        const expected = {
          username: 'Alan Bradley',
          password: 'tronlives',
        };

        userEvent.type(getByLabelText('Username'), 'Alan Bradley');

        userEvent.type(getByLabelText('Password'), 'tronlives');

        userEvent.click(getByRole('button', { name: 'Submit'}));

        await waitFor(() => {
          expect(mutation).toHaveBeenCalledWith(expected);
        });
      });

      describe('when the api returns a failing response', () => {
        it('should not display the user message', async () => {
          const { getByLabelText, getByRole, queryByText } = render(
            <LoginPage />,
            { store: true }
          );

          userEvent.type(getByLabelText('Username'), 'Alan Bradley');

          userEvent.type(getByLabelText('Password'), 'tronlives');

          userEvent.click(getByRole('button', { name: 'Submit'}));

          await waitFor(() => {
            expect(mutation).toHaveBeenCalled();
          });

          expect(queryByText(/Logged in/)).toBeNull();
        });
      });

      describe('when the api returns a successful response', () => {
        it('should update the session', async () => {
          const { getByLabelText, getByRole, queryByText } = render(
            <LoginPage />,
            { store: true }
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

          userEvent.click(getByRole('button', { name: 'Submit'}));

          await waitFor(() => {
            expect(mutation).toHaveBeenCalled();
          });

          const message = queryByText(/Logged in/);

          expect(message).toBeVisible();
          expect(message).toHaveTextContent('Logged in as Alan Bradley');
        });
      });
    });
  });
});
