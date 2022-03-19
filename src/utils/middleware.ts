export type NextFunction<Param = unknown, Result = unknown> =
  (param: Param) => Result;

export type Middleware<Param = unknown, Result = unknown> =
  (nextFn: NextFunction<Param, Result>, param: Param) => Result;

export const applyMiddleware = <Param = unknown, Result = unknown> (
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
