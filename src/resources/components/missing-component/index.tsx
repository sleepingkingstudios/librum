import * as React from 'react';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';

export const ResourceMissingComponent = ({
  name,
}: {
  name: string,
}): JSX.Element => (
  <div className="min-h-[10rem] relative resources-table">
    <h3 className="my-5 text-danger">
      <Icon icon={faSkullCrossbones} />

      <span className="px-2">
        { `Missing <${name} /> Component` }
      </span>

      <Icon icon={faSkullCrossbones} />
    </h3>
  </div>
);
