export type Literal = string | number | true | false | null;

export type DataItem = Literal | DataItem[] | Record<string, DataItem>;

export type DataObject = Record<string, DataItem>;

export type SnakeToCamelCaseString<S extends string> =
  S extends `${infer T}_${infer U}` ?
  `${T}${Capitalize<SnakeToCamelCase<U>>}` :
  S;

export type SnakeToCamelCaseObject<T> =
  T extends object ?
  {
    [K in keyof T as SnakeToCamelCaseString<K & string>]: SnakeToCamelCaseObject<T[K]>
  } :
  T;
