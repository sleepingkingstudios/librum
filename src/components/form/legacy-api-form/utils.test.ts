import { invalidParametersError } from '@api/errors';
import type {
  FormErrors,
  SubmitHandlerOptions,
} from '../types';
import { handleSubmit } from './utils';

describe('<Form /> utils', () => {
  describe('handleSubmit()', () => {
    const request = jest.fn();
    const setStatus = jest.fn();
    const values = { name: 'Alan Bradley' };
    const options: SubmitHandlerOptions = { setStatus };

    beforeEach(() => {
      request.mockClear();
      setStatus.mockClear();
    });

    it('should be a function', () => {
      expect(typeof handleSubmit).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof handleSubmit(request)).toBe('function');
    });

    describe('when the response is successful', () => {
      const response = { data: {} };

      beforeEach(() => {
        request.mockImplementationOnce(() => response);
      });

      it('should call the request', async () => {
        await handleSubmit(request)(values, options);

        expect(request).toHaveBeenCalledWith(values);
      });

      it('should set the status', async () => {
        await handleSubmit(request)(values, options);

        expect(setStatus).toHaveBeenCalledWith({ ok: true });
      });
    });

    describe('when the response is failing', () => {
      const response = {
        error: { data: { message: 'Something went wrong.' } }
      };

      beforeEach(() => {
        request.mockImplementationOnce(() => response);
      });

      it('should call the request', async () => {
        await handleSubmit(request)(values, options);

        expect(request).toHaveBeenCalledWith(values);
      });

      it('should set the status', async () => {
        await handleSubmit(request)(values, options);

        expect(setStatus).toHaveBeenCalledWith({ ok: false });
      });
    });

    describe('when the response has an invalid parameters error', () => {
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
      const response = {
        error: {
          data: {
            ok: false,
            error: {
              data: { errors },
              message: 'Invalid parameters',
              type: invalidParametersError,
            },
          },
          status: 422
        },
      };

      beforeEach(() => {
        request.mockImplementationOnce(() => response);
      });

      it('should call the request', async () => {
        await handleSubmit(request)(values, options);

        expect(request).toHaveBeenCalledWith(values);
      });

      it('should set the status', async () => {
        await handleSubmit(request)(values, options);

        expect(setStatus).toHaveBeenCalledWith({ ok: false, errors });
      });
    });
  });
});
