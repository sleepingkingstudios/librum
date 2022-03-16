type Literal = string | number | true | false | null;

type DataItem = Literal | DataItem[] | Record<string, DataItem>;

export type ApiData = Record<string, DataItem>;

export type ApiError = { type: string, message: string, data: ApiData };

export type ApiParam = Literal | ApiData;

export type ApiFailure<Data extends ApiData = ApiData> = { ok: false, error: ApiError, data?: Data };

export type ApiSuccess<Data extends ApiData = ApiData> = { ok: true, data: Data };

export type ApiResponse<Data extends ApiData = ApiData> = ApiFailure<Data> | ApiSuccess<Data>;
