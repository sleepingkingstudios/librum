import {
  filter,
  isString,
  join,
} from 'lodash';

export const joinClassNames =
  (...classNames: Array<string | null | undefined>): string => {
    return join(filter(classNames, isString), ' ');
  };
