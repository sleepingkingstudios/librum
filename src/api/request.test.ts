import { buildRequest } from './request';
import type {
  Request,
  UseRequest,
} from './request';
import type { Mutation } from '@api';
import { applyMiddleware } from '@utils/middleware';
import type {
  Middleware,
  MiddlewareBuilder,
} from '@utils/middleware';
import type { DataObject } from '@utils/types';

jest.mock('@utils/middleware');

const mockApplyMiddleware =
  applyMiddleware as jest.MockedFunction<typeof applyMiddleware>;

mockApplyMiddleware.mockImplementation((fn: Request) => fn);

const shouldBuildTheMiddleware = ({
  middleware = [],
  options = {},
  useRequest,
}: {
  middleware: jest.MockedFunction<MiddlewareBuilder>[],
  options?: DataObject,
  useRequest: UseRequest,
}) => {
  const mutation = jest.fn();

  it('should build the middleware', () => {
    useRequest({ mutation, options });

    middleware.forEach((builder) => {
      expect(builder).toHaveBeenCalledWith(options);
    });
  });
};

const shouldPerformTheRequest = ({
  middleware = [],
  mutation,
  params = {},
  request,
}: {
  middleware?: Middleware[],
  mutation: jest.MockedFunction<Mutation>,
  params?: DataObject,
  request: Request,
}) => {
  const values = { id: 12345 };

  beforeEach(() => {
    mockApplyMiddleware.mockClear();

    mutation.mockClear();
  });

  it('should apply the middleware', async () => {
    await request(values);

    expect(applyMiddleware).toHaveBeenCalledWith(mutation, middleware);
  });

  it('should call the mutation', async () => {
    const expected = {
      ...params,
      ...values,
    };

    await request(values);

    expect(mutation).toHaveBeenCalledWith(expected);
  });
};

describe('buildRequest()', () => {
  it('should be a function', () => {
    expect(typeof buildRequest).toBe('function');
  });

  describe('with no params', () => {
    const useRequest = buildRequest({});
    const mutation = jest.fn();

    describe('with a mutation', () => {
      const request = useRequest({ mutation });

      it('should return a function', () => {
        expect(typeof request).toBe('function');
      });

      shouldPerformTheRequest({ mutation, request });
    });
  });

  describe('with annotations', () => {
    const useRequest = buildRequest(
      {},
      { name: 'test:request' },
    );
    const mutation = jest.fn();

    it('should annotate the request hook', () => {
      const expected = {
        middleware: [] as unknown[],
        name: 'test:request',
        params: {},
        type: 'hooks:useRequest',
      };

      expect(useRequest.annotations).toEqual(expected);
    });

    describe('with a mutation', () => {
      const request = useRequest({ mutation });

      it('should annotate the request', () => {
        const expected = {
          middleware: [] as unknown[],
          mutation,
          name: 'test:request',
          options: {},
          params: {},
          type: 'request',
        };

        expect(request.annotations).toEqual(expected);
      });
    });

    describe('with a mutation and options', () => {
      const options = { doSomething: jest.fn() };
      const request = useRequest({ mutation, options });

      it('should annotate the request', () => {
        const expected = {
          middleware: [] as unknown[],
          mutation,
          name: 'test:request',
          options,
          params: {},
          type: 'request',
        };

        expect(request.annotations).toEqual(expected);
      });
    });
  });

  describe('with middleware: a function', () => {
    const middleware: Middleware = jest.fn();
    const middlewareBuilder: jest.MockedFunction<MiddlewareBuilder> = jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (options: DataObject) => middleware
    );
    const useRequest = buildRequest({ middleware: middlewareBuilder });
    const mutation = jest.fn();

    describe('with a mutation', () => {
      const request = useRequest({ mutation });

      shouldBuildTheMiddleware({
        middleware: [middlewareBuilder],
        useRequest,
      });

      shouldPerformTheRequest({
        middleware: [middleware],
        mutation,
        request,
      });
    });

    describe('with a mutation and options', () => {
      const options = { doSomething: jest.fn() };

      shouldBuildTheMiddleware({
        middleware: [middlewareBuilder],
        options,
        useRequest,
      });
    });
  });

  describe('with middleware: a function and annotations', () => {
    const middleware: Middleware = () => null;
    const middlewareBuilder: jest.MockedFunction<MiddlewareBuilder> = jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (options: DataObject) => middleware
    );
    const useRequest = buildRequest(
      { middleware: middlewareBuilder },
      { name: 'test:request' },
    );
    const mutation = jest.fn();

    it('should annotate the request hook', () => {
      const expected = {
        middleware: [middlewareBuilder],
        name: 'test:request',
        params: {},
        type: 'hooks:useRequest',
      };

      expect(useRequest.annotations).toEqual(expected);
    });

    describe('with a mutation', () => {
      const request = useRequest({ mutation });

      it('should annotate the request', () => {
        const expected = {
          middleware: [middleware],
          mutation,
          name: 'test:request',
          options: {},
          params: {},
          type: 'request',
        };

        expect(request.annotations).toEqual(expected);
      });
    });

    describe('with a mutation and options', () => {
      const options = { doSomething: jest.fn() };
      const request = useRequest({ mutation, options });

      it('should annotate the request', () => {
        const expected = {
          middleware: [middleware],
          mutation,
          name: 'test:request',
          options,
          params: {},
          type: 'request',
        };

        expect(request.annotations).toEqual(expected);
      });
    });
  });

  describe('with middleware: an array', () => {
    const middleware: Middleware[] = [
      jest.fn(),
      jest.fn(),
      jest.fn()
    ];
    const middlewareBuilders: jest.MockedFunction<MiddlewareBuilder>[] =
      middleware.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (item) => jest.fn((options: DataObject) => item)
      );
    const useRequest = buildRequest({ middleware: middlewareBuilders });
    const mutation = jest.fn();

    describe('with a mutation', () => {
      const request = useRequest({ mutation });

      shouldBuildTheMiddleware({
        middleware: middlewareBuilders,
        useRequest,
      });

      shouldPerformTheRequest({
        middleware,
        mutation,
        request,
      });
    });

    describe('with a mutation and options', () => {
      const options = { doSomething: jest.fn() };

      shouldBuildTheMiddleware({
        middleware: middlewareBuilders,
        options,
        useRequest,
      });
    });
  });

  describe('with middleware: an array and annotations', () => {
    const middleware: Middleware[] = [
      jest.fn(),
      jest.fn(),
      jest.fn()
    ];
    const middlewareBuilders: jest.MockedFunction<MiddlewareBuilder>[] =
      middleware.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (item) => jest.fn((options: DataObject) => item)
      );
    const useRequest = buildRequest(
      { middleware: middlewareBuilders },
      { name: 'test:request' },
    );
    const mutation = jest.fn();

    it('should annotate the request hook', () => {
      const expected = {
        middleware: middlewareBuilders,
        name: 'test:request',
        params: {},
        type: 'hooks:useRequest',
      };

      expect(useRequest.annotations).toEqual(expected);
    });

    describe('with a mutation', () => {
      const request = useRequest({ mutation });

      it('should annotate the request', () => {
        const expected = {
          middleware,
          mutation,
          name: 'test:request',
          options: {},
          params: {},
          type: 'request',
        };

        expect(request.annotations).toEqual(expected);
      });
    });

    describe('with a mutation and options', () => {
      const options = { doSomething: jest.fn() };
      const request = useRequest({ mutation, options });

      it('should annotate the request', () => {
        const expected = {
          middleware,
          mutation,
          name: 'test:request',
          options,
          params: {},
          type: 'request',
        };

        expect(request.annotations).toEqual(expected);
      });
    });
  });

  describe('with params: value', () => {
    const params = { parentId: 67890 }
    const useRequest = buildRequest({ params });
    const mutation = jest.fn();

    describe('with a mutation', () => {
      const request = useRequest({ mutation });

      shouldPerformTheRequest({
        mutation,
        params,
        request,
      });
    });
  });

  describe('with params: value and annotations', () => {
    const params = { parentId: 67890 }
    const useRequest = buildRequest(
      { params },
      { name: 'test:request' },
    );
    const mutation = jest.fn();

    it('should annotate the request hook', () => {
      const expected = {
        middleware: [] as unknown[],
        name: 'test:request',
        params,
        type: 'hooks:useRequest',
      };

      expect(useRequest.annotations).toEqual(expected);
    });

    describe('with a mutation', () => {
      const request = useRequest({ mutation });

      it('should annotate the request', () => {
        const expected = {
          middleware: [] as unknown[],
          mutation,
          name: 'test:request',
          options: {},
          params,
          type: 'request',
        };

        expect(request.annotations).toEqual(expected);
      });
    });

    describe('with a mutation and options', () => {
      const options = { doSomething: jest.fn() };
      const request = useRequest({ mutation, options });

      it('should annotate the request', () => {
        const expected = {
          middleware: [] as unknown[],
          mutation,
          name: 'test:request',
          options,
          params,
          type: 'request',
        };

        expect(request.annotations).toEqual(expected);
      });
    });
  });
});
