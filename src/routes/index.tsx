import React from 'react';
import { useSelector } from 'react-redux';
import {
  Routes,
  Route,
} from 'react-router-dom';

import { routes as publishersRoutes } from '@core/publishers';
import {
  DemoPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  UserPage,
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
        <Route path="user" element={<UserPage />} />
        <Route path="*" element={<NotFoundPage />} />
        { publishersRoutes() }
      </Route>
    </Routes>
  );
};
