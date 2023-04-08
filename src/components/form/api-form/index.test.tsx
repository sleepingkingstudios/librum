import * as React from 'react';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { ApiForm } from './index';
import {
  responseWithError,
  responseWithStatus,
} from '@api';
import type {
  Refetch,
  Response,
} from '@api';
import { invalidParametersError } from '@api/errors';
import type { Animations } from '@components/types';
import { render } from '@test-helpers/rendering';
import { FormField } from '../field';
import type {
  FormErrors,
  InvalidParametersError,
} from '../types';

describe('<ApiForm />', () => {
  const response: Response = responseWithStatus({ status: 'success' });
  const refetch: jest.MockedFunction<Refetch> = jest.fn(
    () => new Promise(resolve => resolve(response))
  );

  beforeEach(() => {
    refetch.mockClear();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <ApiForm initialValues={{}} refetch={refetch} response={response}>
        <button type="submit">Submit</button>
      </ApiForm>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the response is loading', () => {
    const response: Response = responseWithStatus({ status: 'loading' });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ApiForm initialValues={{}} refetch={refetch} response={response}>
          <button type="submit">Submit</button>
        </ApiForm>
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with loading configuration', () => {
      const options = {
        loadingAnimation: 'pulse' as Animations,
        loadingIcon: faRadiation,
        loadingMessage: 'Activating Reactor...',
      };

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ApiForm
            initialValues={{}}
            refetch={refetch}
            response={response}
            {...options}
          >
            <button type="submit">Submit</button>
          </ApiForm>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('when the user submits the form', () => {
    it('should perform the request', async () => {
      const { getByRole } = render(
        <ApiForm initialValues={{}} refetch={refetch} response={response}>
          <button type="submit">Submit</button>
        </ApiForm>
      );
      const button = getByRole('button');

      await userEvent.click(button);

      expect(refetch).toHaveBeenCalledWith({ body: {} });
    });
  });

  describe('with className: value', () => {
    const className = 'custom-form';

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ApiForm
          className={className}
          initialValues={{}}
          refetch={refetch}
          response={response}
        >
          <button type="submit">Submit</button>
        </ApiForm>
      );

      expect(asFragment()).toMatchSnapshot();
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

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ApiForm
          initialValues={defaultValues}
          refetch={refetch}
          response={response}
        >
          <Fields />

          <button type="submit">Submit</button>
        </ApiForm>
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the user submits the form', () => {
      it('should perform the request', async () => {
        const { getByRole } = render(
          <ApiForm
            initialValues={defaultValues}
            refetch={refetch}
            response={response}
          >
            <Fields />

            <button type="submit">Submit</button>
          </ApiForm>
        );
        const button = getByRole('button');

        await userEvent.click(button);

        expect(refetch).toHaveBeenCalledWith({ body: defaultValues });
      });

      describe('when the request returns a response with API errors', () => {
        const errors: FormErrors = {
          'launchSite': [{
            data: {},
            message: "can't be blank",
            path: ['launchSite'],
            type: 'test.errorType',
          }],
        };
        const error: InvalidParametersError = {
          data: { errors },
          message: 'invalid request parameters',
          type: invalidParametersError,
        };
        const failureResponse = responseWithError({
          error,
          errorType: error.type,
        });

        beforeEach(() => {
          refetch.mockImplementationOnce(
            () => new Promise(resolve => resolve(failureResponse)),
          );
        });

        it('should match the snapshot', async () => {
          const { asFragment, getByRole, rerender } = render(
            <ApiForm
              initialValues={defaultValues}
              refetch={refetch}
              response={response}
            >
              <Fields />

              <button type="submit">Submit</button>
            </ApiForm>
          );
          const button = getByRole('button');

          await userEvent.click(button);

          rerender(
            <ApiForm
              initialValues={defaultValues}
              refetch={refetch}
              response={failureResponse}
            >
              <Fields />

              <button type="submit">Submit</button>
            </ApiForm>
          );

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('when the user enters form data', () => {
      describe('when the user submits the form', () => {
        const expectedValues = {
          launchSite: 'KSC',
          mission: {
            name: 'Warlock IV',
          },
        };

        it('should perform the request', async () => {
          const { getByLabelText, getByRole } = render(
            <ApiForm
              initialValues={defaultValues}
              refetch={refetch}
              response={response}
            >
              <Fields />

              <button type="submit">Submit</button>
            </ApiForm>
          );
          const button = getByRole('button');

          await userEvent.type(getByLabelText('Launch Site'), 'KSC');

          await userEvent.type(getByLabelText('Mission Name'), 'Warlock IV');

          await userEvent.click(button);

          expect(refetch).toHaveBeenCalledWith({ body: expectedValues });
        });
      });
    });
  });
});
