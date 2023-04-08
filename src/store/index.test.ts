import { store } from './index';
import { initialState as session } from '@session';

describe('store', () => {
  describe('getState()', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getState } = store;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const state = getState();
    const expected = { session };

    it('should initialize the state', () => {
      expect(state).toEqual(expected);
    });
  });
});
