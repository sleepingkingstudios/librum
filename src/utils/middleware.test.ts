import { applyMiddleware } from './middleware';
import type {
  Middleware,
  NextFunction,
} from './middleware';

const buildMiddleware = (chr: string): Middleware<string, string> => (
  (nextFn: NextFunction<string, string>, str: string): string => {
    return nextFn(chr + str) + chr;
  }
);

describe('Middleware', () => {
  const initialFn = jest.fn((str: string) => str.toUpperCase());

  beforeEach(() => { initialFn.mockClear(); });

  describe('applyMiddleware()', () => {
    describe('with undefined middleware', () => {
      it('should return a function', () => {
        const applied = applyMiddleware(initialFn, undefined);

        expect(typeof applied).toBe('function');
      });

      it('should call the original function', () => {
        const applied = applyMiddleware(initialFn, undefined);

        applied('x');

        expect(initialFn).toHaveBeenCalledWith('x');
      });

      it('should return the function result', () => {
        const applied = applyMiddleware(initialFn, undefined);

        expect(applied('x')).toBe('X');
      });
    });

    describe('with a middleware function', () => {
      const middleware = jest.fn(buildMiddleware('a'));

      beforeEach(() => { middleware.mockClear(); });

      it('should return a function', () => {
        const applied = applyMiddleware(initialFn, middleware);

        expect(typeof applied).toBe('function');
      });

      it('should call the original function', () => {
        const applied = applyMiddleware(initialFn, middleware);

        applied('x');

        expect(initialFn).toHaveBeenCalledWith('ax');
      });

      it('should call the middleware', () => {
        const applied = applyMiddleware(initialFn, middleware);

        applied('x');

        expect(middleware).toHaveBeenCalledWith(
          expect.any(Function),
          'x'
        );
      });

      it('should return the applied result', () => {
        const applied = applyMiddleware(initialFn, middleware);

        expect(applied('x')).toBe('AXa');
      });
    });

    describe('with an empty middleware array', () => {
      it('should return a function', () => {
        const applied = applyMiddleware(initialFn, []);

        expect(typeof applied).toBe('function');
      });

      it('should call the original function', () => {
        const applied = applyMiddleware(initialFn, []);

        applied('x');

        expect(initialFn).toHaveBeenCalledWith('x');
      });

      it('should return the function result', () => {
        const applied = applyMiddleware(initialFn, []);

        expect(applied('x')).toBe('X');
      });
    });

    describe('with a one middleware function', () => {
      const middleware = [
        jest.fn(buildMiddleware('a')),
      ];

      beforeEach(() => {
        middleware.forEach(mock => mock.mockClear());
      });

      it('should return a function', () => {
        const applied = applyMiddleware(initialFn, middleware);

        expect(typeof applied).toBe('function');
      });

      it('should call the original function', () => {
        const applied = applyMiddleware(initialFn, middleware);

        applied('x');

        expect(initialFn).toHaveBeenCalledWith('ax');
      });

      it('should call the middleware', () => {
        const applied = applyMiddleware(initialFn, middleware);

        applied('x');

        expect(middleware[0]).toHaveBeenCalledWith(
          expect.any(Function),
          'x'
        );
      });

      it('should return the applied result', () => {
        const applied = applyMiddleware(initialFn, middleware);

        expect(applied('x')).toBe('AXa');
      });
    });

    describe('with many middleware functions', () => {
      const middleware = [
        jest.fn(buildMiddleware('a')),
        jest.fn(buildMiddleware('b')),
        jest.fn(buildMiddleware('c')),
      ];

      beforeEach(() => {
        middleware.forEach(mock => mock.mockClear());
      });

      it('should return a function', () => {
        const applied = applyMiddleware(initialFn, middleware);

        expect(typeof applied).toBe('function');
      });

      it('should call the original function', () => {
        const applied = applyMiddleware(initialFn, middleware);

        applied('x');

        expect(initialFn).toHaveBeenCalledWith('cbax');
      });

      it('should call the middleware', () => {
        const applied = applyMiddleware(initialFn, middleware);

        applied('x');

        expect(middleware[0]).toHaveBeenCalledWith(
          expect.any(Function),
          'x'
        );

        expect(middleware[1]).toHaveBeenCalledWith(
          expect.any(Function),
          'ax'
        );

        expect(middleware[2]).toHaveBeenCalledWith(
          expect.any(Function),
          'bax'
        );
      });

      it('should return the applied result', () => {
        const applied = applyMiddleware(initialFn, middleware);

        expect(applied('x')).toBe('CBAXcba');
      });
    });
  });
});
