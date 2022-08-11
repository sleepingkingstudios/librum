import * as React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import type { Animations } from '@components/types';
import { joinClassNames } from '@utils/react-utils';

interface IAnimateClassName {
  animate?: Animations;
}

interface ILoadingOverlay {
  animate?: Animations;
  icon?: IconDefinition | false;
  message?: string;
}

interface IRenderIcon {
  animate?: Animations;
  icon?: IconDefinition | false;
}

const animateClassName = ({ animate }: IAnimateClassName): string | null => {
  if (animate === null) { return null; }

  return `animate-${animate} motion-reduce:animate-none`;
}

const renderIcon = ({
  animate = null,
  icon = null,
}: IRenderIcon): JSX.Element => {
  if (icon === false) { return null; }

  if (icon === null) {
    const joinedClassName = joinClassNames(
      animateClassName({ animate: (animate || 'spin') }),
      'h-10 w-10',
    );

    return (
      <Icon className={joinedClassName} icon={faGear} />
    );
  }

  const joinedClassName = joinClassNames(
    animateClassName({ animate }),
    'h-10 w-10',
  );

  return (
    <Icon className={joinedClassName} icon={icon} />
  );
}

export const LoadingOverlay = ({
  animate,
  icon,
  message,
}: ILoadingOverlay) => (
  <div
    className="form-loading-overlay absolute grid h-full place-content-center w-full"
  >
    <div className="inline-block text-center">
      { renderIcon({ animate, icon }) }
      <br />
      { message || "Loading..." }
    </div>
  </div>
);
