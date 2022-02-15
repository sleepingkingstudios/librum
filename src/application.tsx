import React from 'react';
import { BrowserRouter } from "react-router-dom";

import { ApplicationRoutes } from './routes';

export const Application = (): JSX.Element => {
  return (
    <BrowserRouter>
      <ApplicationRoutes />
    </BrowserRouter>
  );
}
