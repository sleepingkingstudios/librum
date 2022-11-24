import * as React from 'react';
import { Field } from 'formik';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { BasicForm } from './basic';
import type {
  OnSubmit,
  SubmitHandler,
} from './types';

describe('<Form />', () => {
  const options = { setStatus: jest.fn() };
  const submitHandler: jest.MockedFunction<SubmitHandler> = jest.fn();
  const onSubmit: OnSubmit =
    (values) => submitHandler(values, options);

  beforeEach(() => { submitHandler.mockClear(); });

  it('should submit the form', async () => {
    const { getByRole } = render(
      <BasicForm initialValues={{}} onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </BasicForm>
    );

    await userEvent.click(getByRole('button', { name: 'Submit'}));

    expect(submitHandler).toHaveBeenCalledWith({}, options);
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <BasicForm initialValues={{}} onSubmit={jest.fn()}>
        <button type="submit">Submit</button>
      </BasicForm>
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
      const { getByRole } = render(
        <BasicForm initialValues={defaultValues} onSubmit={onSubmit}>
          <Fields />

          <button type="submit">Submit</button>
        </BasicForm>
      );

      await userEvent.click(getByRole('button', { name: 'Submit'}));

      expect(submitHandler).toHaveBeenCalledWith(defaultValues, options);
    });

    describe('when the user inputs values', () => {
      it('should submit the form', async () => {
        const expectedValues = {
          launchSite: 'KSC',
          mission: {
            name: 'Warlock IV',
          },
        };

        const { getByRole, getByLabelText } = render(
          <BasicForm initialValues={defaultValues} onSubmit={onSubmit}>
            <Fields />

            <button type="submit">Submit</button>
          </BasicForm>
        );

        await userEvent.type(getByLabelText('Launch Site'), 'KSC');

        await userEvent.type(getByLabelText('Mission Name'), 'Warlock IV');

        await userEvent.click(getByRole('button', { name: 'Submit'}));

        expect(submitHandler).toHaveBeenCalledWith(expectedValues, options);
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
        const { getByRole } = render(
          <BasicForm initialValues={initialValues} onSubmit={onSubmit}>
            <Fields />

            <button type="submit">Submit</button>
          </BasicForm>
        );

        await userEvent.click(getByRole('button', { name: 'Submit'}));

        expect(submitHandler).toHaveBeenCalledWith(initialValues, options);
      });
    });
  });
});
