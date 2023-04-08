import { fetchRequest } from './fetch-request';
import type { HttpMethod } from '../types';
import {
  formatParams,
  withData,
  withError,
  withStatus,
} from '../utils';

type MockResponseOptions = {
  json?: Record<string, unknown> | Promise<Record<string, unknown>>,
  ok?: boolean,
  status?: number,
  statusText?: string,
  text?: string | Promise<string>,
};

const buildMockBody = <Data>(
  value: Promise<Data> | Data,
): Promise<Data> => {
  if (typeof value === 'object' && 'then' in value) { return value; }

  return new Promise(resolve => resolve(value));
};

const buildMockResponse = ({
  json = {},
  ok = true,
  status = 200,
  statusText = 'OK',
  text = '',
}: MockResponseOptions): Response => ({
  arrayBuffer: jest.fn(),
  blob: jest.fn(),
  body: null,
  bodyUsed: false,
  clone: jest.fn(),
  headers: {
    append: jest.fn(),
    delete: jest.fn(),
    forEach: jest.fn(),
    get: jest.fn(),
    has: jest.fn(),
    set: jest.fn(),
  },
  formData: jest.fn(),
  json: jest.fn(() => buildMockBody<Record<string, unknown>>(json)),
  ok,
  redirected: false,
  status,
  statusText,
  text: jest.fn(() => buildMockBody<string>(text)),
  type: 'basic',
  url: 'www.example.com',
});

const mockFetch = jest.spyOn(global, 'fetch');

const mockResponse = (
  options: MockResponseOptions = {},
): () => Promise<Response> => (
  () => new Promise(resolve => resolve(buildMockResponse(options)))
);

const parseErrorFor = (json: string): Error => {
  try {
    JSON.parse(json);
  } catch (error: unknown) {
    return error as Error;
  }

  return null;
};

describe('API fetchRequest()', () => {
  const url = 'www.example.com';
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const shouldPerformTheRequest = ({
    body = false,
    method,
  }: {
    body?: boolean,
    method?: HttpMethod,
  }): void => {
    const options = method ? { method } : {};
    const defaultOptions = {
      headers: defaultHeaders,
      method: method ? method.toUpperCase() : 'GET',
    };

    it('should call fetch', async () => {
      await fetchRequest(url, options);

      expect(global.fetch).toHaveBeenCalledWith(url, defaultOptions);
    });

    it('should return a response with status "success"', async () => {
      const expected = withStatus({ status: 'success' });
      const response = await fetchRequest(url, options);

      expect(response).toEqual(expected);
    });

    describe('when the response body has data', () => {
      const json = { ok: true, data: { greetings: 'programs' } };

      beforeEach(() => {
        mockFetch.mockImplementationOnce(mockResponse({ json }));
      });

      it('should return a response with status "success"', async () => {
        const expected = withData({
          data: json,
          response: withStatus({ status: 'success' }),
        });
        const response = await fetchRequest(url, options);

        expect(response).toEqual(expected);
      });
    });

    if (body) {
      describe('with body: object', () => {
        const body = { user: { name: 'Alan Bradley' } };
        const expectedOptions = {
          ...defaultOptions,
          body: JSON.stringify(body),
        };

        it('should call fetch', async () => {
          await fetchRequest(url, { body, ...options });

          expect(global.fetch).toHaveBeenCalledWith(url, expectedOptions);
        });
      });

      describe('with body: string', () => {
        const body = 'Greetings, programs!';
        const expectedOptions = {
          ...defaultOptions,
          body,
        };

        it('should call fetch', async () => {
          await fetchRequest(url, { body, ...options });

          expect(global.fetch).toHaveBeenCalledWith(url, expectedOptions);
        });
      });
    }

    describe('with contentType: "text"', () => {
      const expectedHeaders = {
        ...defaultHeaders,
        'Content-Type': 'text/plain',
      };
      const expectedOptions = {
        ...defaultOptions,
        headers: expectedHeaders,
      };

      it('should call fetch', async () => {
        await fetchRequest(url, { contentType: 'text', ...options });

        expect(global.fetch).toHaveBeenCalledWith(url, expectedOptions);
      });

      it('should return a response with status "success"', async () => {
        const expected = withStatus({ status: 'success' });
        const response = await fetchRequest(url, { contentType: 'text' });

        expect(response).toEqual(expected);
      });

      describe('when the response body has data', () => {
        const text = 'Greetings, programs!';

        beforeEach(() => {
          mockFetch.mockImplementationOnce(mockResponse({ text }));
        });

        it('should return a response with status "success"', async () => {
          const expected = withData({
            data: text,
            response: withStatus({ status: 'success' }),
          });
          const response =
            await fetchRequest(url, { contentType: 'text', ...options });

          expect(response).toEqual(expected);
        });
      });
    });

    describe('with headers: value', () => {
      const headers = { 'X-Custom-Header': 'value' };
      const expectedHeaders = {
        ...defaultHeaders,
        ...headers,
      };
      const expectedOptions = {
        ...defaultOptions,
        headers: expectedHeaders,
      };

      it('should call fetch', async () => {
        await fetchRequest(url, { headers, ...options });

        expect(global.fetch).toHaveBeenCalledWith(url, expectedOptions);
      });
    });

    describe('with params: value', () => {
      const params = { key: 'value', salutation: 'greetings programs' };
      const expectedUrl = `${url}${formatParams(params)}`;

      it('should call fetch', async () => {
        await fetchRequest(url, { params, ...options });

        expect(global.fetch).toHaveBeenCalledWith(expectedUrl, defaultOptions);
      });
    });

    describe('with wildcards: value', () => {
      const url = 'api/:namespace/resource/:id';
      const wildcards = {
        id: 'on-war',
        namespace: 'lending-library',
      };

      it('should call fetch', async () => {
        const expectedUrl = 'api/lending-library/resource/on-war';

        await fetchRequest(url, { wildcards, ...options });

        expect(global.fetch).toHaveBeenCalledWith(expectedUrl, defaultOptions);
      });
    });
  };

  beforeEach(() => {
    mockFetch.mockImplementation(mockResponse({}));
  });

  it('should be a function', () => {
    expect(typeof fetchRequest).toBe('function');
  });

  shouldPerformTheRequest({});

  describe('when fetch raises an error', () => {
    const errorMessage = 'Something went wrong';

    beforeEach(() => {
      mockFetch.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });
    });

    it('should return a response with status "errored"', async () => {
      const expected = withError({
        error: `Error: ${errorMessage}`,
        response: withStatus({ status: 'errored' })
      });
      const response = await fetchRequest(url);

      expect(response).toEqual(expected);
    });
  });

  describe('when the response body is empty json', () => {
    const error = parseErrorFor('');

    beforeEach(() => {
      // Note: inside the beforeEach() to avoid an unresolved Promise
      // automatically rejecting if the test is skipped.
      const json: Promise<Record<string, unknown>> =
        new Promise((resolve, reject) => reject(error));

      mockFetch.mockImplementationOnce(mockResponse({ json }));
    });

    it('should return a response with status "errored"', async () => {
      const expected = withError({
        error: error.toString(),
        response: withStatus({ status: 'errored' })
      });
      const response = await fetchRequest(url);

      expect(response).toEqual(expected);
    });
  });

  describe('when the response body is invalid json', () => {
    const error = parseErrorFor('<html />');

    beforeEach(() => {
      // Note: inside the beforeEach() to avoid an unresolved Promise
      // automatically rejecting if the test is skipped.
      const json: Promise<Record<string, unknown>> =
        new Promise((resolve, reject) => reject(error));

      mockFetch.mockImplementationOnce(mockResponse({ json }));
    });

    it('should return a response with status "errored"', async () => {
      const expected = withError({
        error: error.toString(),
        response: withStatus({ status: 'errored' })
      });
      const response = await fetchRequest(url);

      expect(response).toEqual(expected);
    });
  });

  describe('when the response status is failing', () => {
    beforeEach(() => {
      mockFetch.mockImplementationOnce(
        mockResponse({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
        }),
      );
    });

    it('should return a response with status "failure"', async () => {
      const expected = withStatus({ status: 'failure' });
      const response = await fetchRequest(url);

      expect(response).toEqual(expected);
    });
  });

  describe('with method: "delete"', () => {
    shouldPerformTheRequest({ method: 'delete' });
  });

  describe('with method: "get"', () => {
    shouldPerformTheRequest({ method: 'get' });
  });

  describe('with method: "patch"', () => {
    shouldPerformTheRequest({ method: 'patch', body: true });
  });

  describe('with method: "post"', () => {
    shouldPerformTheRequest({ method: 'post', body: true });
  });

  describe('with method: "put"', () => {
    shouldPerformTheRequest({ method: 'put', body: true });
  });
});
