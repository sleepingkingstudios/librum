import { formatValue } from './annotations';
import type { Annotated } from './annotations';

describe('Annotations', () => {
  describe('formatValue()', () => {
    it('should be a function', () => {
      expect(typeof formatValue).toBe('function');
    });

    describe('with undefined', () => {
      it('should return undefined', () => {
        expect(formatValue(undefined)).toBeUndefined();
      });
    });

    describe('with null', () => {
      it('should return null', () => {
        expect(formatValue(null)).toBeNull();
      });
    });

    describe('with false', () => {
      it('should return false', () => {
        expect(formatValue(false)).toBe(false);
      });
    });

    describe('with true', () => {
      it('should return true', () => {
        expect(formatValue(true)).toBe(true);
      });
    });

    describe('with a number', () => {
      const value = 1.0;

      it('should return the value', () => {
        expect(formatValue(value)).toBe(value);
      });
    });

    describe('with a string', () => {
      const value = 'hello';

      it('should return the value', () => {
        expect(formatValue(value)).toBe(value);
      });
    });

    describe('with an anonymous function', () => {
      it('should format the annotations', () => {
        expect(formatValue(() => null as () => null)).toBe('(anonymous function)');
      });
    });

    describe('with an annotated function', () => {
      const fn: (() => null) & Annotated = () => null;

      fn.annotations = {
        name: 'test:function',
        type: 'function',
      };

      it('should format the annotations', () => {
        expect(formatValue(fn)).toEqual({
          name: 'test:function',
          type: 'function',
        });
      });
    });

    describe('with an empty array', () => {
      const value: unknown[] = [];

      it('should return the array', () => {
        expect(formatValue(value)).toEqual(value);
      });
    });

    describe('with an array of primitives', () => {
      const value: unknown[] = [true, 1.0, 'hello'];

      it('should return the array', () => {
        expect(formatValue(value)).toEqual(value);
      });
    });

    describe('with a nested array', () => {
      const value: unknown[] = [
        ['east', [1.0, 0.0]],
        ['north', [0.0, -1.0]],
        ['south', [0.0, 1.0]],
        ['west', [-1.0, 0.0]],
      ];

      it('should return the array', () => {
        expect(formatValue(value)).toEqual(value);
      });
    });

    describe('with an empty object', () => {
      const value = {};

      it('should return the object', () => {
        expect(formatValue(value)).toEqual(value);
      });
    });

    describe('with an annotated object', () => {
      const value: Annotated = {};

      value.annotations = {
        name: 'test:function',
        type: 'function',
      };

      it('should format the annotations', () => {
        expect(formatValue(value)).toEqual({
          name: 'test:function',
          type: 'function',
        });
      });
    });

    describe('with a complex object', () => {
      const doSomething: (() => null) & Annotated = () => null;
      const exampleMiddleware: Annotated = {};
      const value: (() => null) & Annotated = () => null;

      doSomething.annotations = {
        name: 'do:something',
        type: 'test:hook',
      };

      exampleMiddleware.annotations = {
        name: 'test:middleware',
        type: 'exampleMiddleware',
      };

      value.annotations = {
        middleware: [
          exampleMiddleware,
        ],
        name: 'test:function',
        options: {
          doSomething,
        },
        secret: 12345,
        type: 'function',
      };

      const expected = {
        middleware: [
          {
            name: 'test:middleware',
            type: 'exampleMiddleware',
          },
        ],
        name: 'test:function',
        options: {
          doSomething: {
            name: 'do:something',
            type: 'test:hook',
          },
        },
        secret: 12345,
        type: 'function',
      };

      it('should format the annotations', () => {
        expect(formatValue(value)).toEqual(expected);
      });
    });
  });
});
