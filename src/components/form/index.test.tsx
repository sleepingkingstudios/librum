import * as React from 'react';
import { Field } from 'formik';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { Form } from './index';
import type { MutationStatus } from '@api';
import { render } from '@test-helpers/rendering';

describe('<Form />', () => {
  it('should submit the form', async () => {
    const request = jest.fn();
    const status: MutationStatus = { isLoading: false };

    const { getByRole } = render(
      <Form initialValues={{}} status={status} request={request}>
        <button type="submit">Submit</button>
      </Form>
    );

    await userEvent.click(getByRole('button', { name: 'Submit'}));

    expect(request).toHaveBeenCalledWith({}, expect.anything());
  });

  it('should match the snapshot', () => {
    const request = jest.fn();
    const status: MutationStatus = { isLoading: false };

    const { asFragment } = render(
      <Form initialValues={{}} status={status} request={request}>
        <button type="submit">Submit</button>
      </Form>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the form is loading', () => {
    it('should match the snapshot', () => {
      const request = jest.fn();
      const status: MutationStatus = { isLoading: true };

      const { asFragment } = render(
        <Form initialValues={{}} status={status} request={request}>
          <button type="submit">Submit</button>
        </Form>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with className: value', () => {
    it('should match the snapshot', () => {
      const request = jest.fn();
      const status: MutationStatus = { isLoading: false };

      const { asFragment } = render(
        <Form
          className="custom-form"
          initialValues={{}}
          status={status}
          request={request}
        >
          <button type="submit">Submit</button>
        </Form>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with loadingAnimation: value', () => {
    describe('when the form is loading', () => {
      it('should match the snapshot', () => {
        const request = jest.fn();
        const status: MutationStatus = { isLoading: true };

        const { asFragment } = render(
          <Form
            loadingAnimation="pulse"
            initialValues={{}}
            status={status}
            request={request}
          >
            <button type="submit">Submit</button>
          </Form>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with loadingIcon: value', () => {
    describe('when the form is loading', () => {
      it('should match the snapshot', () => {
        const request = jest.fn();
        const status: MutationStatus = { isLoading: true };

        const { asFragment } = render(
          <Form
            loadingIcon={faRadiation}
            initialValues={{}}
            status={status}
            request={request}
          >
            <button type="submit">Submit</button>
          </Form>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with loadingMessage: value', () => {
    describe('when the form is loading', () => {
      it('should match the snapshot', () => {
        const request = jest.fn();
        const status: MutationStatus = { isLoading: true };

        const { asFragment } = render(
          <Form
            loadingMessage="Activating Reactor..."
            initialValues={{}}
            status={status}
            request={request}
          >
            <button type="submit">Submit</button>
          </Form>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
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
      const request = jest.fn();
      const status: MutationStatus = { isLoading: false };

      const { getByRole } = render(
        <Form initialValues={defaultValues} status={status} request={request}>
          <Fields />

          <button type="submit">Submit</button>
        </Form>
      );

      await userEvent.click(getByRole('button', { name: 'Submit'}));

      expect(request).toHaveBeenCalledWith(defaultValues, expect.anything());
    });

    describe('when the user inputs values', () => {
      it('should submit the form', async () => {
        const request = jest.fn();
        const status: MutationStatus = { isLoading: false };
        const expectedValues = {
          launchSite: 'KSC',
          mission: {
            name: 'Warlock IV',
          },
        };

        const { getByRole, getByLabelText } = render(
          <Form initialValues={defaultValues} status={status} request={request}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        await userEvent.type(getByLabelText('Launch Site'), 'KSC');

        await userEvent.type(getByLabelText('Mission Name'), 'Warlock IV');

        await userEvent.click(getByRole('button', { name: 'Submit'}));

        expect(request).toHaveBeenCalledWith(
          expectedValues,
          expect.anything(),
        );
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
        const request = jest.fn();
        const status: MutationStatus = { isLoading: false };

        const { getByRole } = render(
          <Form initialValues={initialValues} status={status} request={request}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        await userEvent.click(getByRole('button', { name: 'Submit'}));

        expect(request).toHaveBeenCalledWith(
          initialValues,
          expect.anything(),
        );
      });
    });
  });
});
