import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import type { Annotated } from '@utils/annotations';
import type {
  DataObject,
  Literal,
} from '@utils/types';

export type ApiError = { type: string, message: string, data: DataObject };

export type ApiParam = Literal | DataObject;

export type ApiFailure<Data extends DataObject = DataObject> =
  { ok: false, error?: ApiError, data?: Data };

export type ApiSuccess<Data extends DataObject = DataObject> =
  { ok: true, data?: Data };

export type ApiResponse<Data extends DataObject = DataObject> =
  ApiFailure<Data> | ApiSuccess<Data>;

// See https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
export type FetchFailure =
  { error: FetchBaseQueryError | SerializedError };

export type FetchSuccess<Data extends DataObject = DataObject> =
  { data: ApiSuccess<Data> };

export type FetchResponse<Data extends DataObject = DataObject> =
  FetchFailure | FetchSuccess<Data>;

export type FetchPromise<Data extends DataObject = DataObject> =
  Promise<FetchResponse<Data>>;

export type Matcher<MatchOptions> = (
  (
    response: FetchResponse,
    options: MatchOptions,
  ) => void
) & Annotated;

export type MatchResponseProps<MatchOptions> = {
  errorType?: string,
  fn: Matcher<MatchOptions>,
  matcher?: Matcher<MatchOptions>,
  status: 'success' | 'failure',
}

export type MatchResponse<MatchOptions> = ({
  errorType,
  matcher,
  status,
}: MatchResponseProps) => Matcher<MatchOptions>;

export type Mutation = (param?: unknown) => unknown;

export type MutationStatus = {
  isLoading: boolean;
};

export type UseMutationResponse = readonly [
  Mutation,
  MutationStatus,
];

export type UseMutation = () => UseMutationResponse;
