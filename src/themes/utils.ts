import {
  camelCase,
  forEach,
  get,
  includes,
  map,
  startsWith,
} from 'lodash';

import { joinClassNames } from '@utils/react-utils';
import { Theme } from './theme';

interface applyThemeProps {
  config: Array<string>;
  theme: Theme;
}

interface resolveClassesProps {
  previousTags?: Array<string>;
  theme: Theme;
  value: string;
}

export const resolveClasses =
  ({ previousTags = [], theme, value }: resolveClassesProps): string => {
    const items = value.split(' ');
    const classNames: Array<string> = [];

    forEach(
      items,
      (item?: string): void => {
        const rawValue: string | undefined = (
          get(theme, item) as string | undefined
        );

        if (!(typeof rawValue === 'string')) { return; }

        const values: Array<string> = rawValue.split(' ');

        forEach(
          values,
          (value: string): void => {
            if (!startsWith(value, '@')) {
              classNames.push(value);

              return;
            }

            if (includes(previousTags, value)) {
              throw `Recursive theme tag ${value} (${previousTags.join(' ')})`;
            }

            const resolved = resolveClasses({
              previousTags: [...previousTags, value],
              theme,
              value: value.slice(1),
            });

            classNames.push(resolved);
          }
        )
      }
    )

    return joinClassNames(...classNames);
  };

export const applyTheme = ({ config, theme }: applyThemeProps): string => (
  joinClassNames(
    ...map(
      config,
      (value: string) => resolveClasses({ theme, value: camelCase(value) })
    )
  )
);
