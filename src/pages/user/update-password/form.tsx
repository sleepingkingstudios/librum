import * as React from 'react';
import { useDispatch } from 'react-redux';

import { useAlerts } from '@alerts';
import {
  Form,
  FormField,
  FormRow,
  FormSubmitButton,
} from '@components/form';
import { actions } from '@session/reducer';
import {
  useMutation,
  useRequest,
} from './request';

type UserUpdatePasswordFormProps = {
  closeForm: () => void,
};

export const UserUpdatePasswordForm = (
  { closeForm }: UserUpdatePasswordFormProps
): JSX.Element => {
  const { destroy } = actions;
  const { displayAlert } = useAlerts();
  const dispatch = useDispatch();
  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };
  const options = {
    closeForm,
    destroySession: destroy,
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
