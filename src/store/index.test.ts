import {
  IStoreState,
  store
} from './index';

describe('store', () => {
  describe('getState()', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getState } = store;
    const state: IStoreState = getState() as IStoreState;
    const expected = {};

    it('should initialize the state', () => {
      expect(state).toEqual(expected);
    });
  });
});
