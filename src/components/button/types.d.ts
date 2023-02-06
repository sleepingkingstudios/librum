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

type ButtonOptions = {
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

export type LinkButtonProps = {
  url: string,
} & ButtonOptions;

export type PlainButtonProps = {
  htmlType?: ButtonType,
  onClick?: () => void,
} & ButtonOptions;

export type ButtonProps = LinkButtonProps | PlainButtonProps;
