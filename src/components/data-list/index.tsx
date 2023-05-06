import * as React from 'react';

import { DataListItem } from './item';
import type { DataListData } from './types';

export type { DataListData } from './types';

export const DataList = ({
  data,
  defaultValue = null,
}: {
  data: DataListData,
  defaultValue?: JSX.Element | string,
}): JSX.Element => {
  const entries = Object.entries(data);

  return (
    <dl className="data-list">
      {
        entries.map((tuple) => {
          const [label, value] = tuple;

          return (
            <DataListItem
              key={label}
              defaultValue={defaultValue}
              label={label}
              value={value}
            />
          );
        })
      }
    </dl>
  );
};
