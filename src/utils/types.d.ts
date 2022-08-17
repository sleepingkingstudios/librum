export type Literal = string | number | true | false | null;

export type DataItem = Literal | DataItem[] | Record<string, DataItem>;

export type DataObject = Record<string, DataItem>;
