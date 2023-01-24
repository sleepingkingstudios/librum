import * as React from 'react';

import {
  filter,
  isString,
  join,
} from 'lodash';

const reactPattern = /\.createElement/;

export const buildComponent = (
  maybeComponent: unknown,
  props: Record<string, unknown> = {},
): React.ReactNode => {
  if (maybeComponent === undefined || maybeComponent === null) { return null; }

  if (typeof maybeComponent === 'string') { return maybeComponent; }

  if (isElement(maybeComponent)) { return maybeComponent; }

  if (isComponent(maybeComponent)) {
    const Component = maybeComponent as React.ComponentType;

    return (<Component {...props} />);
  }

  return null;
};

export const isComponent = (maybeComponent: unknown): boolean => {
  if (typeof maybeComponent !== 'function') { return false; }

  return reactPattern.test(String(maybeComponent));
};

export const isElement = React.isValidElement;

export const joinClassNames = (
  ...classNames: Array<string | null | undefined>
): string => {
  return join(
    filter(
      classNames,
      (item: string | null | undefined) => (
        isString(item) && item.length !== 0
      )
    ),
    ' '
  );
};
