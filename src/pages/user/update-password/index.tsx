import * as React from 'react';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

import { UserUpdatePasswordForm } from './form';

type RenderChangePasswordProps = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>,
};

const renderChangePasswordForm = (
  { setShowForm }: RenderChangePasswordProps
): JSX.Element => {
  const closeForm = () => { setShowForm(false); }

  return (
    <UserUpdatePasswordForm closeForm={closeForm} />
  );
}

const renderChangePasswordLink = (
  { setShowForm }: RenderChangePasswordProps
): JSX.Element => {
  const onClick = () => { setShowForm(true); }

  return (
    <a onClick={onClick}>
      <Icon className="pr-1" icon={faUserLock} />
      Change Password
    </a>
  );
};

export const UserUpdatePassword = () => {
  const [showForm, setShowForm] = React.useState(false);

  return (
    <>
      {
        showForm ?
          renderChangePasswordForm({ setShowForm }) :
          renderChangePasswordLink({ setShowForm })
      }
    </>
  );
};
