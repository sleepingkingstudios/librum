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
import { useThemeStyles } from '@themes';
import { joinClassNames } from '@utils/react-utils';

export const PageHeaderUser = (): JSX.Element => {
  const dispatch = useDispatch();
  const logout = () => { dispatch(actions.destroy()); };
  const session: Session = useSelector(selector);
  const {
    authenticated,
    user,
  } = session;

  const joinedClassNames = joinClassNames(
    'float-right',
    useThemeStyles('linkDanger'),
  );

  if (!authenticated) { return null; }

  const { username } = user;

  return (
    <div className="text-left">
      <Icon icon={faUser} className='mr-1' />

      <span className="hidden sm:inline">You are currently logged in as </span>

      { username }

      <span className={joinedClassNames}>
        <button onClick={logout}>Log Out</button>
      </span>
    </div>
  )
};
