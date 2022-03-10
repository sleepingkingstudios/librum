import * as React from 'react';
import {
  Field,
  FormikValues,
} from 'formik';

import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { Form } from './index';
import {
  onSubmitType,
  submitHandlerType,
} from '@components/form/test-helpers';

describe('<Form />', () => {
  it('should submit the form', async () => {
    const submitHandler: submitHandlerType = jest.fn();
    const onSubmit: onSubmitType =
      (values: FormikValues) => submitHandler(values);

    const { getByRole } = render(
      <Form initialValues={{}} onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );

    userEvent.click(getByRole('button', { name: 'Submit'}));

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalledWith({});
    });
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <Form initialValues={{}} onSubmit={jest.fn()}>
        <button type="submit">Submit</button>
      </Form>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with form inputs', () => {
    const Fields = (): JSX.Element => (
      <React.Fragment>
        <label>
          Launch Site
          <Field id="launchSite" name="launchSite" />
        </label>

        <label>
          Mission Name
          <Field id="mission.name" name="mission.name" />
        </label>
      </React.Fragment>
    );
    const defaultValues = {
      launchSite: '',
      mission: {
        name: '',
      }
    };

    it('should submit the form', async () => {
      const submitHandler: submitHandlerType = jest.fn();
      const onSubmit: onSubmitType =
        (values: FormikValues) => submitHandler(values);

      const { getByRole } = render(
        <Form initialValues={defaultValues} onSubmit={onSubmit}>
          <Fields />

          <button type="submit">Submit</button>
        </Form>
      );

      userEvent.click(getByRole('button', { name: 'Submit'}));

      await waitFor(() => {
        expect(submitHandler).toHaveBeenCalledWith(defaultValues);
      });
    });

    describe('when the user inputs values', () => {
      it('should submit the form', async () => {
        const submitHandler: submitHandlerType = jest.fn();
        const onSubmit: onSubmitType =
          (values: FormikValues) => submitHandler(values);
        const expectedValues = {
          launchSite: 'KSC',
          mission: {
            name: 'Warlock IV',
          },
        };

        const { getByRole, getByLabelText } = render(
          <Form initialValues={defaultValues} onSubmit={onSubmit}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        userEvent.type(getByLabelText('Launch Site'), 'KSC');

        userEvent.type(getByLabelText('Mission Name'), 'Warlock IV');

        userEvent.click(getByRole('button', { name: 'Submit'}));

        await waitFor(() => {
          expect(submitHandler).toHaveBeenCalledWith(expectedValues);
        });
      });
    });

    describe('with initial values', () => {
      const initialValues = {
        launchSite: 'KSC',
        mission: {
          name: 'Warlock IV',
        },
      };

      it('should submit the form', async () => {
        const submitHandler: submitHandlerType = jest.fn();
        const onSubmit: onSubmitType =
          (values: FormikValues) => submitHandler(values);

        const { getByRole } = render(
          <Form initialValues={initialValues} onSubmit={onSubmit}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        userEvent.click(getByRole('button', { name: 'Submit'}));

        await waitFor(() => {
          expect(submitHandler).toHaveBeenCalledWith(initialValues);
        });
      });
    });
  });
});
