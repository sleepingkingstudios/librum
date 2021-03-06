import * as React from 'react';
import { Field } from 'formik';

import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Form } from './index';
import type {
  Mutation,
  QueryParams,
  UseMutation,
} from './types';
import { render } from '@test-helpers/rendering';
import type { Middleware } from '@utils/middleware';

describe('<Form />', () => {
  it('should submit the form', async () => {
    const mutation: Mutation = jest.fn();
    const useMutation: UseMutation = () => [mutation, {}];

    const { getByRole } = render(
      <Form initialValues={{}} useMutation={useMutation}>
        <button type="submit">Submit</button>
      </Form>
    );

    userEvent.click(getByRole('button', { name: 'Submit'}));

    await waitFor(() => {
      expect(mutation).toHaveBeenCalledWith({});
    });
  });

  it('should match the snapshot', () => {
    const mutation: Mutation = jest.fn();
    const useMutation: UseMutation = () => [mutation, {}];

    const { asFragment } = render(
      <Form initialValues={{}} useMutation={useMutation}>
        <button type="submit">Submit</button>
      </Form>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with middleware', () => {
    const middleware: Middleware<
      Record<string, unknown>,
      Record<string, unknown>
    > = (nextFn, data) => nextFn({ ...data, secret: '12345' });

    it('should submit the form', async () => {
      const mutation: Mutation = jest.fn();
      const useMutation: UseMutation = () => [mutation, {}];

      const { getByRole } = render(
        <Form initialValues={{}} middleware={middleware} useMutation={useMutation}>
          <button type="submit">Submit</button>
        </Form>
      );

      userEvent.click(getByRole('button', { name: 'Submit'}));

      await waitFor(() => {
        expect(mutation).toHaveBeenCalledWith({ secret: '12345' });
      });
    });
  });

  describe('with params', () => {
    const params: QueryParams = { id: 0 };

    it('should submit the form', async () => {
      const mutation: Mutation = jest.fn();
      const useMutation: UseMutation = () => [mutation, {}];

      const { getByRole } = render(
        <Form params={params} initialValues={{}} useMutation={useMutation}>
          <button type="submit">Submit</button>
        </Form>
      );

      userEvent.click(getByRole('button', { name: 'Submit'}));

      await waitFor(() => {
        expect(mutation).toHaveBeenCalledWith(params);
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
      const mutation: Mutation = jest.fn();
      const useMutation: UseMutation = () => [mutation, {}];

      const { getByRole } = render(
        <Form initialValues={defaultValues} useMutation={useMutation}>
          <Fields />

          <button type="submit">Submit</button>
        </Form>
      );

      userEvent.click(getByRole('button', { name: 'Submit'}));

      await waitFor(() => {
        expect(mutation).toHaveBeenCalledWith(defaultValues);
      });
    });

    describe('with middleware', () => {
      const middleware: Middleware<
        Record<string, unknown>,
        Record<string, unknown>
      > = (nextFn, data) => nextFn({ ...data, secret: '12345' });

      it('should submit the form', async () => {
        const mutation: Mutation = jest.fn();
        const useMutation: UseMutation = () => [mutation, {}];

        const { getByRole } = render(
          <Form initialValues={defaultValues} middleware={middleware} useMutation={useMutation}>
            <button type="submit">Submit</button>
          </Form>
        );

        userEvent.click(getByRole('button', { name: 'Submit'}));

        await waitFor(() => {
          expect(mutation).toHaveBeenCalledWith({ ...defaultValues, secret: '12345' });
        });
      });
    });

    describe('when the user inputs values', () => {
      it('should submit the form', async () => {
        const mutation: Mutation = jest.fn();
        const useMutation: UseMutation = () => [mutation, {}];
        const expectedValues = {
          launchSite: 'KSC',
          mission: {
            name: 'Warlock IV',
          },
        };

        const { getByRole, getByLabelText } = render(
          <Form initialValues={defaultValues} useMutation={useMutation}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        userEvent.type(getByLabelText('Launch Site'), 'KSC');

        userEvent.type(getByLabelText('Mission Name'), 'Warlock IV');

        userEvent.click(getByRole('button', { name: 'Submit'}));

        await waitFor(() => {
          expect(mutation).toHaveBeenCalledWith(expectedValues);
        });
      });

      describe('with params', () => {
        const params: QueryParams = { id: 0 };

        it('should submit the form', async () => {
          const mutation: Mutation = jest.fn();
          const useMutation: UseMutation = () => [mutation, {}];
          const expectedValues = {
            launchSite: 'KSC',
            mission: {
              name: 'Warlock IV',
            },
            ...params,
          };

          const { getByRole, getByLabelText } = render(
            <Form params={params} initialValues={defaultValues} useMutation={useMutation}>
              <Fields />

              <button type="submit">Submit</button>
            </Form>
          );

          userEvent.type(getByLabelText('Launch Site'), 'KSC');

          userEvent.type(getByLabelText('Mission Name'), 'Warlock IV');

          userEvent.click(getByRole('button', { name: 'Submit'}));

          await waitFor(() => {
            expect(mutation).toHaveBeenCalledWith(expectedValues);
          });
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
        const mutation: Mutation = jest.fn();
        const useMutation: UseMutation = () => [mutation, {}];

        const { getByRole } = render(
          <Form initialValues={initialValues} useMutation={useMutation}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        userEvent.click(getByRole('button', { name: 'Submit'}));

        await waitFor(() => {
          expect(mutation).toHaveBeenCalledWith(initialValues);
        });
      });

      describe('with params', () => {
        const params: QueryParams = { id: 0 };

        it('should submit the form', async () => {
          const mutation: Mutation = jest.fn();
          const useMutation: UseMutation = () => [mutation, {}];

          const { getByRole } = render(
            <Form params={params} initialValues={initialValues} useMutation={useMutation}>
              <Fields />

              <button type="submit">Submit</button>
            </Form>
          );

          userEvent.click(getByRole('button', { name: 'Submit'}));

          await waitFor(() => {
            expect(mutation).toHaveBeenCalledWith({ ...initialValues, ...params });
          });
        });
      });
    });

    describe('with params', () => {
      const params: QueryParams = { id: 0 };

      it('should submit the form', async () => {
        const mutation: Mutation = jest.fn();
        const useMutation: UseMutation = () => [mutation, {}];

        const { getByRole } = render(
          <Form initialValues={defaultValues} params={params} useMutation={useMutation}>
            <Fields />

            <button type="submit">Submit</button>
          </Form>
        );

        userEvent.click(getByRole('button', { name: 'Submit'}));

        await waitFor(() => {
          expect(mutation).toHaveBeenCalledWith({ ...defaultValues, ...params });
        });
      });
    });
  });
});
