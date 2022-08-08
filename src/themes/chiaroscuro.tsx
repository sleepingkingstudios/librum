import * as React from 'react';

import type { Theme } from './types';

import './styles/chiaroscuro.css';
import './styles/default-styles.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChiaroscuroTheme = () => (<span className="theme-chiaroscuro" />);

export const chiaroscuro: Theme = {
  className: 'theme-chiaroscuro theme-default-styles',
  name: 'chiaroscuro',
};
