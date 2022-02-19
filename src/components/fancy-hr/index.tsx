import * as React from 'react';

import { joinClassNames } from '@utils/react-utils';
import { useThemeStyles } from '@themes';

import './fancy-hr.css';

interface FancyHrProps {
  className?: string;
  style?: string;
}

export const FancyHr = ({ className, style }: FancyHrProps): JSX.Element => {
  const joinedClassNames = joinClassNames(
    'fancy-hr',
    useThemeStyles(style ? style : 'hr'),
    className,
  );

  return (
    <hr className={joinedClassNames} />
  );
}
