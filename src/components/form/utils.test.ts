import type {
  FormErrors,
  FormStatus,
} from './types';
import { getServerErrors } from './utils';

describe('<Form /> utils', () => {
  describe('getServerErrors()', () => {
    const name = 'fieldName';

    it('should be a function', () => {
      expect(typeof getServerErrors).toBe('function');
    });

    describe('with status: null', () => {
      const status: FormStatus = null;

      it('should return an empty array', () => {
        expect(getServerErrors({ name, status })).toEqual([]);
      });
    });

    describe('with status: undefined', () => {
      const status: FormStatus = undefined;

      it('should return an empty array', () => {
        expect(getServerErrors({ name, status })).toEqual([]);
      });
    });

    describe('with status: a status with ok: true', () => {
      const status: FormStatus = { ok: true };

      it('should return an empty array', () => {
        expect(getServerErrors({ name, status })).toEqual([]);
      });
    });

    describe('with status: a status with ok: false', () => {
      const status: FormStatus = { ok: false };

      it('should return an empty array', () => {
        expect(getServerErrors({ name, status })).toEqual([]);
      });
    });

    describe('with status: a status with empty errors', () => {
      const errors: FormErrors = {};
      const status: FormStatus = { ok: false, errors };

      it('should return an empty array', () => {
        expect(getServerErrors({ name, status })).toEqual([]);
      });
    });

    describe('with status: a status with non-matching errors', () => {
      const errors: FormErrors = {
        otherField: [
          {
            data: {},
            message: 'Something went wrong',
            path: ['otherField'],
            type: 'spec.errors.type',
          },
        ],
      };
      const status: FormStatus = { ok: false, errors };

      it('should return an empty array', () => {
        expect(getServerErrors({ name, status })).toEqual([]);
      });
    });

    describe('with status: a status with matching errors', () => {
      const errors: FormErrors = {
        otherField: [
          {
            data: {},
            message: 'Something went wrong',
            path: ['otherField'],
            type: 'spec.errors.type',
          },
        ],
        fieldName: [
          {
            data: {},
            message: 'Coolant leak detected',
            path: ['fieldName'],
            type: 'spec.errors.coolantLeak',
          },
          {
            data: {},
            message: 'Temperature approaching critical',
            path: ['fieldName'],
            type: 'spec.errors.criticalTemperature',
          },
        ],
      };
      const status: FormStatus = { ok: false, errors };
      const expected = [
        'Coolant leak detected',
        'Temperature approaching critical',
      ];

      it('should return an empty array', () => {
        expect(getServerErrors({ name, status })).toEqual(expected);
      });
    });
  });
});
