import * as React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import {
  actions,
  selector,
} from '@session';
import type { Session } from '@session';
import {
  useDispatch,
  useSelector,
} from '@store';

export const PageUser = (): JSX.Element => {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(actions.destroy());

    localStorage.removeItem('session');
  };
  const session: Session = useSelector(selector);
  const {
    authenticated,
    user,
  } = session;

  if (!authenticated) { return null; }

  const { username } = user;

  return (
    <div className="text-left mt-2">
      <Icon icon={faUser} className='mr-1' />

      <span className="hidden sm:inline">You are currently logged in as </span>

      { username }

      <span className='float-right link-danger'>
        <button onClick={logout}>Log Out</button>
      </span>
    </div>
  )
};
