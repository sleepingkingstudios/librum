import * as React from 'react';
import { useDispatch } from 'react-redux';

import {
  Form,
  FormButton,
  FormField as Field,
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
        <Field name="username" />

        <Field name="password" type="password" />

        <FormButton type="submit">Submit</FormButton>
      </Form>
    </Page>
  );
};
