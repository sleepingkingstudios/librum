import * as React from 'react';

import {
  Form,
  FormField,
  FormRow,
  FormSubmitButton,
} from '@components/form';
import { useRequest } from './request';

type UserUpdatePasswordFormProps = {
  closeForm: () => void,
};

export const UserUpdatePasswordForm = (
  { closeForm }: UserUpdatePasswordFormProps
): JSX.Element => {
  const options = { closeForm };
  const [request, status] = useRequest({ options });

  return (
    <Form
      className="w-full lg:w-1/2"
      initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
      request={request}
      status={status}
    >
      <FormRow>
        <FormField name="oldPassword" type="password" />

        <FormField name="newPassword" type="password" />

        <FormField name="confirmPassword" type="password" />
      </FormRow>

      <FormRow cols={2}>
        <button className="form-button" onClick={closeForm} type="button">Cancel</button>

        <FormSubmitButton className="button-info">Update Password</FormSubmitButton>
      </FormRow>
    </Form>
  );
};
