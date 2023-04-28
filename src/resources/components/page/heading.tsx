import * as React from 'react';
import { isPlainObject } from 'lodash';

import type { ButtonProps as Button } from '@components/button';
import { Heading } from '@components/heading';
import { singularize } from '@utils/inflector';
import { titleCase } from '@utils/text';

type ResourcePageLabelProps = {
  action: string,
  data: Record<string, unknown>,
  label?: string,
  member: boolean,
  resourceName: string,
  singularName?: string,
  status: string,
};

type ResourcePageHeadingProps = {
  buttons?: Button[],
} & ResourcePageLabelProps;

const labelFor = ({
  action,
  data,
  label,
  member,
  resourceName,
  singularName,
  status,
}: ResourcePageLabelProps): string => {
  if (typeof label === 'string' && label.length > 0) { return label; }

  if (!member) {
    return `${titleCase(action)} ${titleCase(resourceName)}`.trim();
  }

  const actionName = status === 'success' ? titleCase(action) : 'Loading';
  const memberName = memberNameFor({ data, resourceName, singularName })

  return `${actionName} ${memberName}`.trim();
};

const memberNameFor = ({
  data,
  resourceName,
  singularName,
}: {
  data: Record<string, unknown>,
  resourceName: string,
  singularName?: string,
}): string => {
  const resourceKey = singularName || singularize(resourceName);

  if (resourceKey in data && isPlainObject(data[resourceKey])) {
    const resource = data[resourceKey] as Record<string, unknown>;

    if ('name' in resource) { return resource.name.toString(); }
  }

  return titleCase(resourceKey);
};

export const ResourcePageHeading = ({
  buttons,
  ...labelOptions
}: ResourcePageHeadingProps): JSX.Element => {
  const label: string = labelFor(labelOptions);

  return (
    <Heading buttons={buttons} size={1}>
      { label }
    </Heading>
  );
};
