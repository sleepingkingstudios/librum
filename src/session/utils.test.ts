import type {
  Session,
  User,
} from './types';
import { getStoredSession } from './utils';

describe('Session utils', () => {
  describe('getStoredSession()', () => {
    const defaultSession: Session = { authenticated: false };

    afterEach(() => { localStorage.clear(); });

    describe('when localStorage is empty', () => {
      it('should return the default session', () => {
        localStorage.clear();

        expect(getStoredSession()).toEqual(defaultSession);
      });
    });

    describe('when localStorage["session"] is empty', () => {
      it('should return the default session', () => {
        localStorage.removeItem('session');

        expect(getStoredSession()).toEqual(defaultSession);
      });
    });

    describe('when localStorage["session"] cannot be parsed', () => {
      it('should return the default session', () => {
        localStorage.setItem('session', '12345');

        expect(getStoredSession()).toEqual(defaultSession);
      });
    });

    describe('when localStorage["session"] is an invalid session', () => {
      const value = JSON.stringify({ key: 'value' });

      it('should return the default session', () => {
        localStorage.setItem('session', value);

        expect(getStoredSession()).toEqual(defaultSession);
      });
    });

    describe('when localStorage["session"] is a valid session', () => {
      const user: User = {
        email: 'alan.bradley@example.com',
        id: '00000000-0000-0000-0000-000000000000',
        role: 'user',
        slug: 'alan-bradley',
        username: 'Alan Bradley',
      };
      const session = {
        authenticated: true,
        token: '12345',
        user,
      };
      const value = JSON.stringify(session);

      it('should return the default session', () => {
        localStorage.setItem('session', value);

        expect(getStoredSession()).toEqual(session);
      });
    });
  });
});
