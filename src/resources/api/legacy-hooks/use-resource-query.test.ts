import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useResourceQuery } from './use-resource-query';
import { useAlerts as mockUseAlerts } from '@alerts/mocks';
import type {
  Effect,
  UseQuery,
} from '@api';
import type { AlertDirective } from '@api/effects/display-alerts';
import {
  defaultResult,
  defaultResponse,
  failureResult,
  failureResponse,
  loadingResult,
  successResult,
  successResponse,
} from '@api/test-helpers';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@alerts', () => require('@alerts/mocks'));
jest.mock('@store/hooks');

const { displayAlert } = mockUseAlerts();

describe('Resource API hooks', () => {
  describe('useResourceQuery', () => {
    const resourceName = 'rareBooks';
    const useQuery: jest.MockedFunction<UseQuery> =
      jest.fn(() => defaultResult);

    beforeEach(() => {
      displayAlert.mockClear();
      useQuery.mockClear();
      useQuery.mockImplementation(() => defaultResult);
    });

    it('should be a function', () => {
      expect(typeof useResourceQuery).toBe('function');
    });

    describe('with member: false', () => {
      const action = 'published';
      const member = false;

      describe('with default options', () => {
        const useRequest = useResourceQuery({
          action,
          member,
          resourceName,
          useQuery,
        });

        it('should call the useQuery hook', () => {
          renderHook(() => useRequest());

          expect(useQuery).toHaveBeenCalled();
        });

        it('should return the response', () => {
          const { result } = renderHook(() => useRequest());
          const { current } = result;

          expect(current).toEqual(defaultResponse);
        });

        it('should not display an alert', () => {
          renderHook(() => useRequest());

          expect(displayAlert).not.toHaveBeenCalled();
        });

        describe('with a failing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => loadingResult);
          });

          it('should return the response', () => {
            useQuery.mockImplementation(() => failureResult);

            const { result } = renderHook(() => useRequest());
            const { current } = result;

            expect(current).toEqual(failureResponse);
          });

          it('should display an alert', () => {
            const alert = {
              context: 'resources:rareBooks:request',
              message: 'Unable to published rare books',
              type: 'failure',
            };

            const { rerender } = renderHook(() => useRequest());

            useQuery.mockImplementation(() => failureResult);

            rerender();

            expect(displayAlert).toHaveBeenCalledWith(alert);
          });
        });

        describe('with a passing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => successResult);
          });

          it('should return the response', () => {
            const { result } = renderHook(() => useRequest());
            const { current } = result;

            expect(current).toEqual(successResponse);
          });

          it('should not display an alert', () => {
            renderHook(() => useRequest());

            expect(displayAlert).not.toHaveBeenCalled();
          });
        });
      });

      describe('with alerts: false', () => {
        const useRequest = useResourceQuery({
          action,
          alerts: false,
          member,
          resourceName,
          useQuery,
        });

        it('should not display an alert', () => {
          renderHook(() => useRequest());

          expect(displayAlert).not.toHaveBeenCalled();
        });

        describe('with a failing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => loadingResult);
          });

          it('should not display an alert', () => {
            const { rerender } = renderHook(() => useRequest());

            useQuery.mockImplementation(() => failureResult);

            rerender();

            expect(displayAlert).not.toHaveBeenCalled();
          });
        });

        describe('with a passing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => successResult);
          });

          it('should not display an alert', () => {
            renderHook(() => useRequest());

            expect(displayAlert).not.toHaveBeenCalled();
          });
        });
      });

      describe('with alerts: value', () => {
        const alerts: AlertDirective[] = [
          {
            display: {
              message: 'Resource is loading',
              type: 'info',
            },
            status: 'loading',
          },
          {
            display: {
              message: 'Unable to load resource',
              type: 'failure',
            },
            status: 'failure',
          },
          {
            display: {
              message: 'Resource has loaded',
              type: 'success',
            },
            status: 'success',
          },
        ];
        const useRequest = useResourceQuery({
          action,
          alerts,
          member,
          resourceName,
          useQuery,
        });

        it('should not display an alert', () => {
          renderHook(() => useRequest());

          expect(displayAlert).not.toHaveBeenCalled();
        });

        describe('with a failing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => loadingResult);
          });

          it('should display an alert', () => {
            const { rerender } = renderHook(() => useRequest());

            expect(displayAlert).toHaveBeenCalledWith({
              message: 'Resource is loading',
              type: 'info',
            });

            displayAlert.mockClear();

            useQuery.mockImplementation(() => failureResult);

            rerender();

            expect(displayAlert).toHaveBeenCalledWith({
              message: 'Unable to load resource',
              type: 'failure',
            });
          });
        });

        describe('with a passing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => successResult);
          });

          it('should display an alert', () => {
            renderHook(() => useRequest());

            expect(displayAlert).toHaveBeenCalledWith({
              message: 'Resource has loaded',
              type: 'success',
            });
          });
        });
      });

      describe('with effects: value', () => {
        const effect: jest.MockedFunction<Effect> = jest.fn();
        const useRequest = useResourceQuery({
          action,
          effects: [effect],
          member,
          resourceName,
          useQuery,
        });

        it('should call the useQuery hook', () => {
          renderHook(() => useRequest());

          expect(useQuery).toHaveBeenCalled();
        });

        it('should return the response', () => {
          const { result } = renderHook(() => useRequest());
          const { current } = result;

          expect(current).toEqual(defaultResponse);
        });

        it('should not display an alert', () => {
          renderHook(() => useRequest());

          expect(displayAlert).not.toHaveBeenCalled();
        });

        it('should call the effect', () => {
          renderHook(() => useRequest());

          expect(effect).toHaveBeenCalledWith(
            defaultResponse,
            expect.anything(),
          );
        });

        describe('with a failing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => loadingResult);
          });

          it('should return the response', () => {
            useQuery.mockImplementation(() => failureResult);

            const { result } = renderHook(() => useRequest());
            const { current } = result;

            expect(current).toEqual(failureResponse);
          });

          it('should display an alert', () => {
            const alert = {
              context: 'resources:rareBooks:request',
              message: 'Unable to published rare books',
              type: 'failure',
            };

            const { rerender } = renderHook(() => useRequest());

            useQuery.mockImplementation(() => failureResult);

            rerender();

            expect(displayAlert).toHaveBeenCalledWith(alert);
          });

          it('should call the effect', () => {
            const { rerender } = renderHook(() => useRequest());

            useQuery.mockImplementation(() => failureResult);

            rerender();

            expect(effect).toHaveBeenCalledWith(
              failureResponse,
              expect.anything(),
            );
          });
        });

        describe('with a passing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => successResult);
          });

          it('should return the response', () => {
            const { result } = renderHook(() => useRequest());
            const { current } = result;

            expect(current).toEqual(successResponse);
          });

          it('should not display an alert', () => {
            renderHook(() => useRequest());

            expect(displayAlert).not.toHaveBeenCalled();
          });

          it('should call the effect', () => {
            renderHook(() => useRequest());

            expect(effect).toHaveBeenCalledWith(
              successResponse,
              expect.anything(),
            );
          });
        });
      });
    });

    describe('with member: true', () => {
      const action = 'publish';
      const member = true;
      const id = 'on-war';
      const wildcards = { id };

      describe('with default options', () => {
        const useRequest = useResourceQuery({
          action,
          member,
          resourceName,
          useQuery,
        });

        it('should call the useQuery hook', () => {
          renderHook(() => useRequest({ wildcards }));

          expect(useQuery).toHaveBeenCalled();
        });

        it('should return the response', () => {
          const { result } = renderHook(() => useRequest({ wildcards }));
          const { current } = result;

          expect(current).toEqual(defaultResponse);
        });

        it('should not display an alert', () => {
          renderHook(() => useRequest({ wildcards }));

          expect(displayAlert).not.toHaveBeenCalled();
        });

        describe('with a failing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => loadingResult);
          });

          it('should return the response', () => {
            useQuery.mockImplementation(() => failureResult);

            const { result } = renderHook(() => useRequest({ wildcards }));
            const { current } = result;

            expect(current).toEqual(failureResponse);
          });

          it('should display an alert', () => {
            const alert = {
              context: 'resources:rareBooks:request',
              message: 'Unable to publish rare book',
              type: 'failure',
            };

            const { rerender } = renderHook(() => useRequest({ wildcards }));

            useQuery.mockImplementation(() => failureResult);

            rerender({ wildcards });

            expect(displayAlert).toHaveBeenCalledWith(alert);
          });
        });

        describe('with a passing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => successResult);
          });

          it('should return the response', () => {
            const { result } = renderHook(() => useRequest({ wildcards }));
            const { current } = result;

            expect(current).toEqual(successResponse);
          });

          it('should not display an alert', () => {
            renderHook(() => useRequest({ wildcards }));

            expect(displayAlert).not.toHaveBeenCalled();
          });
        });
      });

      describe('with alerts: false', () => {
        const useRequest = useResourceQuery({
          action,
          alerts: false,
          member,
          resourceName,
          useQuery,
        });

        it('should not display an alert', () => {
          renderHook(() => useRequest({ wildcards }));

          expect(displayAlert).not.toHaveBeenCalled();
        });

        describe('with a failing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => loadingResult);
          });

          it('should not display an alert', () => {
            const { rerender } = renderHook(() => useRequest({ wildcards }));

            useQuery.mockImplementation(() => failureResult);

            rerender({ wildcards });

            expect(displayAlert).not.toHaveBeenCalled();
          });
        });

        describe('with a passing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => successResult);
          });

          it('should not display an alert', () => {
            renderHook(() => useRequest({ wildcards }));

            expect(displayAlert).not.toHaveBeenCalled();
          });
        });
      });

      describe('with alerts: value', () => {
        const alerts: AlertDirective[] = [
          {
            display: {
              message: 'Resource is loading',
              type: 'info',
            },
            status: 'loading',
          },
          {
            display: {
              message: 'Unable to load resource',
              type: 'failure',
            },
            status: 'failure',
          },
          {
            display: {
              message: 'Resource has loaded',
              type: 'success',
            },
            status: 'success',
          },
        ];
        const useRequest = useResourceQuery({
          action,
          alerts,
          member,
          resourceName,
          useQuery,
        });

        it('should not display an alert', () => {
          renderHook(() => useRequest({ wildcards }));

          expect(displayAlert).not.toHaveBeenCalled();
        });

        describe('with a failing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => loadingResult);
          });

          it('should display an alert', () => {
            const { rerender } = renderHook(() => useRequest({ wildcards }));

            expect(displayAlert).toHaveBeenCalledWith({
              message: 'Resource is loading',
              type: 'info',
            });

            displayAlert.mockClear();

            useQuery.mockImplementation(() => failureResult);

            rerender({ wildcards });

            expect(displayAlert).toHaveBeenCalledWith({
              message: 'Unable to load resource',
              type: 'failure',
            });
          });
        });

        describe('with a passing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => successResult);
          });

          it('should display an alert', () => {
            renderHook(() => useRequest({ wildcards }));

            expect(displayAlert).toHaveBeenCalledWith({
              message: 'Resource has loaded',
              type: 'success',
            });
          });
        });
      });

      describe('with effects: value', () => {
        const effect: jest.MockedFunction<Effect> = jest.fn();
        const useRequest = useResourceQuery({
          action,
          effects: [effect],
          member,
          resourceName,
          useQuery,
        });

        it('should call the useQuery hook', () => {
          renderHook(() => useRequest({ wildcards }));

          expect(useQuery).toHaveBeenCalled();
        });

        it('should return the response', () => {
          const { result } = renderHook(() => useRequest({ wildcards }));
          const { current } = result;

          expect(current).toEqual(defaultResponse);
        });

        it('should not display an alert', () => {
          renderHook(() => useRequest({ wildcards }));

          expect(displayAlert).not.toHaveBeenCalled();
        });

        it('should call the effect', () => {
          renderHook(() => useRequest({ wildcards }));

          expect(effect).toHaveBeenCalledWith(
            defaultResponse,
            expect.anything(),
          );
        });

        describe('with a failing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => loadingResult);
          });

          it('should return the response', () => {
            useQuery.mockImplementation(() => failureResult);

            const { result } = renderHook(() => useRequest({ wildcards }));
            const { current } = result;

            expect(current).toEqual(failureResponse);
          });

          it('should display an alert', () => {
            const alert = {
              context: 'resources:rareBooks:request',
              message: 'Unable to publish rare book',
              type: 'failure',
            };

            const { rerender } = renderHook(() => useRequest({ wildcards }));

            useQuery.mockImplementation(() => failureResult);

            rerender({ wildcards });

            expect(displayAlert).toHaveBeenCalledWith(alert);
          });

          it('should call the effect', () => {
            const { rerender } = renderHook(() => useRequest({ wildcards }));

            useQuery.mockImplementation(() => failureResult);

            rerender({ wildcards });

            expect(effect).toHaveBeenCalledWith(
              failureResponse,
              expect.anything(),
            );
          });
        });

        describe('with a passing result', () => {
          beforeEach(() => {
            useQuery.mockImplementation(() => successResult);
          });

          it('should return the response', () => {
            const { result } = renderHook(() => useRequest({ wildcards }));
            const { current } = result;

            expect(current).toEqual(successResponse);
          });

          it('should not display an alert', () => {
            renderHook(() => useRequest({ wildcards }));

            expect(displayAlert).not.toHaveBeenCalled();
          });

          it('should call the effect', () => {
            renderHook(() => useRequest({ wildcards }));

            expect(effect).toHaveBeenCalledWith(
              successResponse,
              expect.anything(),
            );
          });
        });
      });
    });
  });
});
