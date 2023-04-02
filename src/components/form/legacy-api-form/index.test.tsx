import * as React from 'react';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { LegacyApiForm as Form } from './index';
import type { UseMutationTrigger } from '@api';
import {
  defaultResponse,
  loadingResponse,
} from '@api/test-helpers';
import { render } from '@test-helpers/rendering';
import { FormField } from '../field';
import { getServerErrors } from '../utils';
import { handleSubmit } from './utils';

jest.mock('../utils');
jest.mock('./utils');

const mockGetServerErrors = getServerErrors as jest.MockedFunction<typeof getServerErrors>;
const mockHandleSubmit = handleSubmit as jest.MockedFunction<typeof handleSubmit>;
const performRequest = (trigger: UseMutationTrigger) => async (values: unknown) => trigger(values);

mockGetServerErrors.mockImplementation(() => []);

mockHandleSubmit.mockImplementation(performRequest);

describe('<Form />', () => {
  it('should wrap the request in a submit handler', () => {
    const request = jest.fn();
    const response = defaultResponse;

    render(
      <Form initialValues={{}} request={request} response={response}>
        <button type="submit">Submit</button>
      </Form>
    );

    expect(mockHandleSubmit).toHaveBeenCalledWith(request);
  });

  it('should submit the form', async () => {
    const request = jest.fn();
    const response = defaultResponse;

    const { getByRole } = render(
      <Form initialValues={{}} request={request} response={response}>
        <button type="submit">Submit</button>
      </Form>
    );

    await userEvent.click(getByRole('button', { name: 'Submit'}));

    expect(request).toHaveBeenCalledWith({});
  });

  it('should match the snapshot', () => {
    const request = jest.fn();
    const response = defaultResponse;

    const { asFragment } = render(
      <Form initialValues={{}} request={request} response={response}>
        <button type="submit">Submit</button>
      </Form>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the form is loading', () => {
    it('should match the snapshot', () => {
      const request = jest.fn();
      const response = loadingResponse;

      const { asFragment } = render(
        <Form initialValues={{}} request={request} response={response}>
          <button type="submit">Submit</button>
        </Form>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with className: value', () => {
    it('should match the snapshot', () => {
      const request = jest.fn();
      const response = defaultResponse;

      const { asFragment } = render(
        <Form
          className="custom-form"
          initialValues={{}}
          request={request}
          response={response}
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
        const response = loadingResponse;

        const { asFragment } = render(
          <Form
            loadingAnimation="pulse"
            initialValues={{}}
            request={request}
            response={response}
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
        const response = loadingResponse;

        const { asFragment } = render(
          <Form
            loadingIcon={faRadiation}
            initialValues={{}}
            request={request}
            response={response}
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
        const response = loadingResponse;

        const { asFragment } = render(
          <Form
            loadingMessage="Activating Reactor..."
            initialValues={{}}
            request={request}
            response={response}
          >
            <button type="submit">Submit</button>
          </Form>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with form fields', () => {
    const Fields = (): JSX.Element => (
      <React.Fragment>
        <label>
          Launch Site
          <FormField name="launchSite" />
        </label>

        <label>
          Mission Name
          <FormField name="mission.name" />
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
      const response = defaultResponse;

      const { getByRole } = render(
        <Form initialValues={defaultValues} request={request} response={response}>
          <Fields />

          <button type="submit">Submit</button>
        </Form>
      );

      await userEvent.click(getByRole('button', { name: 'Submit'}));

      expect(request).toHaveBeenCalledWith(defaultValues);
    });

    describe('when the user inputs values', () => {
      it('should submit the form', async () => {
        const request = jest.fn();
        const response = defaultResponse;
        const expectedValues = {
          launchSite: 'KSC',
          mission: {
            name: 'Warlock IV',
          },
        };

        const { getByRole, getByLabelText } = render(
          <Form initialValues={defaultValues} request={request} response={response}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        await userEvent.type(getByLabelText('Launch Site'), 'KSC');

        await userEvent.type(getByLabelText('Mission Name'), 'Warlock IV');

        await userEvent.click(getByRole('button', { name: 'Submit'}));

        expect(request).toHaveBeenCalledWith(expectedValues);
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
        const response = defaultResponse;

        const { getByRole } = render(
          <Form initialValues={initialValues} request={request} response={response}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        await userEvent.click(getByRole('button', { name: 'Submit'}));

        expect(request).toHaveBeenCalledWith(initialValues);
      });
    });
  });
});