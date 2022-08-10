import * as React from 'react';
import { Field } from 'formik';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { FormInput } from './index';
import { formWrapper } from '@components/form/test-helpers';

describe('<FormInput />', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(
      <Field name="email" component={FormInput} />,
      { wrapper: formWrapper({ onSubmit: jest.fn() }) },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the form has data for the input', () => {
    it('should match the snapshot', () => {
      const initialValues = { email: 'alan.bradley@example.com' };

      const { asFragment } = render(
        <Field name="email" component={FormInput} />,
        { wrapper: formWrapper({ initialValues, onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with className: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Field name="email" className="input-important" component={FormInput} />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with id: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Field id="user-email" name="email" component={FormInput} />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with type: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Field name="email" component={FormInput} type="password" />,
        { wrapper: formWrapper({ onSubmit: jest.fn() }) },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
