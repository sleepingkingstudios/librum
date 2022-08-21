import React from 'react';
import { useSelector } from 'react-redux';
import {
  Routes,
  Route
} from "react-router-dom";

import {
  DemoPage,
  HomePage,
  LoginPage,
  NotFoundPage,
} from '@pages';
import { selector } from '@session';
import type { Session } from '@session';

export const ApplicationRoutes = (): JSX.Element => {
  const session: Session = useSelector(selector);
  const { authenticated } = session;

  if (!authenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/">
        <Route index element={<HomePage />} />
        <Route path="demo" element={<DemoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
