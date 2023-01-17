import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ButtonShims,
} from './shims';

import type { ColorTypes } from '../types';

type ButtonContents = {
  children: React.ReactNode,
} | {
  icon?: IconDefinition,
  label: string,
};

type ButtonProps = {
  className?: string,
  children?: React.ReactNode,
  disabled?: boolean,
  icon?: IconDefinition,
  label?: string,
  outline?: boolean,
  size?: ButtonSize,
  type?: ColorTypes,
} & ButtonContents;

type ButtonSize = ("sm" | "md" | "lg");

type ButtonType = ("button" | "reset" | "submit");

export type LinkButton = {
  url: string,
} & ButtonProps;

export type PlainButton = {
  htmlType?: ButtonType,
  onClick?: () => void,
} & ButtonProps;

export type Button = LinkButton | PlainButton;
