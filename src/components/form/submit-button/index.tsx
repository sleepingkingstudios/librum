import * as React from 'react';
import { useFormikContext } from 'formik';

import { FormButton } from '../button';

interface IFormSubmitButtonProps {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  cols?: (2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12);
}

export const FormSubmitButton = ({
  className,
  children,
  disabled = false,
  cols = null,
}: IFormSubmitButtonProps): JSX.Element => {
  const { isSubmitting } = useFormikContext();

  return (
    <FormButton
      disabled={disabled || isSubmitting}
      className={className}
      cols={cols}
      type="submit"
    >
      { children }
    </FormButton>
  );
};
