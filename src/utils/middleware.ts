import type { FetchPromise } from '@api';
import type { Annotated } from './annotations';

export type NextFunction<Param = unknown, Result = FetchPromise> = (
  param: Param,
) => Result;

export type Middleware<Param = unknown, Result = FetchPromise> = (
  nextFn: NextFunction<Param, Result>,
  param: Param,
) => Result;

export type MiddlewareBuilder<
  Param = unknown,
  Result = FetchPromise,
> = (
  (options: Record<string, unknown>) => Middleware<Param, Result>
) & Annotated;

export const applyMiddleware = <Param = unknown, Result = unknown>(
  initialFn: NextFunction<Param, Result>,
  middleware?: Middleware<Param, Result>[] | Middleware<Param, Result>
): NextFunction<Param, Result> => {
  if (!middleware) { return initialFn; }

  const configured: Middleware<Param, Result>[] =
    Array.isArray(middleware) ? [...middleware].reverse() : [middleware];

  return configured.reduce(
    (applied, middlewareFn) => (
      (param: Param) => middlewareFn(applied, param)
    ),
    initialFn,
  )
};
