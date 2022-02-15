import React from 'react';
import {
  Routes,
  Route
} from "react-router-dom";

import { HomePage } from '../home';
import { NotFoundPage } from '../not-found';

export const ApplicationRoutes = (): JSX.Element => (
  <Routes>
    <Route path="/">
      <Route index element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
)
