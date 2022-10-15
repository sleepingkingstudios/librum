import type {
  DataObject,
  Literal,
} from '@utils/types';

export type {
  Effect,
  EffectOptions,
} from './effects/types';

export type ApiError = { type: string, message: string, data: DataObject };

export type ApiParam = Literal | DataObject;

export type ApiFailure<Data extends DataObject = DataObject> =
  { ok: false, error?: ApiError, data?: Data };

export type ApiSuccess<Data extends DataObject = DataObject> =
  { ok: true, data?: Data };

export type ApiResponse<Data extends DataObject = DataObject> =
  ApiFailure<Data> | ApiSuccess<Data>;
