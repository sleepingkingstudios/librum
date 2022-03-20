import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import type {
  Dispatch,
  RootState,
} from './index';

export const useStoreDispatch = () => useDispatch<Dispatch>();

export const useStoreSelector: TypedUseSelectorHook<RootState> = useSelector;
