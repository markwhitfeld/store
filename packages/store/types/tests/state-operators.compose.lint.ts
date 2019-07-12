/* tslint:disable:max-line-length */

/// <reference types="@types/jest" />
import { compose, removeItem, insertItem, iif } from '../../operators/src';

describe('[TEST]: the compose State Operator', () => {
  it('should return the correct null or undefined type', () => {
    compose(() => null); // $ExpectType (existing: null) => null
    compose(() => null, () => null); // $ExpectType (existing: null) => null
    compose(() => undefined); // $ExpectType (existing: undefined) => undefined
    compose(() => undefined, () => undefined); // $ExpectType (existing: undefined) => undefined
    compose(() => null, () => undefined); // $ExpectType (existing: null | undefined) => null | undefined
  });

  it('should return the correct number type', () => {
    compose(() => 10); // $ExpectType (existing: number) => number
    compose((x) => 10); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose((x: number) => 10); // $ExpectType (existing: number) => number
    compose<number>((x) => 10); // $ExpectType (existing: number) => number
    compose(() => 10, () => 20); // $ExpectType (existing: number) => number
    compose(() => 10, (x) => 20); // $ExpectType (existing: number) => number
    compose((x) => 10, () => 20); // $ExpectType (existing: number) => number
    compose((x) => 10, (x) => 20); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose<number>((x) => 10, (x) => 20); // $ExpectType (existing: number) => number
    compose(() => 10, (x) => x * 2); // $ExpectType (existing: number) => number
    compose((x) => 10, (x: number) => x * 2);  // $ExpectType (existing: number) => number
    compose<number>((x) => 10, (x) => x * 2); // $ExpectType (existing: number) => number
    compose(() => 10, () => null); // $ExpectType (existing: number | null) => number | null
    compose(() => 10, () => undefined); // $ExpectType (existing: number | undefined) => number | undefined
    compose<number | null>((x) => 10, (x) => null); // $ExpectType (existing: number | null) => number | null
    compose<number | undefined>((x) => 10, (x) => undefined); // $ExpectType (existing: number | undefined) => number | undefined
    compose<number | string>((x) => 10, (x) => 'abc'); // $ExpectType (existing: string | number) => string | number
    compose<number | boolean>((x) => 10, (x) => true); // $ExpectType (existing: number | boolean) => number | boolean
    compose<number | boolean>((x) => 10, (x) => false); // $ExpectType (existing: number | boolean) => number | boolean
    compose<number | number[]>((x) => 10, (x) => [123]); // $ExpectType (existing: number | number[]) => number | number[]
    compose<number | { val: number }>((x) => 10, (x) => ({ val: 123 })); // $ExpectType (existing: number | Readonly<{ val: number; }>) => number | Readonly<{ val: number; }>
  });

  it('should return the correct string type', () => {
    compose(() => 'abc'); // $ExpectType (existing: string) => string
    compose((x) => 'abc'); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose((x: string) => 'abc'); // $ExpectType (existing: string) => string
    compose<string>((x) => 'abc'); // $ExpectType (existing: string) => string
    compose(() => 'abc', () => 'bcd'); // $ExpectType (existing: string) => string
    compose(() => 'abc', (x) => 'bcd'); // $ExpectType (existing: string) => string
    compose((x) => 'abc', () => 'bcd'); // $ExpectType (existing: string) => string
    compose((x) => 'abc', (x) => 'bcd'); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose<string>((x) => 'abc', (x) => 'bcd'); // $ExpectType (existing: string) => string
    compose(() => 'abc', (x) => x + 'e'); // $ExpectType (existing: string) => string
    compose((x) => 'abc', (x: string) => x + 'e');  // $ExpectType (existing: string) => string
    compose<string>((x) => 'abc', (x) => x + 'e'); // $ExpectType (existing: string) => string
    compose(() => 'abc', () => null); // $ExpectType (existing: string | null) => string | null
    compose(() => 'abc', () => undefined); // $ExpectType (existing: string | undefined) => string | undefined
    compose<string | null>((x) => 'abc', (x) => null); // $ExpectType (existing: string | null) => string | null
    compose<string | undefined>((x) => 'abc', (x) => undefined); // $ExpectType (existing: string | undefined) => string | undefined
    compose<string | number>((x) => 'abc', (x) => 123); // $ExpectType (existing: string | number) => string | number
    compose<string | boolean>((x) => 'abc', (x) => true); // $ExpectType (existing: string | boolean) => string | boolean
    compose<string | boolean>((x) => 'abc', (x) => false); // $ExpectType (existing: string | boolean) => string | boolean
    compose<string | string[]>((x) => 'abc', (x) => ['abc']); // $ExpectType (existing: string | string[]) => string | string[]
    compose<string | { val: string }>((x) => 'abc', (x) => ({ val: 'abc' })); // $ExpectType (existing: string | Readonly<{ val: string; }>) => string | Readonly<{ val: string; }>
  });

  it('should return the correct implied boolean type', () => {
    compose(() => true); // $ExpectType (existing: boolean) => boolean
    compose((x) => true); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose((x: boolean) => true); // $ExpectType (existing: boolean) => boolean
    compose<boolean>((x) => true); // $ExpectType (existing: boolean) => boolean
    compose(() => true, () => false); // $ExpectType (existing: boolean) => boolean
    compose(() => true, (x) => false); // $ExpectType (existing: boolean) => boolean
    compose((x) => true, () => false); // $ExpectType (existing: boolean) => boolean
    compose((x) => true, (x) => false); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose<boolean>((x) => true, (x) => false); // $ExpectType (existing: boolean) => boolean
    compose(() => true, (x) => !x); // $ExpectType (existing: boolean) => boolean
    compose((x) => true, (x: boolean) => !x);  // $ExpectType (existing: boolean) => boolean
    compose<boolean>((x) => true, (x) => !x); // $ExpectType (existing: boolean) => boolean
    compose(() => true, () => null); // $ExpectType (existing: boolean | null) => boolean | null
    compose(() => true, () => undefined); // $ExpectType (existing: boolean | undefined) => boolean | undefined
    compose<boolean | null>((x) => true, (x) => null); // $ExpectType (existing: boolean | null) => boolean | null
    compose<boolean | undefined>((x) => true, (x) => undefined); // $ExpectType (existing: boolean | undefined) => boolean | undefined
    compose<boolean | string>((x) => true, (x) => 'abc'); // $ExpectType (existing: string | boolean) => string | boolean
    compose<boolean | number>((x) => true, (x) => 123); // $ExpectType (existing: number | boolean) => number | boolean
    compose<boolean | boolean[]>((x) => true, (x) => [true]); // $ExpectType (existing: boolean | boolean[]) => boolean | boolean[]
    compose<boolean | { val: boolean }>((x) => true, (x) => ({ val: true })); // $ExpectType (existing: boolean | Readonly<{ val: boolean; }>) => boolean | Readonly<{ val: boolean; }>
  });

  it('should return the correct array type', () => {
    compose(() => [10]); // $ExpectType (existing: number[]) => number[]
    compose((x) => [10]); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose((x: number[]) => [10]); // $ExpectType (existing: number[]) => number[]
    compose<number[]>((x) => [10]); // $ExpectType (existing: number[]) => number[]
    compose(() => [10], () => [20]); // $ExpectType (existing: number[]) => number[]
    compose(() => [10], (x) => [20]); // $ExpectType (existing: number[]) => number[]
    compose((x) => [10], () => [20]); // $ExpectType (existing: number[]) => number[]
    compose((x) => [10], (x) => [20]); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose<number[]>((x) => [10], (x) => [20]); // $ExpectType (existing: number[]) => number[]
    compose(() => [10], (x) => [...x, 2]); // $ExpectType (existing: number[]) => number[]
    compose((x) => [10], (x: number[]) => [...x, 2]);  // $ExpectType (existing: number[]) => number[]
    compose<number[]>((x) => [10], (x) => [...x, 2]); // $ExpectType (existing: number[]) => number[]
    compose(() => [10], () => null); // $ExpectType (existing: number[] | null) => number[] | null
    compose(() => [10], () => undefined); // $ExpectType (existing: number[] | undefined) => number[] | undefined
    compose<number[] | null>((x) => [10], (x) => null); // $ExpectType (existing: number[] | null) => number[] | null
    compose<number[] | undefined>((x) => [10], (x) => undefined); // $ExpectType (existing: number[] | undefined) => number[] | undefined
    compose<number[] | number>((x) => [10], (x) => 123); // $ExpectType (existing: number | number[]) => number | number[]
    compose<number[] | string>((x) => [10], (x) => 'abc'); // $ExpectType (existing: string | number[]) => string | number[]
    compose<number[] | boolean>((x) => [10], (x) => true); // $ExpectType (existing: boolean | number[]) => boolean | number[]
    compose<number[] | boolean>((x) => [10], (x) => false); // $ExpectType(existing: boolean | number[]) => boolean | number[]
    compose<number[] | number[][]>((x) => [10], (x) => [123]); // $ExpectType (existing: number[] | number[][]) => number[] | number[][]
    compose<number[] | { val: number[] }>((x) => [10], (x) => ({ val: [123] })); // $ExpectType (existing: number[] | Readonly<{ val: number[]; }>) => number[] | Readonly<{ val: number[]; }>

    compose<number[]>(removeItem(0), removeItem(0), insertItem(10))([1, 2, 3, 4]); // $ExpectType number[]

    iif<number[]>(
      numbers => numbers!.length === 5,
      compose(removeItem(0), removeItem(0), insertItem(10)))([1, 2, 3, 4]);  // $ExpectError
  });

  it('should return the correct object type', () => {
    compose(() => ({ val: 10 })); // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose((x) => ({ val: 10 })); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose((x: { val: number; }) => ({ val: 10 })); // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose<{ val: number; }>((x) => ({ val: 10 })); // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose(() => ({ val: 10 }), () => ({ val: 20 })); // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose(() => ({ val: 10 }), (x) => ({ val: 20 })); // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose((x) => ({ val: 10 }), () => ({ val: 20 })); // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose((x) => ({ val: 10 }), (x) => ({ val: 20 })); // $ExpectType (existing: Readonly<{}>) => Readonly<{}>
    compose<{ val: number; }>((x) => ({ val: 10 }), (x) => ({ val: 20 })); // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose(() => ({ val: 10 }), (x) => ({ val: x.val * 2 })); // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose((x) => ({ val: 10 }), (x: { val: number; }) => ({ val: x.val * 2 }));  // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose<{ val: number; }>((x) => ({ val: 10 }), (x) => ({ val: x.val * 2 })); // $ExpectType (existing: Readonly<{ val: number; }>) => Readonly<{ val: number; }>
    compose(() => ({ val: 10 }), () => null); // $ExpectType (existing: Readonly<{ val: number; }> | null) => Readonly<{ val: number; }> | null
    compose(() => ({ val: 10 }), () => undefined); // $ExpectType (existing: Readonly<{ val: number; }> | undefined) => Readonly<{ val: number; }> | undefined
    compose<{ val: number; } | null>((x) => ({ val: 10 }), (x) => null); // $ExpectType (existing: Readonly<{ val: number; }> | null) => Readonly<{ val: number; }> | null
    compose<{ val: number; } | undefined>((x) => ({ val: 10 }), (x) => undefined); // $ExpectType (existing: Readonly<{ val: number; }> | undefined) => Readonly<{ val: number; }> | undefined
    compose<{ val: number; } | number>((x) => ({ val: 10 }), (x) => 123); // $ExpectType (existing: number | Readonly<{ val: number; }>) => number | Readonly<{ val: number; }>
    compose<{ val: number; } | string>((x) => ({ val: 10 }), (x) => 'abc'); // $ExpectType (existing: string | Readonly<{ val: number; }>) => string | Readonly<{ val: number; }>
    compose<{ val: number; } | boolean>((x) => ({ val: 10 }), (x) => true); // $ExpectType (existing: boolean | Readonly<{ val: number; }>) => boolean | Readonly<{ val: number; }>
    compose<{ val: number; } | boolean>((x) => ({ val: 10 }), (x) => false); // $ExpectType (existing: boolean | Readonly<{ val: number; }>) => boolean | Readonly<{ val: number; }>
    compose<{ val: number; } | Array<{ val: number; }>>((x) => ({ val: 10 }), (x) => [{ val: 123 }]); // $ExpectType (existing: { val: number; }[] | Readonly<{ val: number; }>) => { val: number; }[] | Readonly<{ val: number; }>
    compose<{ val: number; } | { val: { val: number; } }>((x) => ({ val: 10 }), (x) => ({ val: 123 })); // $ExpectType (existing: Readonly<{ val: number; }> | Readonly<{ val: { val: number; }; }>) => Readonly<{ val: number; }> | Readonly<{ val: { val: number; }; }>
  });
});
