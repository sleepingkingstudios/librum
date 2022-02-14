import * as React from 'react';

import { joinClassNames } from '@utils/react-utils';

import './fancy-hr.css';

interface FancyHrProps {
  className?: string;
}

const defaultClassName =
  'fancy_hr border-text-strong after:border-text-strong' +
  ' dark:border-text-strong-dark dark:after:border-text-strong-dark';

export const FancyHr = ({ className }: FancyHrProps): JSX.Element => (
  <hr className={joinClassNames(className, defaultClassName)} />
)
