import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import type { FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import type { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';

import { baseQuery } from './base-query';

jest.mock('@reduxjs/toolkit/dist/query');

const expectedData = {
  ok: true,
  users: [
    {
      firstName: 'Alan',
      lastName: 'Bradley',
    },
  ],
};
const fetchQuery = jest.fn(() => ({
  data: {
    ok: true,
    users: [
      {
        first_name: 'Alan',
        last_name: 'Bradley',
      },
    ],
  },
  error: undefined,
  meta: undefined,
}));
const mockBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
mockBaseQuery.mockImplementation((args: FetchBaseQueryArgs) => fetchQuery);

describe('api baseQuery()', () => {
  const abortSignal = {
    aborted: false,
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    onabort: jest.fn(),
    reason: 'just cause',
    removeEventListener: jest.fn(),
    throwIfAborted: jest.fn(),
  };
  const api: BaseQueryApi = {
    abort: jest.fn(),
    dispatch: jest.fn(),
    endpoint: 'http://www.example.com',
    extra: null,
    getState: jest.fn(),
    signal: abortSignal,
    type: 'query',
  };
  const query = baseQuery({ baseUrl: 'http://www.example.com' });
  const options = { key: 'value' };

  it('should be a function', () => {
    expect(typeof baseQuery).toBe('function');
  });

  it('should return a function', () => {
    expect(typeof query).toBe('function');
  });

  describe('with args: a string', () => {
    const args = 'value';

    it('should call the fetch query', async () => {
      await query(args, api, options);

      expect(fetchQuery).toHaveBeenCalledWith(args, api, options);
    });

    it('should convert the response to camelCase', async () => {
      const { data } = await query(args, api, options);

      expect(data).toEqual(expectedData);
    });
  });

  describe('with args: an object with a body', () => {
    const args: FetchArgs = {
      body: {
        firstName: 'Alan',
        lastName: 'Bradley',
      },
      url: 'http://www.example.com/endpoint',
    };
    const expectedArgs: FetchArgs = {
      body: {
        first_name: 'Alan',
        last_name: 'Bradley',
      },
      url: 'http://www.example.com/endpoint',
    };

    it('should convert the request to snake_case', async () => {
      await query(args, api, options);

      expect(fetchQuery).toHaveBeenCalledWith(expectedArgs, api, options);
    });
  });

  describe('with args: an object with query params', () => {
    const args: FetchArgs = {
      params: {
        pageOffset: 3,
        perPage: 5,
      },
      url: 'http://www.example.com/endpoint',
    };
    const expectedArgs: FetchArgs = {
      params: {
        page_offset: 3,
        per_page: 5,
      },
      url: 'http://www.example.com/endpoint',
    };

    it('should convert the request to snake_case', async () => {
      await query(args, api, options);

      expect(fetchQuery).toHaveBeenCalledWith(expectedArgs, api, options);
    });
  });
});
