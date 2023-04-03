import * as React from 'react';

import {
  ApiForm,
  FormField,
  FormRow,
  FormSubmitButton,
} from '@components/form';
import { useUpdateUserPasswordRequest } from './request';

type UserUpdatePasswordFormProps = {
  closeForm: () => void,
};

export const UserUpdatePasswordForm = (
  { closeForm }: UserUpdatePasswordFormProps
): JSX.Element => {
  const config = { closeForm };
  const [response, refetch] = useUpdateUserPasswordRequest({ config });

  return (
    <ApiForm
      className="w-full lg:w-1/2"
      initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
      refetch={refetch}
      response={response}
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
    </ApiForm>
  );
};
