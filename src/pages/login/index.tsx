import * as React from 'react';
import { useDispatch } from 'react-redux';

import {
  Form,
  FormInput as Input,
} from '@components/form';
import { Page } from '@components/page';
import { useCreateSessionMutation } from '@session/api';
import {
  createSession,
  storeSession,
} from '@session/middleware';
import { actions } from '@session/reducer';

export const LoginPage = (): JSX.Element => {
  const { create } = actions;
  const dispatch = useDispatch();
  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };
  const middleware = [
    createSession({
      actionCreator: create,
      dispatch,
    }),
    storeSession({ setItem }),
  ];

  return (
    <Page navigation={[]}>
      <h1>Log In</h1>

      <Form
        initialValues={{ username: '', password: '' }}
        middleware={middleware}
        useMutation={useCreateSessionMutation}
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
