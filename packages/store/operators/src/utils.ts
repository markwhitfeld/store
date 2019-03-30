import { StateOperator } from '@ngxs/store';

import { Predicate } from './internals';

export type StateOperatorUnion<T> =
  | StateOperatorNonNullable<T>
  | (T extends undefined ? StateOperator<T> : never)
  | (T extends null ? StateOperator<T> : never);

export type StateOperatorNonNullable<T> =
  | (T extends boolean ? (StateOperator<true> | StateOperator<false>) : never)
  | (T extends true ? (StateOperator<true> | StateOperator<boolean>) : never)
  | (T extends false ? (StateOperator<false> | StateOperator<boolean>) : never)
  | StateOperator<NonNullable<T>>;
/*export type StateOperatorNonNullable<T> = StateOperator<NonNullable<T>>;*/
/*
export type StateOperatorUnion<T> =
  | StateOperator<NonNullable<T>>
  | (T extends undefined ? StateOperator<undefined> : never)
  | (T extends null ? StateOperator<null> : never);
  */

export function isStateOperator<T>(value: T | StateOperator<T>): value is StateOperator<T> {
  return typeof value === 'function';
}

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

export function isPredicate<T>(value: Predicate<T> | boolean | number): value is Predicate<T> {
  return typeof value === 'function';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function invalidIndex(index: number): boolean {
  return Number.isNaN(index) || index === -1;
}

export function isNil<T>(value: T | null | undefined): value is null | undefined {
  return value === null || isUndefined(value);
}
