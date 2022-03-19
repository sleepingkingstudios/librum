import {
  joinClassNames
} from './react-utils';

describe('React utils', () => {
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

    describe('with an empty string', () => {
      const input = '';

      it('should return an empty string', () => {
        expect(joinClassNames(input)).toBe('');
      });
    });

    describe('with a string', () => {
      const input = 'some-class-name';

      it('should return the string', () => {
        expect(joinClassNames(input)).toBe(input);
      });
    });

    describe('with an array of empty strings', () => {
      const inputs = ['', '', ''];

      it('should return an empty string', () => {
        expect(joinClassNames(...inputs)).toBe('');
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
      const inputs = [
        null,
        'some-class-name other-class-name',
        undefined,
        '',
        'third-class-name'
      ];
      const expected = 'some-class-name other-class-name third-class-name';

      it('should return the string', () => {
        expect(joinClassNames(...inputs)).toBe(expected);
      });
    });
  });
});
