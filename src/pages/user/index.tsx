import * as React from 'react';
import { capitalize } from 'lodash';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { useAlerts } from '@alerts';
import type { DisplayAlertProps } from '@alerts';
import type { ApiSuccess } from '@api';
import { DataList } from '@components/data-list';
import { LoadingOverlay } from '@components/loading-overlay';
import { Page } from '@components/page';
import type { Breadcrumbs } from '@components/page';
import type { User } from '@session';
import { useGetUserQuery } from '@user/api';

type EmptyUser = {
  email: null;
  role: null;
  username: null;
}

const breadcrumbs: Breadcrumbs = [
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

const failureAlert: DisplayAlertProps = {
  context: 'pages:user:request',
  icon: faUser,
  message: 'Unable to load current user.',
  type: 'failure',
};

const getUser = (
  responseData: ApiSuccess<{ user: User }> = null,
): User | EmptyUser => {
  if (responseData === null) { return emptyUser; }

  const { data } = responseData;
  const { user } = data;

  return user;
};

const renderLoadingOverlay = (
  { isLoading }: { isLoading: boolean }
): JSX.Element => {
  if (!isLoading) { return null; }

  return (
    <LoadingOverlay icon={faUser} message="Loading User..." />
  );
};

export const UserPage = (): JSX.Element => {
  const alertDisplayed = React.useRef(false);
  const {
    dismissAlert,
    displayAlert,
  } = useAlerts();
  const {
    data,
    error,
    isLoading,
  } = useGetUserQuery();
  const user = getUser(data);
  const userData = {
    name: user.username,
    email: user.email,
    role: user.role ? capitalize(user.role) : null,
  };

  React.useEffect(() => {
    if (isLoading) {
      alertDisplayed.current = false;

      if (alertDisplayed.current !== false) {
        dismissAlert(failureAlert.context);
      }

      return;
    }

    if (alertDisplayed.current !== false) {
      return;
    }

    if (error === undefined || error === null) {
      return;
    }

    displayAlert(failureAlert);

    alertDisplayed.current = true;
  });

  return (
    <Page breadcrumbs={breadcrumbs}>
      <h1>Current User</h1>

      <div className="relative">
        { renderLoadingOverlay({ isLoading }) }

        <DataList data={userData} defaultValue={defaultValue} />
      </div>
    </Page>
  );
};
