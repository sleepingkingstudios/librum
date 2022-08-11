import * as React from 'react';
import { useFormikContext } from 'formik';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { FormSubmitButton } from './index';

interface IMockContext {
  isSubmitting: boolean;
}

type MockHook = jest.MockedFunction<() => IMockContext>;

jest.mock('formik');

const mockUseContext = useFormikContext as unknown as MockHook;

mockUseContext.mockImplementation(() => ({ isSubmitting: false }));

describe('<FormInput />', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(
      <FormSubmitButton>Hit It</FormSubmitButton>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the form is submitting', () => {
    beforeEach(() => {
      mockUseContext.mockImplementation(() => ({ isSubmitting: true }));
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormSubmitButton>Hit It</FormSubmitButton>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with className: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormSubmitButton className="custom-button">Hit It</FormSubmitButton>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with cols: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormSubmitButton cols={3}>Hit It</FormSubmitButton>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with disabled: true', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormSubmitButton disabled>Hit It</FormSubmitButton>,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the form is submitting', () => {
      beforeEach(() => {
        mockUseContext.mockImplementation(() => ({ isSubmitting: true }));
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <FormSubmitButton>Hit It</FormSubmitButton>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
