import {
  actions,
  initialState,
  reducer,
  selector,
} from './reducer';
import type {
  Session,
  User,
} from './types';

const user: User = {
  email: 'alan.bradley@example.com',
  id: '00000000-0000-0000-0000-000000000000',
  role: 'user',
  slug: 'alan-bradley',
  username: 'Alan Bradley',
};
const token = '12345';

describe('sessionSlice', () => {
  describe('actions', () => {
    const {
      create,
      destroy,
    } = actions;

    describe('create()', () => {
      it('should create the action', () => {
        const payload = {
          authenticated: true,
          token,
          user,
        };
        const expected = {
          payload,
          type: 'session/create',
        };

        expect(create({ token, user })).toEqual(expected);
      });
    });

    describe('destroy()', () => {
      it('should create the action', () => {
        const expected = {
          type: 'session/destroy',
        };

        expect(destroy()).toEqual(expected);
      });
    });
  });

  describe('initialState', () => {
    it('should set the initial state', () => {
      const expected: Session = {
        authenticated: false,
      };

      expect(initialState).toEqual(expected);
    });
  });

  describe('reducer', () => {
    const {
      create,
      destroy,
    } = actions;

    describe('with a session/create action', () => {
      const action = create({ token, user });

      it('should update the state', () => {
        const expected: Session = {
          authenticated: true,
          token,
          user,
        };

        expect(reducer(initialState, action)).toEqual(expected);
      });
    });

    describe('with a session/destroy action', () => {
      const action = destroy();

      it('should update the state', () => {
        const expected: Session = { authenticated: false };

        expect(reducer(initialState, action)).toEqual(expected);
      });

      describe('when the state has an existing session', () => {
        const state: Session = {
          authenticated: true,
          token,
          user,
        };

        it('should update the state', () => {
          const expected: Session = { authenticated: false };

          expect(reducer(state, action)).toEqual(expected);
        });
      });
    });
  });

  describe('selector', () => {
    const state = { session: initialState };

    it('should select the state', () => {
      expect(selector(state)).toEqual(initialState);
    });
  });
});
