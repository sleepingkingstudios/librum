import * as React from 'react';
import { useDispatch } from 'react-redux';

import {
  Form,
  FormInput as Input,
} from '@components/form';
import { Page } from '@components/page';
import { useCreateSessionMutation } from '@session/api';
import { createSession } from '@session/middleware';
import { actions } from '@session/reducer';
import { useThemeStyles } from '@themes';
import { applyMiddleware } from '@utils/middleware';
import { joinClassNames } from '@utils/react-utils';

export const LoginPage = (): JSX.Element => {
  const headingClassName = joinClassNames(
    useThemeStyles('header'),
    'mb-2 text-4xl',
  );
  const { create } = actions;
  const dispatch = useDispatch();
  const [mutation, status] = useCreateSessionMutation();

  const appliedMiddleware = applyMiddleware(
    mutation,
    [
      createSession({
        actionCreator: create,
        dispatch,
      }),
    ],
  );

  return (
    <Page navigation={[]}>
      <h1 className={headingClassName}>Log In</h1>

      <Form
        initialValues={{ username: '', password: '' }}
        useMutation={
          () => ([appliedMiddleware, status])
        }
      >
        <label htmlFor="username">Username</label>
        <Input id="username" name="username" />

        <br />

        <label htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" />

        <br />

        <button type="submit">Submit</button>
      </Form>
    </Page>
  );
};
