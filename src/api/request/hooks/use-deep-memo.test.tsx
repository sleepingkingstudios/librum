import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useDeepMemo } from './use-deep-memo';

describe('API request hooks', () => {
  describe('useDeepMemo()', () => {
    it('should be a function', () => {
      expect(typeof useDeepMemo).toBe('function');
    });

    it('should return the value', () => {
      const initialValue = { greetings: 'programs' };
      const { result } = renderHook(
        (value) => useDeepMemo(value),
        { initialProps: initialValue },
      );

      expect(result.current).toBe(initialValue);
    });

    describe('when the values changes to a non-equal value', () => {
      it('should change the value', () => {
        const initialValue = { greetings: 'programs' };
        const { rerender, result } = renderHook(
          (value) => useDeepMemo(value),
          { initialProps: initialValue },
        );

        const newValue = { greetings: 'starfighter' };

        rerender(newValue);

        expect(result.current).toBe(newValue);
      });
    });

    describe('when the values changes to an equal value', () => {
      it('should not change the value', () => {
        const initialValue = { greetings: 'programs' };
        const { rerender, result } = renderHook(
          (value) => useDeepMemo(value),
          { initialProps: initialValue },
        );

        const newValue = { greetings: 'programs' };

        rerender(newValue);

        expect(result.current).toBe(initialValue);
      });
    });
  });
});
