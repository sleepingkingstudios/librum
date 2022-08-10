import * as React from 'react';
import { FormikValues } from 'formik';

import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { FormField } from './index';
import type {
  OnSubmit,
  SubmitHandler,
} from '../types';
import { formWrapper } from '@components/form/test-helpers';

describe('<FormField />', () => {
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
      <FormField name="email" />,
      { wrapper: FormWrapper },
    );

    userEvent.click(getByRole('button', { name: 'Submit'}));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalledWith(initialValues);
    });
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <FormField name="email" />,
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
        <FormField name="email" />,
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
        <FormField name="email" />,
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
        <FormField name="email" />,
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
        <FormField name="email" />,
        { wrapper: FormWrapper },
      );

      userEvent.click(getByRole('button', { name: 'Submit'}));

      await waitFor(() => {
        expect(submitHandler).toHaveBeenCalledWith(initialValues);
      });
    });

    it('should match the snapshot', () => {
      const initialValues = { email: 'alan.bradley@example.com' };
      const FormWrapper = formWrapper({
        initialValues,
        onSubmit: jest.fn(),
      });
      const { asFragment } = render(
        <FormField name="email" />,
        { wrapper: FormWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with className: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormField name="email" className="custom-form-field" />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with cols: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormField name="email" cols={3} />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with id: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormField id="user-email" name="email" />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with label: false', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormField name="email" label={false} />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with label: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormField name="email" label="Your Email" />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with name: qualified value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormField name="user[contact][email_address]" />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with type: password', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormField name="email" type="password" />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with type: text', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormField name="email" type="text" />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
