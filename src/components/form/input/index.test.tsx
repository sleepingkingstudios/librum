import * as React from 'react';
import { FormikValues } from 'formik';

import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { FormInput } from './index';
import type {
  OnSubmit,
  SubmitHandler,
} from '../types';
import { formWrapper } from '@components/form/test-helpers';

describe('<FormInput />', () => {
  it('should pass the value to the form', async () => {
    const submitHandler: SubmitHandler = jest.fn();
    const onSubmit: OnSubmit =
      (values: FormikValues) => submitHandler(values);
    const initialValues = { email: '' };

    const FormWrapper = formWrapper({
      initialValues,
      onSubmit,
      submitButton: true,
    });
    const { getByRole } = render(
      <FormInput name="email" />,
      { wrapper: FormWrapper },
    );

    userEvent.click(getByRole('button', { name: 'Submit'}));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalledWith(initialValues);
    });
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <FormInput name="email" />,
      { wrapper: formWrapper({ onSubmit: jest.fn() }) },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the user enters text', () => {
    it('should show the value in the input', async () => {
      const initialValues = { email: '' };

      const FormWrapper = formWrapper({
        initialValues,
        onSubmit: jest.fn(),
        submitButton: true,
      });
      const { getByRole } = render(
        <FormInput name="email" />,
        { wrapper: FormWrapper },
      );
      const input = getByRole('textbox');

      expect(input).toBeVisible();

      userEvent.type(input, 'alan.bradley@example.com');

      await waitFor(() => {
        expect(input).toHaveValue('alan.bradley@example.com');
      });
    });

    it('should pass the value to the form', async () => {
      const submitHandler: SubmitHandler = jest.fn();
      const onSubmit: OnSubmit =
        (values: FormikValues) => submitHandler(values);
      const initialValues = { email: '' };

      const FormWrapper = formWrapper({
        initialValues,
        onSubmit,
        submitButton: true,
      });
      const { getByRole } = render(
        <FormInput name="email" />,
        { wrapper: FormWrapper },
      );

      userEvent.type(getByRole('textbox'), 'alan.bradley@example.com');

      userEvent.click(getByRole('button', { name: 'Submit'}));

      await waitFor(() => {
        expect(submitHandler).toHaveBeenCalledWith({
          email: 'alan.bradley@example.com'
        });
      });
    });
  });

  describe('when the form has data for the input', () => {
    it('should show the value in the input', () => {
      const initialValues = { email: 'alan.bradley@example.com' };

      const FormWrapper = formWrapper({
        initialValues,
        onSubmit: jest.fn(),
        submitButton: true,
      });
      const { getByRole } = render(
        <FormInput name="email" />,
        { wrapper: FormWrapper },
      );
      const input = getByRole('textbox');

      expect(input).toBeVisible();
      expect(input).toHaveValue(initialValues['email']);
    });

    it('should pass the value to the form', async () => {
      const submitHandler: SubmitHandler = jest.fn();
      const onSubmit: OnSubmit =
        (values: FormikValues) => submitHandler(values);
      const initialValues = { email: 'alan.bradley@example.com' };

      const FormWrapper = formWrapper({
        initialValues,
        onSubmit,
        submitButton: true,
      });
      const { getByRole } = render(
        <FormInput name="email" />,
        { wrapper: FormWrapper },
      );

      userEvent.click(getByRole('button', { name: 'Submit'}));

      await waitFor(() => {
        expect(submitHandler).toHaveBeenCalledWith(initialValues);
      });
    });
  });

  describe('with type: "password"', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormInput name="email" type="password" />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with type: "text"', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormInput name="email" type="text" />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
