import * as React from 'react';
import { useDispatch } from 'react-redux';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { useAlerts } from '@alerts';
import {
  Form,
  FormField,
  FormRow,
  FormSubmitButton,
} from '@components/form';
import { Page } from '@components/page';
import { actions } from '@session/reducer';
import {
  useMutation,
  useRequest,
} from './request';

export const LoginPage = (): JSX.Element => {
  const {
    displayAlert,
    dismissAlert,
  } = useAlerts();
  const { create } = actions;
  const dispatch = useDispatch();
  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };
  const options = {
    actionCreator: create,
    dismissAlert,
    dispatch,
    displayAlert,
    setItem,
  };
  const [mutation, status] = useMutation();
  const request = useRequest({
    mutation,
    options,
  });

  return (
    <Page navigation={[]}>
      <h1>Log In</h1>

      <Form
        className="w-full lg:w-1/2"
        initialValues={{ username: '', password: '' }}
        loadingAnimation="bounce"
        loadingIcon={faUser}
        loadingMessage="Logging In..."
        request={request}
        status={status}
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
