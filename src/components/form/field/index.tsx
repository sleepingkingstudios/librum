import * as React from 'react';
import {
  capitalize,
  last,
  map,
  snakeCase,
} from 'lodash';
import { useField } from 'formik';
import type {
  FieldHookConfig,
  FieldInputProps,
} from 'formik';

import { joinClassNames } from '@utils/react-utils';
import { FormInput } from '../input';
import type { UpToTwelveColumns } from '@components/types';

interface IFormFieldProps {
  className?: string;
  cols?: UpToTwelveColumns;
  id?: string;
  label?: string | false;
  name: string;
  type?: string;
}

interface IFormLabelProps {
  id: string;
  label: string | false;
}

interface IRenderComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldInputProps<any>;
  id?: string;
  type: string;
}

const columnSpanClassName = ({ cols }: { cols: number }): string | null => {
  if (cols === null) { return null; }

  return `col-span-${cols}`;
};

const convertNameToId = (name: string): string => (
  name.replace(/\]/g, '').split('[').map(snakeCase).join('_')
);

const convertNameToLabel = (name: string): string => {
  const segment: string = last(name.split(/\[/));
  const trimmed: string = snakeCase(segment.replace(/\]/, ''));

  return map(trimmed.split('_'), capitalize).join(' ');
};

const renderComponent = ({
  field,
  id = null,
  type,
}: IRenderComponentProps): JSX.Element => (
  <FormInput field={field} id={id} type={type} />
);

const renderLabel = ({ id, label }: IFormLabelProps): JSX.Element => {
  if (label === false) {
    return null;
  }

  return (
    <label className="form-label" htmlFor={id}>{ label }</label>
  );
}

export const FormField = ({
  className = null,
  cols = null,
  id = null,
  label = null,
  name,
  type = 'text',
}: IFormFieldProps): JSX.Element => {
  const configuredId = id || convertNameToId(name);
  const configuredLabel =
    label === false ? label : (label || convertNameToLabel(name));
  const joinedClassName = joinClassNames(
    'form-field',
    columnSpanClassName({ cols }),
    className,
  );
  const fieldConfig: FieldHookConfig<string> = {
    name,
  };
  const [field] = useField(fieldConfig);

  return (
    <div className={joinedClassName}>
      { renderLabel({ id: configuredId, label: configuredLabel }) }

      { renderComponent({ id: configuredId, field, type }) }
    </div>
  );
};
