import * as React from 'react';

import { Button } from '@components/button';
import type { ButtonProps } from '@components/button';

type HeadingProps = {
  buttons?: ButtonProps[],
  children: React.ReactNode,
  className?: string,
  size: HeadingSize,
}

type HeadingSize = (1 | 2 | 3 | 4 | 5 | 6);

const renderButtons = ({
  buttons,
}: {
  buttons: ButtonProps[],
}): JSX.Element => {
  return (
    <ul className="justify-end flex flex-col grow sm:flex-row btn-list">
      {
        buttons.map((button: ButtonProps, index: number): JSX.Element => {
          const key = 'label' in button ? `button-${index}-${button.label}` : `button-${index}`;

          return <Button key={key} {...button} />;
        })
      }
    </ul>
  );
};

const renderHeading = ({
  children,
  className,
  size,
}: {
  children: React.ReactNode,
  className?: string,
  size: HeadingSize,
}): JSX.Element => {
  if (size === 1) { return (<h1 className={className}>{ children }</h1>); }

  if (size === 2) { return (<h2 className={className}>{ children }</h2>); }

  if (size === 3) { return (<h3 className={className}>{ children }</h3>); }

  if (size === 4) { return (<h4 className={className}>{ children }</h4>); }

  if (size === 5) { return (<h5 className={className}>{ children }</h5>); }

  if (size === 6) { return (<h6 className={className}>{ children }</h6>); }
}

export const Heading = ({
  buttons,
  children,
  className,
  size,
}: HeadingProps): JSX.Element => {
  if (!buttons || buttons.length === 0) {
    return renderHeading({ children, className, size });
  }

  return (
    <div className="flex flex-col sm:flex-row">
      { renderHeading({ children, className, size }) }

      { renderButtons({ buttons }) }
    </div>
  );
};
