import React from 'react';
import { createRoot } from 'react-dom/client';

import { Application } from './application';

const container = document.querySelector('#react-root');
const root = createRoot(container);

root.render(<Application />, );
