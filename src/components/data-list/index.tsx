import * as React from 'react';

import { DataListItem } from './item';
import type { Literal } from '@utils/types';

export const DataList = ({
  data,
  defaultValue = null,
}: {
  data: Record<string, Literal>,
  defaultValue?: JSX.Element | string,
}): JSX.Element => {
  const entries = Object.entries(data);

  return (
    <dl className="data-list">
      {
        entries.map((tuple) => {
          const [label, value] = tuple;

          return (
            <DataListItem key={label} defaultValue={defaultValue} label={label} value={value} />
          );
        })
      }
    </dl>
  );
};
