import {
  capitalize,
  kebabCase,
  snakeCase,
} from 'lodash';

export const titleCase = (str?: string): string => (
  kebabCase(str)
    .split('-')
    .map(capitalize)
    .join(' ')
);

export const upperCamelCase = (str: string): string => {
  return snakeCase(str).split('_').map(capitalize).join('');
};
