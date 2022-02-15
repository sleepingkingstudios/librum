import * as React from 'react';

import { joinClassNames } from '@utils/react-utils';

import './fancy-hr.css';

interface FancyHrProps {
  className?: string;
  color?: string;
  darkColor?: string;
}

const defaultClassName =
  ({ color, darkColor }: { color: string, darkColor: string}): string => {
    return `fancy_hr border-${color} after:border-${color}` +
    ` dark:border-${darkColor} dark:after:border-${darkColor}`
  }


export const FancyHr = ({
  className,
  color = 'text-strong',
  darkColor = 'text-strong-dark'
}: FancyHrProps): JSX.Element => {
  const defaults = defaultClassName({ color, darkColor });

  return (
    <hr className={joinClassNames(defaults, className)} />
  );
}
