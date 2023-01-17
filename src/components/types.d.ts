import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AlignmentShims,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AnimationShims,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ColumnSpanShims,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GridColumnsShims,
} from './shims';

export type Alignments = ("left" | "center" | "right");

export type Animations = ("bounce" | "none" | "ping" | "pulse" | "spin");

export type ColorTypes =
  ("primary" | "info" | "success" | "warning" | "danger" | "muted");

export type UpToSixColumns = (2 | 3 | 4 | 5 | 6);

export type UpToTwelveColumns = (2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12);
