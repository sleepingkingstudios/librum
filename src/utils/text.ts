import {
  capitalize,
  kebabCase,
} from 'lodash';

export const titleCase = (str?: string): string => (
  kebabCase(str)
    .split('-')
    .map(capitalize)
    .join(' ')
);
