import * as React from 'react';

import { FancyHr } from '@components/fancy-hr';
import { useThemeStyles } from '@themes';
import { joinClassNames } from '@utils/react-utils';

const defaultClassName = 'mt-3 shrink-0 text-center sm:text-left';

export const PageFooter = (): JSX.Element => {
  const joinedClassNames = joinClassNames(
    defaultClassName,
    useThemeStyles('text-muted'),
  );

  return (
    <footer className={joinedClassNames}>
      <FancyHr className="mb-2" />

      What lies beyond the furthest reaches of the sky?
    </footer>
  );
};
