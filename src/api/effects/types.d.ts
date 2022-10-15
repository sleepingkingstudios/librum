import type { AlertsContext } from '@alerts/types';
import type { Dispatch } from '@store';
import type { Annotated } from '@utils/annotations';
import type { Response } from '../hooks/types';

export type { Response } from '../hooks/types';

export type Effect<Options extends EffectOptions = EffectOptions> = (
  (response: Response, options?: Options) => void
) & Annotated;

export type EffectOptions<
  Options extends Record<string, unknown> = Record<string, unknown>,
> = Options & {
  alerts: AlertsContext,
  dispatch: Dispatch,
};
