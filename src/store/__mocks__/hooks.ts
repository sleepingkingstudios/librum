import { useDispatch } from 'react-redux';

type UseStoreDispatch = () => typeof useDispatch;

const dispatch = jest.fn();

export const useStoreDispatch: jest.MockedFunction<UseStoreDispatch> =
  jest.fn(() => dispatch);
