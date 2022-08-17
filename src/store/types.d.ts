export type Action<Payload extends DataObject = DataObject> =
  { payload: Payload, type: string };

export type ActionCreator<
  Param = unknown,
  Payload extends DataObject = DataObject
> = (param: Param) => Action<Payload>;
