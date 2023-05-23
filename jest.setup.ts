import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

process.env.API_URL = 'api.example.com';
