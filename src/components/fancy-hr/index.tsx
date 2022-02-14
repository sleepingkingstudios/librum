import * as React from 'react';

import { joinClassNames } from '@utils/react-utils';

import './fancy-hr.css';

interface FancyHrProps {
  className?: string;
}

export const FancyHr = ({ className }: FancyHrProps): JSX.Element => (
  <hr className={joinClassNames(className, 'fancy_hr')} />
)
