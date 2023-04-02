import * as React from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import {
  ApiForm,
  FormField,
  FormRow,
  FormSubmitButton,
} from '@components/form';
import { Page } from '@components/page';
import { useLoginRequest } from './request';

export const LoginPage = (): JSX.Element => {
  const [response, refetch] = useLoginRequest();

  return (
    <Page navigation={[]}>
      <h1>Log In</h1>

      <ApiForm
        className="w-full lg:w-1/2"
        initialValues={{ username: '', password: '' }}
        loadingAnimation="bounce"
        loadingIcon={faUser}
        loadingMessage="Logging In..."
        refetch={refetch}
        response={response}
      >
        <FormRow>
          <FormField name="username" />

          <FormField name="password" type="password" />
        </FormRow>

        <FormRow cols={2}>
          <FormSubmitButton>Log In</FormSubmitButton>
        </FormRow>
      </ApiForm>
    </Page>
  );
};
