import { wrapMutation } from './utils';
import type { Mutation } from '@api';
import type { OnSubmit } from './types';
import type { Middleware } from '@utils/middleware';
import type { DataObject } from '@utils/types';

type MockMiddleware = jest.MockedFunction<
  Middleware<Record<string, unknown>>
>;

describe('Form utils', () => {
  describe('wrapMutation()', () => {
    it('should return a function', () => {
      const mutation: Mutation = jest.fn();

      expect(typeof wrapMutation({ mutation })).toBe('function');
    });

    it('should call the mutation', async () => {
      const mutation: Mutation = jest.fn();
      const onSubmit: OnSubmit = wrapMutation({ mutation });
      const values = { name: 'Alan Bradley' };

      await onSubmit(values);

      expect(mutation).toHaveBeenCalledWith(values);
    });

    describe('with middleware: a function', () => {
      const middleware: MockMiddleware = jest.fn(
        (fn, obj) => {
          return fn({ ...obj, secret: '12345' });
        }
      );

      beforeEach(() => { middleware.mockClear(); });

      it('should call the mutation', async () => {
        const mutation: Mutation = jest.fn();
        const onSubmit: OnSubmit = wrapMutation({ middleware, mutation });
        const values = { name: 'Alan Bradley' };

        await onSubmit(values);

        expect(mutation).toHaveBeenCalledWith({ ...values, secret: '12345' });
      });

      it('should call the middleware', async () => {
        const mutation: Mutation = jest.fn();
        const onSubmit: OnSubmit = wrapMutation({ middleware, mutation });
        const values = { name: 'Alan Bradley' };

        await onSubmit(values);

        expect(middleware).toHaveBeenCalledWith(mutation, values);
      });
    });

    describe('with middleware: an array of functions', () => {
      const observer = jest.fn();
      const observerMiddleware: MockMiddleware = jest.fn(
        (fn, obj) => {
          const result = fn(obj);

          observer(result);

          return result;
        }
      );
      const secretMiddleware: MockMiddleware = jest.fn(
        (fn, obj) => {
          return fn({ ...obj, secret: '12345' });
        }
      );
      const middleware = [
        observerMiddleware,
        secretMiddleware,
      ];

      beforeEach(() => {
        observer.mockClear();
        observerMiddleware.mockClear();
        secretMiddleware.mockClear();
      });

      it('should call the mutation', async () => {
        const mutation: Mutation = jest.fn();
        const onSubmit: OnSubmit = wrapMutation({ middleware, mutation });
        const values = { name: 'Alan Bradley' };

        await onSubmit(values);

        expect(mutation).toHaveBeenCalledWith({ ...values, secret: '12345' });
      });

      it('should call the observer middleware', async () => {
        const mutation: Mutation = jest.fn(() => ({ ok: true }));
        const onSubmit: OnSubmit = wrapMutation({ middleware, mutation });
        const values = { name: 'Alan Bradley' };

        await onSubmit(values);

        expect(observerMiddleware).toHaveBeenCalledWith(
          expect.any(Function),
          values,
        );
        expect(observer).toHaveBeenCalledWith({ ok: true });
      });

      it('should call the secret middleware', async () => {
        const mutation: Mutation = jest.fn();
        const onSubmit: OnSubmit = wrapMutation({ middleware, mutation });
        const values = { name: 'Alan Bradley' };

        await onSubmit(values);

        expect(secretMiddleware).toHaveBeenCalledWith(
          expect.any(Function),
          values,
        );
      });
    });

    describe('with params', () => {
      const params: DataObject = { id: 0 };

      it('should call the mutation', async () => {
        const mutation: Mutation = jest.fn();
        const onSubmit: OnSubmit = wrapMutation({ mutation, params });
        const values = { id: 1, name: 'Alan Bradley' };
        const expected = { ...values, ...params };

        await onSubmit(values);

        expect(mutation).toHaveBeenCalledWith(expected);
      });
    });
  });
});
