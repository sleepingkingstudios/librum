import * as React from 'react';
import { isEqual } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const useDeepMemo = <Memo extends unknown>(value: Memo): Memo => {
  const ref = React.useRef<Memo>(value);

  if (!isEqual(ref.current, value)) { ref.current = value; }

  return ref.current;
};
