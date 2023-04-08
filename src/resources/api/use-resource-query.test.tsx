import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useResourceQuery } from './use-resource-query';
import type { DisplayAlertProps } from '@alerts';
import { useApiQuery } from '@api/request';
import type { AlertDirective } from '@api/request';

jest.mock('@api/request');

const mockUseApiQuery =
  useApiQuery as jest.MockedFunction<typeof useApiQuery>;

describe('Resources API hooks', () => {
  describe('useResourceQuery()', () => {
    const action = 'search';
    const member = false;
    const resourceName = 'rareBooks';
    const failureAlert: DisplayAlertProps = {
      context: 'resources:rareBooks:request',
      message: 'Unable to search rare books',
      type: 'failure',
    };
    const alerts: AlertDirective[] = [
      {
        display: failureAlert,
        status: 'errored',
      },
      {
        display: failureAlert,
        status: 'failure',
      },
      {
        dismiss: failureAlert.context,
        status: 'success',
      },
    ];
    const options = {
      action,
      member,
      resourceName,
    };
    const expectedUrl = 'api/rare_books/search';
    const expected = {
      alerts,
      url: expectedUrl,
    };

    beforeEach(() => {
      mockUseApiQuery.mockClear();
    });

    it('should be a function', () => {
      expect(typeof useResourceQuery).toBe('function');
    });

    it('should configure the request', () => {
      renderHook(() => useResourceQuery(options));

      expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
    });

    describe('with alerts: value', () => {
      const alerts: AlertDirective[] = [{
        display: { message: 'Powering up reactor...' },
        status: 'success',
      }];
      const options = {
        action,
        alerts,
        member,
        resourceName,
      };
      const expected = {
        alerts,
        url: expectedUrl,
      };

      it('should configure the request', () => {
        renderHook(() => useResourceQuery(options));

        expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
      });
    });

    describe('with baseUrl: value', () => {
      const baseUrl = 'www.example.com';
      const options = {
        action,
        baseUrl,
        member,
        resourceName,
      };
      const expectedUrl = 'www.example.com/search';
      const expected = {
        alerts,
        url: expectedUrl,
      };

      it('should configure the request', () => {
        renderHook(() => useResourceQuery(options));

        expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
      });
    });

    describe('with scope: value', () => {
      const scope = 'lendingLibrary';
      const options = {
        action,
        member,
        resourceName,
        scope,
      };
      const expectedUrl = 'api/lending_library/rare_books/search';
      const expected = {
        alerts,
        url: expectedUrl,
      };

      it('should configure the request', () => {
        renderHook(() => useResourceQuery(options));

        expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
      });
    });

    describe('with url: value', () => {
      const url = 'advanced/query_items';
      const options = {
        action,
        member,
        resourceName,
        url,
      };
      const expectedUrl = 'api/rare_books/advanced/query_items';
      const expected = {
        alerts,
        url: expectedUrl,
      };

      it('should configure the request', () => {
        renderHook(() => useResourceQuery(options));

        expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
      });
    });

    describe('with a member action', () => {
      const action = 'publish';
      const member = true;
      const failureAlert: DisplayAlertProps = {
        context: 'resources:rareBooks:request',
        message: 'Unable to publish rare book',
        type: 'failure',
      };
      const alerts: AlertDirective[] = [
        {
          display: failureAlert,
          status: 'errored',
        },
        {
          display: failureAlert,
          status: 'failure',
        },
        {
          dismiss: failureAlert.context,
          status: 'success',
        },
      ];
      const options = {
        action,
        member,
        resourceName,
      };
      const expectedUrl = 'api/rare_books/:id/publish';
      const expected = {
        alerts,
        url: expectedUrl,
      };

      it('should configure the request', () => {
        renderHook(() => useResourceQuery(options));

        expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
      });

      describe('with alerts: value', () => {
        const alerts: AlertDirective[] = [{
          display: { message: 'Powering up reactor...' },
          status: 'success',
        }];
        const options = {
          action,
          alerts,
          member,
          resourceName,
        };
        const expected = {
          alerts,
          url: expectedUrl,
        };

        it('should configure the request', () => {
          renderHook(() => useResourceQuery(options));

          expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
        });
      });

      describe('with baseUrl: value', () => {
        const baseUrl = 'www.example.com';
        const options = {
          action,
          baseUrl,
          member,
          resourceName,
        };
        const expectedUrl = 'www.example.com/:id/publish';
        const expected = {
          alerts,
          url: expectedUrl,
        };

        it('should configure the request', () => {
          renderHook(() => useResourceQuery(options));

          expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
        });
      });

      describe('with scope: value', () => {
        const scope = 'lendingLibrary';
        const options = {
          action,
          member,
          resourceName,
          scope,
        };
        const expectedUrl = 'api/lending_library/rare_books/:id/publish';
        const expected = {
          alerts,
          url: expectedUrl,
        };

        it('should configure the request', () => {
          renderHook(() => useResourceQuery(options));

          expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
        });
      });

      describe('with url: value', () => {
        const url = 'advanced/items/:item_id/publish';
        const options = {
          action,
          member,
          resourceName,
          url,
        };
        const expectedUrl = 'api/rare_books/advanced/items/:item_id/publish';
        const expected = {
          alerts,
          url: expectedUrl,
        };

        it('should configure the request', () => {
          renderHook(() => useResourceQuery(options));

          expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
        });
      });
    });
  });
});
