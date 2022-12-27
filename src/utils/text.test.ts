import {
  titleCase,
  upperCamelCase,
} from './text';

describe('Text utils', () => {
  describe('titleCase()', () => {
    it('should be a function', () => {
      expect(typeof titleCase).toBe('function');
    });

    describe('with undefined', () => {
      it('should return an empty string', () => {
        expect(titleCase(undefined)).toBe('');
      });
    });

    describe('with null', () => {
      it('should return an empty string', () => {
        expect(titleCase(null)).toBe('');
      });
    });

    describe('with an empty string', () => {
      it('should return an empty string', () => {
        expect(titleCase('')).toBe('');
      });
    });

    describe('with a simple string', () => {
      it('should convert the string to Title Case', () => {
        expect(titleCase('greetings')).toBe('Greetings');
      });
    });

    describe('with a camelCase string', () => {
      it('should convert the string to Title Case', () => {
        expect(titleCase('greetingsPrograms')).toBe('Greetings Programs');
      });
    });

    describe('with a kebab-case string', () => {
      it('should titleize the string', () => {
        expect(titleCase('greetings-programs')).toBe('Greetings Programs');
      });
    });

    describe('with a snake_case string', () => {
      it('should convert the string to Title Case', () => {
        expect(titleCase('greetings_programs')).toBe('Greetings Programs');
      });
    });

    describe('with a period-separated string', () => {
      it('should convert the string to Title Case', () => {
        expect(titleCase('greetings.programs')).toBe('Greetings Programs');
      });
    });

    describe('with a space separated string', () => {
      it('should convert the string to Title Case', () => {
        expect(titleCase('greetings programs')).toBe('Greetings Programs');
      });
    });
  });

  describe('upperCamelCase()', () => {
    it('should be a function', () => {
      expect(typeof upperCamelCase).toBe('function');
    });

    describe('with undefined', () => {
      it('should return an empty string', () => {
        expect(upperCamelCase(undefined)).toBe('');
      });
    });

    describe('with null', () => {
      it('should return an empty string', () => {
        expect(upperCamelCase(null)).toBe('');
      });
    });

    describe('with an empty string', () => {
      it('should return an empty string', () => {
        expect(upperCamelCase('')).toBe('');
      });
    });

    describe('with a simple string', () => {
      it('should convert the string to upperCamelCase', () => {
        expect(upperCamelCase('greetings')).toBe('Greetings');
      });
    });

    describe('with a camelCase string', () => {
      it('should convert the string to upperCamelCase', () => {
        expect(upperCamelCase('greetingsPrograms')).toBe('GreetingsPrograms');
      });
    });

    describe('with a kebab-case string', () => {
      it('should convert the string to upperCamelCase', () => {
        expect(upperCamelCase('greetings-programs')).toBe('GreetingsPrograms');
      });
    });

    describe('with a snake_case string', () => {
      it('should convert the string to upperCamelCase', () => {
        expect(upperCamelCase('greetings_programs')).toBe('GreetingsPrograms');
      });
    });

    describe('with a period-separated string', () => {
      it('should convert the string to upperCamelCase', () => {
        expect(upperCamelCase('greetings.programs')).toBe('GreetingsPrograms');
      });
    });

    describe('with a space separated string', () => {
      it('should convert the string to upperCamelCase', () => {
        expect(upperCamelCase('greetings programs')).toBe('GreetingsPrograms');
      });
    });
  });
});
