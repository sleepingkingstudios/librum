import * as React from 'react';
import {
  capitalize,
  snakeCase,
} from 'lodash';

import { isElement } from '@utils/react-utils';
import type { Literal } from '@utils/types';

type DataListItemProps = {
  defaultValue?: JSX.Element | string;
  label: string;
  value: JSX.Element | Literal;
};

const formatLabel = (label: string): string => {
  return snakeCase(label).split('_').map(capitalize).join(' ');
};

const formatValue = (value: Literal): string => {
  return value.toString();
};

const renderValue = ({
  defaultValue,
  value,
}: {
  defaultValue: JSX.Element | string | null,
  value: JSX.Element | Literal,
}): JSX.Element | string => {
  if (isElement(value)) {
    const element = value as JSX.Element;

    return element;
  }

  if (value !== null) {
    const literal = value as Literal;

    return formatValue(literal);
  }

  return defaultValue;
};

export const DataListItem = ({
  defaultValue = null,
  label,
  value,
}: DataListItemProps): JSX.Element => (
  <div className="data-list-item">
    <dt className="data-list-label">
      { formatLabel(label) }
    </dt>
    <dd className="data-list-value">
      { renderValue({ defaultValue, value }) }
    </dd>
  </div>
);
