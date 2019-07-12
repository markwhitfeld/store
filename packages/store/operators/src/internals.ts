export type Predicate<T = any> = (value?: RepairType<T>) => boolean;

// BUG(TS 3.4): TypeScript strangely expanding in type alias
// https://github.com/Microsoft/TypeScript/issues/30029
type Primitive = Function | string | number | boolean | undefined | null;
type IncludeType<T> = T;

// Examples:
// RepairType<true> -> boolean
// RepairType<false> -> boolean
// RepairType<'abc'> -> string
// RepairType<{}> -> {}
export type RepairType<T> = T extends boolean
  ? IncludeType<boolean>
  : T extends Primitive
  ? IncludeType<T>
  : T extends object
  ? IncludeType<T>
  : never;

export type RepairTypeList<T> = Array<RepairType<T>>;
