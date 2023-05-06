import { useNavigate } from 'react-router-dom';

import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useResourceQuery } from './use-resource-query';
import type { DisplayAlertProps } from '@alerts';
import { useApiQuery } from '@api';
import type {
  AlertDirective,
  Middleware,
} from '@api';
import { handleNotFoundMiddleware } from './middleware';

jest.mock('react-router-dom');
jest.mock('@api');
jest.mock('./middleware');

const handleNotFound = jest.fn();
const navigate = jest.fn();

const mockHandleNotFoundMiddleware =
  handleNotFoundMiddleware as jest.MockedFunction<
    typeof handleNotFoundMiddleware
  >;
const mockUseApiQuery =
  useApiQuery as jest.MockedFunction<typeof useApiQuery>;
const mockUseNavigate =
  useNavigate as jest.MockedFunction<typeof useNavigate>;

describe('Resources API hooks', () => {
  describe('useResourceQuery()', () => {
    const action = 'search';
    const member = false;
    const resourceName = 'rareBooks';
    const failureAlert: DisplayAlertProps = {
      context: 'resources:rareBooks:search:request',
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
    const expectedUrl = '/api/rare_books/search';
    const expected = {
      alerts,
      config: { navigate },
      middleware: [] as Middleware[],
      url: expectedUrl,
    };

    beforeEach(() => {
      mockHandleNotFoundMiddleware
        .mockImplementation(() => handleNotFound)
        .mockClear();

      mockUseApiQuery.mockClear();

      mockUseNavigate
        .mockImplementation(() => navigate)
        .mockClear();
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
        config: { navigate },
        middleware: [] as Middleware[],
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
      const expectedUrl = '/www.example.com/search';
      const expected = {
        alerts,
        config: { navigate },
        middleware: [] as Middleware[],
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
      const expectedUrl = '/api/lending_library/rare_books/search';
      const expected = {
        alerts,
        config: { navigate },
        middleware: [] as Middleware[],
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
      const expectedUrl = '/api/rare_books/advanced/query_items';
      const expected = {
        alerts,
        config: { navigate },
        middleware: [] as Middleware[],
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
        context: 'resources:rareBooks:publish:request',
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
      const expectedUrl = '/api/rare_books/:rareBookId/publish';
      const expected = {
        alerts,
        config: { navigate },
        middleware: [handleNotFound],
        url: expectedUrl,
      };

      it('should configure the middleware', () => {
        renderHook(() => useResourceQuery(options));

        expect(mockHandleNotFoundMiddleware).toHaveBeenCalledWith({
          action,
          member,
          resourceName,
        });
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
          config: { navigate },
          middleware: [handleNotFound],
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
        const expectedUrl = '/www.example.com/:rareBookId/publish';
        const expected = {
          alerts,
          config: { navigate },
          middleware: [handleNotFound],
          url: expectedUrl,
        };

        it('should configure the request', () => {
          renderHook(() => useResourceQuery(options));

          expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
        });
      });

      describe('with route: value', () => {
        const route = '/path/to/rare-books';
        const options = {
          action,
          member,
          resourceName,
          route,
        };

        it('should configure the middleware', () => {
          renderHook(() => useResourceQuery(options));

          expect(mockHandleNotFoundMiddleware).toHaveBeenCalledWith({
            action,
            member,
            resourceName,
            route,
          });
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
        const expectedUrl =
          '/api/lending_library/rare_books/:rareBookId/publish';
        const expected = {
          alerts,
          config: { navigate },
          middleware: [handleNotFound],
          url: expectedUrl,
        };

        it('should configure the middleware', () => {
          renderHook(() => useResourceQuery(options));

          expect(mockHandleNotFoundMiddleware).toHaveBeenCalledWith({
            action,
            member,
            resourceName,
            scope,
          });
        });

        it('should configure the request', () => {
          renderHook(() => useResourceQuery(options));

          expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
        });
      });

      describe('with singularName: value', () => {
        const singularName = 'rareTome';
        const options = {
          action,
          member,
          resourceName,
          singularName,
        };

        it('should configure the middleware', () => {
          renderHook(() => useResourceQuery(options));

          expect(mockHandleNotFoundMiddleware).toHaveBeenCalledWith({
            action,
            member,
            resourceName,
            singularName,
          });
        });
      });

      describe('with url: value', () => {
        const url = 'advanced/items/:itemId/publish';
        const options = {
          action,
          member,
          resourceName,
          url,
        };
        const expectedUrl = '/api/rare_books/advanced/items/:itemId/publish';
        const expected = {
          alerts,
          config: { navigate },
          middleware: [handleNotFound],
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
