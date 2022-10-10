import type {
  Effect,
  EffectOptions,
  Response,
} from './types';

type LogFunction = (...args: unknown[]) => void;

export const logResponse = (label: string) => {
  const effect: Effect = (
    response: Response,
    options: EffectOptions,
  ): void => {
    let log: LogFunction;

    if ('log' in options) {
      log = options.log as LogFunction;
    } else {
      log = console.log;
    }

    log(`${label}, response:`, response);
  };

  effect.annotations = {
    name: 'api:effects:logResponse',
    type: 'api:effects:logResponse'
  };

  return effect;
};
