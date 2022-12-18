import {
  convertToCamelCase,
  convertToSnakeCase,
} from './data';
import type { DataObject } from './types';

describe('Data utils', () => {
  describe('convertToCamelCase', () => {
    it('should be a function', () => {
      expect(typeof convertToCamelCase).toBe('function');
    });

    describe('with null', () => {
      it('should return the value', () => {
        expect(convertToCamelCase(null)).toBeNull();
      });
    });

    describe('with false', () => {
      it('should return the value', () => {
        expect(convertToCamelCase(false)).toBe(false);
      });
    });

    describe('with true', () => {
      it('should return the value', () => {
        expect(convertToCamelCase(true)).toBe(true);
      });
    });

    describe('with a number', () => {
      const data = 1.0;

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with a string', () => {
      const data = 'Greetings, programs!';

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an empty array', () => {
      const data: unknown[] = [];

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an array of literals', () => {
      const data: unknown[] = [null, false, 'ok'];

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an array of arrays', () => {
      const data: unknown[] = [['ichi', 1], ['ni', 2], ['san', 3]];

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an array of objects', () => {
      const data: DataObject = [
        { user_name: 'Alan Bradley' },
        { user_name: 'Kevin Flynn' },
        { user_name: 'Ed Dillinger' },
      ];
      const expected: DataObject = [
        { userName: 'Alan Bradley' },
        { userName: 'Kevin Flynn' },
        { userName: 'Ed Dillinger' },
      ];

      it('should convert the keys to camelCase', () => {
        expect(convertToCamelCase(data)).toEqual(expected);
      });
    });

    describe('with an empty object', () => {
      const data: DataObject = {};

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an object with camelCase keys', () => {
      const data: DataObject = {
        firstName: 'Alan',
        lastName: 'Bradley',
      };

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an object with snake_case keys', () => {
      const data: DataObject = {
        first_name: 'Alan',
        last_name: 'Bradley',
      };
      const expected: DataObject = {
        firstName: 'Alan',
        lastName: 'Bradley',
      };

      it('should convert the keys to camelCase', () => {
        expect(convertToCamelCase(data)).toEqual(expected);
      });
    });

    describe('with an object with nested objects', () => {
      const data: DataObject = {
        current_user: {
          first_name: 'Alan',
          last_name: 'Bradley',
        },
      };
      const expected: DataObject = {
        currentUser: {
          firstName: 'Alan',
          lastName: 'Bradley',
        },
      };

      it('should convert the keys to camelCase', () => {
        expect(convertToCamelCase(data)).toEqual(expected);
      });
    });

    describe('with a complex object', () => {
      const data: DataObject = {
        authorized_users: [
          { user_name: 'Alan Bradley' },
          { user_name: 'Kevin Flynn' },
          { user_name: 'Ed Dillinger' },
        ],
      };
      const expected: DataObject = {
        authorizedUsers: [
          { userName: 'Alan Bradley' },
          { userName: 'Kevin Flynn' },
          { userName: 'Ed Dillinger' },
        ],
      };

      it('should convert the keys to camelCase', () => {
        expect(convertToCamelCase(data)).toEqual(expected);
      });
    });
  });

  describe('convertToSnakeCase', () => {
    it('should be a function', () => {
      expect(typeof convertToSnakeCase).toBe('function');
    });

    describe('with null', () => {
      it('should return the value', () => {
        expect(convertToSnakeCase(null)).toBeNull();
      });
    });

    describe('with false', () => {
      it('should return the value', () => {
        expect(convertToSnakeCase(false)).toBe(false);
      });
    });

    describe('with true', () => {
      it('should return the value', () => {
        expect(convertToSnakeCase(true)).toBe(true);
      });
    });

    describe('with a number', () => {
      const data = 1.0;

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with a string', () => {
      const data = 'Greetings, programs!';

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an empty array', () => {
      const data: unknown[] = [];

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an array of literals', () => {
      const data: unknown[] = [null, false, 'ok'];

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an array of arrays', () => {
      const data: unknown[] = [['ichi', 1], ['ni', 2], ['san', 3]];

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an array of objects', () => {
      const data: DataObject = [
        { userName: 'Alan Bradley' },
        { userName: 'Kevin Flynn' },
        { userName: 'Ed Dillinger' },
      ];
      const expected: DataObject = [
        { user_name: 'Alan Bradley' },
        { user_name: 'Kevin Flynn' },
        { user_name: 'Ed Dillinger' },
      ];

      it('should convert the keys to snake_case', () => {
        expect(convertToSnakeCase(data)).toEqual(expected);
      });
    });

    describe('with an empty object', () => {
      const data: DataObject = {};

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an object with camelCase keys', () => {
      const data: DataObject = {
        firstName: 'Alan',
        lastName: 'Bradley',
      };
      const expected: DataObject = {
        first_name: 'Alan',
        last_name: 'Bradley',
      };

      it('should convert the keys to snake_case', () => {
        expect(convertToSnakeCase(data)).toEqual(expected);
      });
    });

    describe('with an object with snake_case keys', () => {
      const data: DataObject = {
        first_name: 'Alan',
        last_name: 'Bradley',
      };

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an object with nested objects', () => {
      const data: DataObject = {
        currentUser: {
          firstName: 'Alan',
          lastName: 'Bradley',
        },
      };
      const expected: DataObject = {
        current_user: {
          first_name: 'Alan',
          last_name: 'Bradley',
        },
      };

      it('should convert the keys to snake_case', () => {
        expect(convertToSnakeCase(data)).toEqual(expected);
      });
    });

    describe('with a complex object', () => {
      const data: DataObject = {
        authorizedUsers: [
          { userName: 'Alan Bradley' },
          { userName: 'Kevin Flynn' },
          { userName: 'Ed Dillinger' },
        ],
      };
      const expected: DataObject = {
        authorized_users: [
          { user_name: 'Alan Bradley' },
          { user_name: 'Kevin Flynn' },
          { user_name: 'Ed Dillinger' },
        ],
      };

      it('should convert the keys to snake_case', () => {
        expect(convertToSnakeCase(data)).toEqual(expected);
      });
    });
  });
});
