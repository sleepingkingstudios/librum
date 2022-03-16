import { wrapMutation } from './utils';
import type {
  Mutation,
  OnSubmit,
  QueryParams,
} from './types';

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

    describe('with params', () => {
      const params: QueryParams = { id: 0 };

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
