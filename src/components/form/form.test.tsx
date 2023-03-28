import * as React from 'react';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { Form } from './form';
import type { Animations } from '@components/types';
import { render } from '@test-helpers/rendering';
import { FormField } from './field';
import type {
  FormStatus,
  OnSubmit,
} from './types';

describe('<Form />', () => {
  const onSubmit: jest.MockedFunction<OnSubmit> = jest.fn();

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <Form initialValues={{}} onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the user submits the form', () => {
    it('should call the submit handler', async () => {
      const { getByRole } = render(
        <Form initialValues={{}} onSubmit={onSubmit}>
          <button type="submit">Submit</button>
        </Form>
      );

      await userEvent.click(getByRole('button', { name: 'Submit'}));

      expect(onSubmit).toHaveBeenCalledWith({}, expect.any(Object));
    });
  });

  describe('with className: value', () => {
    const className = 'custom-form';

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Form initialValues={{}} onSubmit={onSubmit} className={className}>
          <button type="submit">Submit</button>
        </Form>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with loading: true', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Form initialValues={{}} onSubmit={onSubmit} isLoading>
          <button type="submit">Submit</button>
        </Form>
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
          <Form initialValues={{}} onSubmit={onSubmit} isLoading {...options}>
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

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Form initialValues={defaultValues} onSubmit={onSubmit}>
          <Fields />

          <button type="submit">Submit</button>
        </Form>
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the user submits the form', () => {
      it('should call the submit handler', async () => {
        const { getByRole } = render(
          <Form initialValues={defaultValues} onSubmit={onSubmit}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        await userEvent.click(getByRole('button', { name: 'Submit'}));

        expect(onSubmit).toHaveBeenCalledWith(
          defaultValues,
          expect.any(Object),
        );
      });
    });

    describe('when the user inputs values', () => {
      describe('when the user submits the form', () => {
        const expectedValues = {
          launchSite: 'KSC',
          mission: {
            name: 'Warlock IV',
          },
        };

        it('should call the submit handler', async () => {
          const { getByLabelText, getByRole } = render(
            <Form initialValues={defaultValues} onSubmit={onSubmit}>
              <Fields />

              <button type="submit">Submit</button>
            </Form>
          );

          await userEvent.type(getByLabelText('Launch Site'), 'KSC');

          await userEvent.type(getByLabelText('Mission Name'), 'Warlock IV');

          await userEvent.click(getByRole('button', { name: 'Submit'}));

          expect(onSubmit).toHaveBeenCalledWith(
            expectedValues,
            expect.any(Object),
          );
        });
      });
    });

    describe('with initial status', () => {
      const initialStatus: FormStatus = {
        ok: false,
        errors: {
          launchSite: [{
            data: {},
            message: "can't be blank",
            path: ['launchSite'],
            type: 'test.errorType',
          }],
        },
      };

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Form
            initialStatus={initialStatus}
            initialValues={{}}
            onSubmit={onSubmit}
          >
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with initial values', () => {
      const initialValues = {
        launchSite: 'KSC',
        mission: {
          name: 'Warlock IV',
        },
      };

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Form initialValues={initialValues} onSubmit={onSubmit}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        expect(asFragment()).toMatchSnapshot();
      });

      describe('when the user submits the form', () => {
        it('should call the submit handler', async () => {
          const { getByRole } = render(
            <Form initialValues={initialValues} onSubmit={onSubmit}>
              <Fields />

              <button type="submit">Submit</button>
            </Form>
          );

          await userEvent.click(getByRole('button', { name: 'Submit'}));

          expect(onSubmit).toHaveBeenCalledWith(
            initialValues,
            expect.any(Object),
          );
        });
      });
    });
  });
});
