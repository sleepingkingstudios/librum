import * as React from 'react';
import { useDispatch } from 'react-redux';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import {
  Form,
  FormField,
  FormRow,
  FormSubmitButton,
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
        className="w-full lg:w-1/2"
        initialValues={{ username: '', password: '' }}
        loadingAnimation="bounce"
        loadingIcon={faUser}
        loadingMessage="Logging In..."
        middleware={middleware}
        useMutation={useCreateSessionMutation}
      >
        <FormRow>
          <FormField name="username" />

          <FormField name="password" type="password" />
        </FormRow>

        <FormRow cols={2}>
          <FormSubmitButton>Log In</FormSubmitButton>
        </FormRow>
      </Form>
    </Page>
  );
};
