import * as React from 'react';
import { Link } from 'react-router-dom';

type ExternalLinkProps = {
  className?: string,
  children?: JSX.Element,
  label?: string,
  to: string,
}

const addProtocol = (to: string): string => {
  const firstSegment = to.split('/')[0];

  if (firstSegment.match(/\./)) { return `https://${to}`; }

  return to;
};

const renderContents = ({
  children,
  className,
  label,
  to,
}: ExternalLinkProps): JSX.Element => {
  if (children) {
    return (<span className={className}>{ children }</span>);
  }

  if (label) {
    return (<span className={className}>{ label }</span>);
  }

  if (to && to.length > 0) {
    return (<span className={className}>{ to }</span>);
  }

  return null;
};

export const ExternalLink = ({
  className,
  children,
  label,
  to,
}: ExternalLinkProps): JSX.Element => {
  if (to === undefined || to === null || to === '') {
    return renderContents({ children, className, label, to });
  }

  const url = addProtocol(to);

  return (
    <Link to={url}>
      { renderContents({ children, className, label, to }) }
    </Link>
  );
};
