import * as React from 'react';

import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { joinClassNames } from '@utils/react-utils';

import type {
  ButtonProps,
  LinkButtonProps,
  PlainButtonProps,
} from './types';

export type { ButtonProps } from './types';

const generateClassName = ({
  className,
  outline = false,
  size,
  type,
}: {
  className?: string,
  outline: boolean,
  size?: string,
  type?: string,
}): string => joinClassNames(
  'btn',
  outline ? 'btn-outline' : null,
  size? `btn-${size}` : null,
  type ? `btn-${type}` : null,
  className,
);

const renderContents = ({
  children,
  icon,
  label,
}: {
  children?: React.ReactNode,
  icon?: IconDefinition,
  label?: string,
}): React.ReactNode => {
  if (children) { return children; }

  if (label) {
    if (!icon) { return label; }

    return (
      <>
        <Icon className="pr-2" icon={icon} />

        { label }
      </>
    )
  }

  return null;
};

const LinkButton = ({
  children,
  className,
  label,
  icon,
  outline,
  size,
  type,
  url,
}: LinkButtonProps): JSX.Element => {
  const joinedClassName = generateClassName({
    className,
    outline,
    size,
    type,
  });

  return (
    <Link className={joinedClassName} to={url}>
      { renderContents({ children, icon, label }) }
    </Link>
  );
};

const PlainButton = ({
  children,
  className,
  disabled = false,
  htmlType = 'button',
  label,
  icon,
  onClick,
  outline,
  size,
  type,
}: PlainButtonProps): JSX.Element => {
  const joinedClassName = generateClassName({
    className,
    outline,
    size,
    type,
  });

  return (
    <button
      className={joinedClassName}
      disabled={disabled}
      onClick={onClick}
      type={htmlType}
    >
      { renderContents({ children, icon, label }) }
    </button>
  );
};

export const Button = (props: ButtonProps): JSX.Element => {
  const { disabled } = props;

  if (('url' in props) && !disabled) { return (<LinkButton {...props} />); }

  return (<PlainButton {...props} />);
};
