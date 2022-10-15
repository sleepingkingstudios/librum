import * as React from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import {
  Form,
  FormField,
  FormRow,
  FormSubmitButton,
} from '@components/form';
import { Page } from '@components/page';
import { useRequest } from './request';

export const LoginPage = (): JSX.Element => {
  const [request, status] = useRequest();

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
