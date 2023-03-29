import type {
  FormError,
  FormStatus,
} from './types';

export const getServerErrors = ({
  name,
  status,
}: {
  name: string,
  status: FormStatus,
}): string[] => {
  if (!status) { return []; }

  if (status.ok) { return []; }

  if (!('errors' in status)) { return []; }

  const { errors } = status;
  const fieldErrors = (errors[name] || []) as FormError[];
  const messages = fieldErrors.map(error => error.message);

  return messages;
};
