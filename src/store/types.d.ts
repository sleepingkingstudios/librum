import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

type Literal = string | number | true | false | null;

type DataItem = Literal | DataItem[] | Record<string, DataItem>;

export type ApiData = Record<string, DataItem>;

export type ApiError = { type: string, message: string, data: ApiData };

export type ApiParam = Literal | ApiData;

export type ApiFailure<Data extends ApiData = ApiData> =
  { ok: false, error: ApiError, data?: Data };

export type ApiSuccess<Data extends ApiData = ApiData> =
  { ok: true, data: Data };

export type ApiResponse<Data extends ApiData = ApiData> =
  ApiFailure<Data> | ApiSuccess<Data>;

export type FetchFailure =
  { error: FetchBaseQueryError | SerializedError };

export type FetchSuccess<Data extends ApiData = ApiData> =
  { data: ApiSuccess<Data> };

export type FetchResponse<Data extends ApiData = ApiData> =
  FetchFailure | FetchSuccess<Data>;

export type Action<Payload extends ApiData = ApiData> =
  { payload: Payload, type: string };

export type ActionCreator<
  Param = unknown,
  Payload extends ApiData = ApiData
> = (param: Param) => Action<Payload>;
