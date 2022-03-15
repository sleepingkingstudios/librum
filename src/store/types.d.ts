type Literal = string | number | true | false | null;

type DataItem = Literal | DataItem[] | { [name: string]: DataItem };

export type ApiData = { [name: string]: DataItem };

export type ApiError = { type: string, message: string, data: ApiData };

export type ApiFailure<Data extends ApiData = ApiData> = { ok: false, error: ApiError, data?: Data };

export type ApiSuccess<Data extends ApiData = ApiData> = { ok: true, data: Data };

export type ApiResponse<Data extends ApiData = ApiData> = ApiFailure<Data> | ApiSuccess<Data>;
