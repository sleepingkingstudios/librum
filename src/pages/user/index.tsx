import * as React from 'react';
import { capitalize } from 'lodash';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { DataList } from '@components/data-list';
import { LoadingOverlay } from '@components/loading-overlay';
import { Page } from '@components/page';
import type { Breadcrumb } from '@components/page';
import { CoreNavigation } from '@core/navigation';
import { useGetUserRequest } from './request';
import { UserUpdatePassword } from './update-password';

type EmptyUser = {
  email: null;
  role: null;
  username: null;
}

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Current User',
    url: '/user',
  },
];

const defaultValue: JSX.Element = (
  <span className="text-muted">(none)</span>
);

const emptyUser: EmptyUser = {
  email: null,
  role: null,
  username: null,
};

const renderLoadingOverlay = (
  { isLoading }: { isLoading: boolean }
): JSX.Element => {
  if (!isLoading) { return null; }

  return (
    <LoadingOverlay icon={faUser} message="Loading User..." />
  );
};

const renderSecurity = (
  { isLoading }: { isLoading: boolean }
): JSX.Element => {
  if (isLoading) { return (<>Loading...</>); }

  return (
    <UserUpdatePassword />
  );
};

export const UserPage = (): JSX.Element => {
  const {
    data,
    isLoading,
  } = useGetUserRequest();
  const user = data ? data.user : emptyUser;
  const formatted = {
    name: user.username,
    email: user.email,
    role: user.role ? capitalize(user.role) : null,
  };

  return (
    <Page breadcrumbs={breadcrumbs} navigation={<CoreNavigation />}>
      <h1>Current User</h1>

      <div className="relative">
        { renderLoadingOverlay({ isLoading }) }

        <DataList data={formatted} defaultValue={defaultValue} />

        <h2 className="mb-2">Security</h2>

        { renderSecurity({ isLoading }) }
      </div>
    </Page>
  );
};
