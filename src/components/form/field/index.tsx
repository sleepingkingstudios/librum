import * as React from 'react';
import {
  capitalize,
  last,
  map,
} from 'lodash';
import { Field } from 'formik';

import { joinClassNames } from '@utils/react-utils';
import { FormInput } from '../input';

interface IFormFieldProps {
  className?: string;
  cols?: (2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12);
  id?: string;
  label?: string | false;
  name: string;
  type?: string;
}

interface IFormLabelProps {
  id: string;
  label: string | false;
}

const columnSpanClassName = ({ cols }: { cols: number }): string | null => {
  if (cols === null) { return null; }

  return `col-span-${cols}`;
};

const convertNameToId = (name: string): string => (
  name.replace(/\]/g, '').split('[').join('_')
);

const convertNameToLabel = (name: string): string => {
  const segment: string = last(name.split(/\[/));
  const trimmed: string = segment.replace(/\]/, '');

  return map(trimmed.split('_'), capitalize).join(' ');
};

const inputType = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type,
}: { type: string }): React.ElementType => FormInput;

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
  const InputComponent: React.ElementType = inputType({ type });

  return (
    <div className={joinedClassName}>
      { renderLabel({ id: configuredId, label: configuredLabel }) }

      <Field
        id={configuredId}
        name={name}
        component={InputComponent}
        type={type}
      />
    </div>
  );
};
