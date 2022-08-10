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
  horizontal?: boolean;
  id?: string;
  label?: string | false;
  name: string;
  type?: string;
}

interface IFormLabelProps {
  id: string;
  label: string | false;
}

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
