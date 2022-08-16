import {
  isArray,
  isFunction,
  isObject,
  isPlainObject,
} from 'lodash';

export type Annotations = {
  [key: string]: unknown;
  name: string;
  options?: Record<string, unknown>;
  type?: string;
}

export type Annotated = {
  annotations?: Annotations;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const formatFunction = (value: Function): unknown => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const maybeAnnotated: (Function & Annotated) = value;

  console.log('formatFunction()', value);

  if ('annotations' in maybeAnnotated) {
    return formatObject(maybeAnnotated.annotations);
  }

  if (value.name) { return `function ${value.name}`; }

  return '(anonymous function)';
};

const formatObject = (value: unknown): unknown => {
  const maybeAnnotated: Annotated = value;

  if ('annotations' in maybeAnnotated) {
    return formatObject(maybeAnnotated.annotations);
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(mapEntry));
  }

  return value;
};

const mapEntry = (entry: [string, unknown]): [string, unknown] => {
  const [key, value] = entry;

  return [key, formatValue(value)];
};

// eslint-disable-next-line prefer-const
export const formatValue = (value: unknown): unknown => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  if (isFunction(value)) { return formatFunction(value as Function); }

  if (isArray(value)) { return value.map(formatValue); }

  if (isObject(value)) { return formatObject(value); }

  return value;
};
