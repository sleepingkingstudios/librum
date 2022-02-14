import {
  joinClassNames
} from './react-utils';

describe('ReactUtils', () => {
  describe('joinClassNames()', () => {
    it('should be a function', () => {
      expect(typeof joinClassNames).toBe('function');
    });

    describe('with no arguments', () => {
      it('should return an empty string', () => {
        expect(joinClassNames()).toBe('');
      });
    });

    describe('with null', () => {
      it('should return an empty string', () => {
        expect(joinClassNames(null)).toBe('');
      });
    });

    describe('with undefined', () => {
      it('should return an empty string', () => {
        expect(joinClassNames(undefined)).toBe('');
      });
    });

    describe('with a string', () => {
      const input = 'some-class-name';

      it('should return the string', () => {
        expect(joinClassNames(input)).toBe(input);
      });
    });

    describe('with an array of strings', () => {
      const inputs = ['some-class-name', 'other-class-name'];
      const expected = 'some-class-name other-class-name';

      it('should return the string', () => {
        expect(joinClassNames(...inputs)).toBe(expected);
      });
    });

    describe('with a mixed array', () => {
      const inputs = [null, 'some-class-name other-class-name', undefined];
      const expected = 'some-class-name other-class-name';

      it('should return the string', () => {
        expect(joinClassNames(...inputs)).toBe(expected);
      });
    });
  });
});
