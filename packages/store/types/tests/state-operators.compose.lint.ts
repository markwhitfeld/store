/* tslint:disable:max-line-length */

/// <reference types="@types/jest" />
import { compose, patch, iif } from '../../operators/src';

describe('[TEST]: the compose State Operator', () => {
  it('should return the correct implied null or undefined type', () => {
    compose((obj: null) => null); // $ExpectType (existing: null) => null
    compose(
      (obj: null) => null,
      (obj: null) => null
    ); // $ExpectType (existing: null) => null
    compose((obj: undefined) => undefined); // $ExpectType (existing: undefined) => undefined
    compose(
      (obj: undefined) => undefined,
      (obj: undefined) => undefined
    ); // $ExpectType (existing: undefined) => undefined
  });

  it('should return the correct implied number type', () => {
    compose(num => 10); // $ExpectType (existing: number) => number
    compose(
      num => 10,
      num => 20
    ); // $ExpectType (existing: number) => number
    /* Union type cannot be implied at the moment TODO
    compose((num) => 10, (num) => null); // $/ExpectType (existing: string | null) => string | null
    compose((num) => 10, (num) => undefined); // $/ExpectType (existing: string | undefined) => string | undefined
    */

    compose(
      num => 10,
      (num: number) => num * 2
    ); // $ExpectType (existing: number) => number
    compose(
      num => 10,
      iif(true, (num: number) => num * 2)
    ); // $ExpectType (existing: number) => number
    compose(
      (num: number) => 10,
      iif(true, num => num * 2)
    ); // $ExpectType (existing: number) => number
    compose(
      iif(true, (num: number) => num * 2),
      num => num * 2
    ); // $ExpectType (existing: number) => number

    compose<number | null>(num => 10); // $ExpectType (existing: number | null) => number | null
    compose<number | null>(num => null); // $ExpectType (existing: number | null) => number | null
    compose<number | null>(
      num => 10,
      num => null
    ); // $ExpectType (existing: number | null) => number | null
    compose<number | undefined>(num => 10); // $ExpectType (existing: number | undefined) => number | undefined
    compose<number | undefined>(num => undefined); // $ExpectType (existing: number | undefined) => number | undefined
    compose<number | undefined>(
      num => 10,
      num => undefined
    ); // $ExpectType (existing: number | undefined) => number | undefined
  });

  it('should return the correct implied string type', () => {
    compose(str => 'abc'); // $ExpectType (existing: string) => string
    compose(
      str => 'abc',
      str => 'cde'
    ); // $ExpectType (existing: string) => string
    /* Union type cannot be implied at the moment TODO
    compose((str) => 'abc', (str) => null); // $/ExpectType (existing: string | null) => string | null
    compose((str) => 'abc', (str) => undefined); // $/ExpectType (existing: string | undefined) => string | undefined
    */

    compose(
      str => 'abc',
      (str: string) => str + 'd'
    ); // $ExpectType (existing: string) => string
    compose(
      str => 'abc',
      iif(true, (str: string) => str + 'd')
    ); // $ExpectType (existing: string) => string
    compose(
      (str: string) => 'abc',
      iif(true, str => str + 'd')
    ); // $ExpectType (existing: string) => string
    compose(
      iif(true, (str: string) => str + 'd'),
      str => str + 'd'
    ); // $ExpectType (existing: string) => string

    compose<string | null>(str => 'abc'); // $ExpectType (existing: string | null) => string | null
    compose<string | null>(str => null); // $ExpectType (existing: string | null) => string | null
    compose<string | null>(
      str => 'abc',
      str => null
    ); // $ExpectType (existing: string | null) => string | null
    compose<string | undefined>(str => 'abc'); // $ExpectType (existing: string | undefined) => string | undefined
    compose<string | undefined>(str => undefined); // $ExpectType (existing: string | undefined) => string | undefined
    compose<string | undefined>(
      str => 'abc',
      str => undefined
    ); // $ExpectType (existing: string | undefined) => string | undefined
  });

  it('should return the correct implied string type', () => {
    compose(
      null!,
      '10'
    ); // $ExpectType (existing: string) => string
    compose(
      null!,
      '10',
      '20'
    ); // $ExpectType (existing: string) => string
    compose(
      undefined!,
      '10'
    ); // $ExpectType (existing: string) => string
    compose(
      undefined!,
      '10',
      '20'
    ); // $ExpectType (existing: string) => string

    compose(
      true,
      '10'
    ); // $ExpectType (existing: string) => string
    compose(
      false,
      '10',
      '20'
    ); // $ExpectType (existing: string) => string
    compose(
      false,
      '10',
      null
    ); // $ExpectType (existing: string | null) => string | null
    compose(
      false,
      null,
      '10'
    ); // $ExpectType (existing: string | null) => string | null
    compose(
      false,
      '10',
      undefined
    ); // $ExpectType (existing: string | undefined) => string | undefined
    compose(
      false,
      undefined,
      '10'
    ); // $ExpectType (existing: string | undefined) => string | undefined

    compose(
      () => true,
      '10'
    ); // $ExpectType (existing: string) => string
    compose(
      () => false,
      '10',
      '20'
    ); // $ExpectType (existing: string) => string
    compose(
      () => false,
      '10',
      null
    ); // $ExpectType (existing: string | null) => string | null
    compose(
      () => false,
      '10',
      undefined
    ); // $ExpectType (existing: string | undefined) => string | undefined

    compose(
      val => val === '1',
      '10'
    ); // $ExpectType (existing: string) => string
    compose(
      val => val === '1',
      '10',
      '20'
    ); // $ExpectType (existing: string) => string
    compose(
      val => val === '1',
      '10',
      null
    ); // $ExpectType (existing: string | null) => string | null
    compose(
      val => val === '1',
      null,
      '10'
    ); // $ExpectType (existing: string | null) => string | null
    compose(
      val => val === null,
      '10',
      null
    ); // $ExpectType (existing: string | null) => string | null
    compose(
      val => val === '1',
      '10',
      undefined
    ); // $ExpectType (existing: string | undefined) => string | undefined
    compose(
      val => val === '1',
      undefined,
      '10'
    ); // $ExpectType (existing: string | undefined) => string | undefined
    compose(
      val => val === undefined,
      '10',
      undefined
    ); // $ExpectType (existing: string | undefined) => string | undefined
  });

  it('should return the correct implied boolean type', () => {
    compose(
      null!,
      true
    ); // $ExpectType (existing: boolean) => boolean
    compose(
      null!,
      true,
      false
    ); // $ExpectType (existing: boolean) => boolean
    compose(
      undefined!,
      true
    ); // $ExpectType (existing: boolean) => boolean
    compose(
      undefined!,
      true,
      false
    ); // $ExpectType (existing: boolean) => boolean

    compose(
      true,
      true
    ); // $ExpectType (existing: boolean) => boolean
    compose(
      false,
      true,
      false
    ); // $ExpectType (existing: boolean) => boolean
    compose(
      false,
      true,
      null
    ); // $ExpectType (existing: boolean | null) => boolean | null
    compose(
      false,
      null,
      true
    ); // $ExpectType (existing: boolean | null) => boolean | null
    compose(
      false,
      true,
      undefined
    ); // $ExpectType (existing: boolean | undefined) => boolean | undefined
    compose(
      false,
      undefined,
      true
    ); // $ExpectType (existing: boolean | undefined) => boolean | undefined

    compose(
      () => true,
      true
    ); // $ExpectType (existing: boolean) => boolean
    compose(
      () => false,
      true,
      false
    ); // $ExpectType (existing: boolean) => boolean
    compose(
      () => false,
      true,
      null
    ); // $ExpectType (existing: boolean | null) => boolean | null
    compose(
      () => false,
      true,
      undefined
    ); // $ExpectType (existing: boolean | undefined) => boolean | undefined

    compose(
      val => val === true,
      true
    ); // $ExpectType (existing: boolean) => boolean
    compose(
      val => val === true,
      true,
      false
    ); // $ExpectType (existing: boolean) => boolean
    compose(
      val => val === true,
      true,
      null
    ); // $ExpectType (existing: boolean | null) => boolean | null
    compose(
      val => val === true,
      null,
      true
    ); // $ExpectType (existing: boolean | null) => boolean | null
    compose(
      val => val === null,
      true,
      null
    ); // $ExpectType (existing: boolean | null) => boolean | null
    compose(
      val => val === true,
      true,
      undefined
    ); // $ExpectType (existing: boolean | undefined) => boolean | undefined
    compose(
      val => val === true,
      undefined,
      true
    ); // $ExpectType (existing: boolean | undefined) => boolean | undefined
    compose(
      val => val === undefined,
      true,
      undefined
    ); // $ExpectType (existing: boolean | undefined) => boolean | undefined
  });

  it('should return the correct implied object type', () => {
    compose(
      null!,
      { val: '10' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }
    compose(
      null!,
      { val: '10' },
      { val: '20' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }
    compose(
      undefined!,
      { val: '10' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }
    compose(
      undefined!,
      { val: '10' },
      { val: '20' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }

    compose(
      true,
      { val: '10' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }
    compose(
      false,
      { val: '10' },
      { val: '20' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }
    compose(
      false,
      { val: '10' },
      null
    ); // $ExpectType (existing: Readonly<{ val: string; }> | null) => { val: string; } | null
    compose(
      false,
      null,
      { val: '10' }
    ); // $ExpectType (existing: Readonly<{ val: string; }> | null) => { val: string; } | null
    compose(
      false,
      { val: '10' },
      undefined
    ); // $ExpectType (existing: Readonly<{ val: string; }> | undefined) => { val: string; } | undefined
    compose(
      false,
      undefined,
      { val: '10' }
    ); // $ExpectType (existing: Readonly<{ val: string; }> | undefined) => { val: string; } | undefined

    compose(
      () => true,
      { val: '10' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }
    compose(
      () => false,
      { val: '10' },
      { val: '20' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }
    compose(
      () => false,
      { val: '10' },
      null
    ); // $ExpectType (existing: Readonly<{ val: string; }> | null) => { val: string; } | null
    compose(
      () => false,
      { val: '10' },
      undefined
    ); // $ExpectType (existing: Readonly<{ val: string; }> | undefined) => { val: string; } | undefined

    compose(
      obj => obj!.val === '1',
      { val: '10' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }
    compose(
      obj => obj!.val === '1',
      { val: '10' },
      { val: '20' }
    ); // $ExpectType (existing: Readonly<{ val: string; }>) => { val: string; }
    compose(
      obj => obj!.val === '1',
      { val: '10' },
      null
    ); // $ExpectType (existing: Readonly<{ val: string; }> | null) => { val: string; } | null
    compose(
      obj => obj!.val === '1',
      null,
      { val: '10' }
    ); // $ExpectType (existing: Readonly<{ val: string; }> | null) => { val: string; } | null
    compose(
      obj => obj === null,
      { val: '10' },
      null
    ); // $ExpectType (existing: Readonly<{ val: string; }> | null) => { val: string; } | null
    compose(
      obj => obj!.val === '1',
      { val: '10' },
      undefined
    ); // $ExpectType (existing: Readonly<{ val: string; }> | undefined) => { val: string; } | undefined
    compose(
      obj => obj!.val === '1',
      undefined,
      { val: '10' }
    ); // $ExpectType (existing: Readonly<{ val: string; }> | undefined) => { val: string; } | undefined
    compose(
      obj => obj === undefined,
      { val: '10' },
      undefined
    ); // $ExpectType (existing: Readonly<{ val: string; }> | undefined) => { val: string; } | undefined
  });

  it('should return the corrrect implied object type', () => {
    /* TODO: readonly array improvement with TS3.4
    compose(null!, ['10']); // $/ExpectType (existing: string[]) => string[]
    compose(null!, ['10'], ['20']); // $/ExpectType (existing: string[]) => string[]
    compose(undefined!, ['10']); // $/ExpectType (existing: string[]) => string[]
    compose(undefined!, ['10'], ['20']); // $/ExpectType (existing: string[]) => string[]

    compose(true, ['10']); // $/ExpectType (existing: string[]) => string[]
    compose(false, ['10'], ['20']); // $/ExpectType (existing: string[]) => string[]
    compose(false, ['10'], null); // $/ExpectType (existing: string[] | null) => string[] | null
    compose(false, null, ['10']); // $/ExpectType (existing: string[] | null) => string[] | null
    compose(false, ['10'], undefined); // $/ExpectType (existing: string[] | undefined) => string[] | undefined
    compose(false, undefined, ['10']); // $/ExpectType (existing: string[] | undefined) => string[] | undefined

    compose(() => true, ['10']); // $/ExpectType (existing: string[]) => string[]
    compose(() => false, ['10'], ['20']); // $/ExpectType (existing: string[]) => string[]
    compose(() => false, ['10'], null); // $/ExpectType (existing: string[] | null) => string[] | null
    compose(() => false, ['10'], undefined); // $/ExpectType (existing: string[] | undefined) => string[] | undefined

    compose(arr => arr!.includes('1'), ['10']); // $/ExpectType (existing: string[]) => string[]
    compose(arr => arr!.includes('1'), ['10'], ['20']); // $/ExpectType (existing: string[]) => string[]
    compose(arr => arr!.includes('1'), ['10'], null); // $/ExpectType (existing: string[] | null) => string[] | null
    compose(arr => arr!.includes('1'), null, ['10']); // $/ExpectType (existing: string[] | null) => string[] | null
    compose(arr => arr === null, ['10'], null); // $/ExpectType (existing: string[] | null) => string[] | null
    compose(arr => arr!.includes('1'), ['10'], undefined); // $/ExpectType (existing: string[] | undefined) => string[] | undefined
    compose(arr => arr!.includes('1'), undefined, ['10']); // $/ExpectType (existing: string[] | undefined) => string[] | undefined
    compose(arr => arr === undefined, ['10'], undefined); // $/ExpectType (existing: string[] | undefined) => string[] | undefined
    */
  });

  it('should have the following valid number usages', () => {
    interface MyType {
      num: number;
      _num: number | null;
      __num?: number;
    }

    const original: MyType = { num: 1, _num: null };

    patch<MyType>({
      num: compose(
        null!,
        1
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    patch<MyType>({
      num: compose(
        null!,
        2,
        3
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    patch<MyType>({
      num: compose(
        undefined!,
        1
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    patch<MyType>({
      num: compose(
        undefined!,
        2,
        3
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }

    patch<MyType>({
      num: compose(
        () => true,
        10
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    patch<MyType>({
      num: compose(
        true,
        10
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    patch<MyType>({
      num: compose(
        val => val === 1,
        10
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    patch<MyType>({
      num: compose(
        () => false,
        10,
        20
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    patch<MyType>({
      num: compose(
        false,
        10,
        20
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    patch<MyType>({
      num: compose(
        val => val === 2,
        10,
        20
      )
    })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }

    compose<number | null>(
      () => true,
      null
    )(100); // $ExpectType number | null
    compose<number | null>(
      () => false,
      1
    )(100); // $ExpectType number | null
    compose<number | null>(
      () => false,
      1,
      null
    )(100); // $ExpectType number | null
    // Commented out because they document an existing bug
    // patch<MyType>({ _num: compose(() => true, null) })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    // patch<MyType>({ _num: compose(() => false, 123, null) })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }

    compose<number | undefined>(
      () => true,
      undefined
    )(100); // $ExpectType number | undefined
    compose<number | undefined>(
      () => true,
      1
    )(100); // $ExpectType number | undefined
    compose<number | undefined>(
      () => true,
      1,
      undefined
    )(100); // $ExpectType number | undefined
    // Commented out because they document an existing bug
    // patch<MyType>({ __num: compose(() => true, undefined) })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }
    // patch<MyType>({ __num: compose(() => false, 123, undefined) })(original); // $ExpectType { num: number; _num: number | null; __num?: number | undefined; }

    compose<MyType>(
      () => true,
      patch<MyType>({ num: 1 })
    )(original); // $ExpectType MyType
    compose<MyType>(
      () => true,
      patch<MyType>({ num: 3, _num: 4 }),
      patch<MyType>({ num: 5, __num: 6 })
    )(original); // $ExpectType MyType

    patch<MyType>({
      num: compose(
        () => false,
        10,
        30
      ),
      _num: compose(
        () => true,
        50,
        100
      ),
      __num: compose(
        () => true,
        5,
        10
      )
    })(original); // $ExpectType MyType
  });

  it('should have the following valid string usages', () => {
    interface MyType {
      str: string;
      _str: string | null;
      __str?: string;
    }

    const original: MyType = { str: '1', _str: null };

    patch<MyType>({
      str: compose(
        null!,
        '1'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    patch<MyType>({
      str: compose(
        null!,
        '2',
        '3'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    patch<MyType>({
      str: compose(
        undefined!,
        '1'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    patch<MyType>({
      str: compose(
        undefined!,
        '2',
        '3'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }

    patch<MyType>({
      str: compose(
        () => true,
        '10'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    patch<MyType>({
      str: compose(
        true,
        '10'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    patch<MyType>({
      str: compose(
        val => val === '1',
        '10'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    patch<MyType>({
      str: compose(
        () => false,
        '10',
        '20'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    patch<MyType>({
      str: compose(
        false,
        '10',
        '20'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    patch<MyType>({
      str: compose(
        val => val === '2',
        '10',
        '20'
      )
    })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }

    compose<string | null>(
      () => true,
      null
    )('100'); // $ExpectType string | null
    compose<string | null>(
      () => false,
      '1'
    )('100'); // $ExpectType string | null
    compose<string | null>(
      () => false,
      '1',
      null
    )('100'); // $ExpectType string | null
    // Commented out because they document an existing bug
    // patch<MyType>({ _str: compose(() => true, null) })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    // patch<MyType>({ _str: compose(() => false, '123', null) })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }

    compose<string | undefined>(
      () => true,
      undefined
    )('100'); // $ExpectType string | undefined
    compose<string | undefined>(
      () => true,
      '1'
    )('100'); // $ExpectType string | undefined
    compose<string | undefined>(
      () => true,
      '1',
      undefined
    )('100'); // $ExpectType string | undefined
    // Commented out because they document an existing bug
    // patch<MyType>({ __str: compose(() => true, undefined) })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }
    // patch<MyType>({ __str: compose(() => false, '123', undefined) })(original); // $ExpectType { str: string; _str: string | null; __str?: string | undefined; }

    compose<MyType>(
      () => true,
      patch<MyType>({ str: '1' })
    )(original); // $ExpectType MyType
    compose<MyType>(
      () => true,
      patch<MyType>({ str: '3', _str: '4' }),
      patch<MyType>({ str: '5', __str: '6' })
    )(original); // $ExpectType MyType

    patch<MyType>({
      str: compose(
        () => false,
        '10',
        '30'
      ),
      _str: compose(
        () => true,
        '50',
        '100'
      ),
      __str: compose(
        () => true,
        '5',
        '10'
      )
    })(original); // $ExpectType MyType
  });

  it('should have the following valid boolean usages', () => {
    interface MyType {
      bool: boolean;
      _bool: boolean | null;
      __bool?: boolean;
    }

    const original: MyType = { bool: true, _bool: null };

    patch<MyType>({
      bool: compose(
        null!,
        true
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    patch<MyType>({
      bool: compose(
        null!,
        false,
        true
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    patch<MyType>({
      bool: compose(
        undefined!,
        true
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    patch<MyType>({
      bool: compose(
        undefined!,
        false,
        true
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }

    patch<MyType>({
      bool: compose(
        () => true,
        true
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    patch<MyType>({
      bool: compose(
        true,
        true
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    patch<MyType>({
      bool: compose(
        val => val === true,
        true
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    patch<MyType>({
      bool: compose(
        () => false,
        true,
        false
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    patch<MyType>({
      bool: compose(
        false,
        true,
        false
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    patch<MyType>({
      bool: compose(
        val => val === false,
        true,
        false
      )
    })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }

    compose<boolean | null>(
      () => true,
      null
    )(true); // $ExpectType boolean | null
    compose<boolean | null>(
      () => false,
      true
    )(true); // $ExpectType boolean | null
    compose<boolean | null>(
      () => false,
      true,
      null
    )(true); // $ExpectType boolean | null
    // Commented out because they document an existing bug
    // patch<MyType>({ _bool: compose(() => true, null) })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    // patch<MyType>({ _bool: compose(() => false, true, null) })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }

    compose<boolean | undefined>(
      () => true,
      undefined
    )(true); // $ExpectType boolean | undefined
    compose<boolean | undefined>(
      () => true,
      true
    )(true); // $ExpectType boolean | undefined
    compose<boolean | undefined>(
      () => true,
      true,
      undefined
    )(true); // $ExpectType boolean | undefined
    // Commented out because they document an existing bug
    // patch<MyType>({ __bool: compose(() => true, undefined) })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }
    // patch<MyType>({ __bool: compose(() => false, true, undefined) })(original); // $ExpectType { bool: boolean; _bool: boolean | null; __bool?: boolean | undefined; }

    compose<MyType>(
      () => true,
      patch<MyType>({ bool: true })
    )(original); // $ExpectType MyType
    compose<MyType>(
      () => true,
      patch<MyType>({ bool: true, _bool: false }),
      patch<MyType>({ bool: false, __bool: true })
    )(original); // $ExpectType MyType

    patch<MyType>({
      bool: compose(
        () => false,
        true,
        false
      ),
      _bool: compose(
        () => true,
        false,
        true
      ),
      __bool: compose(
        () => true,
        false,
        true
      )
    })(original); // $ExpectType MyType
  });

  it('should have the following valid object usages', () => {
    interface MyObj {
      val: string;
    }
    interface MyType {
      obj: MyObj;
      _obj: MyObj | null;
      __obj?: MyObj;
    }

    const original: MyType = { obj: { val: '1' }, _obj: null };

    patch<MyType>({
      obj: compose(
        null!,
        { val: '1' }
      )
    })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    patch<MyType>({
      obj: compose(
        null!,
        { val: '2' },
        { val: '3' }
      )
    })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    patch<MyType>({
      obj: compose(
        undefined!,
        { val: '1' }
      )
    })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    patch<MyType>({
      obj: compose(
        undefined!,
        { val: '2' },
        { val: '3' }
      )
    })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }

    patch<MyType>({
      obj: compose(
        () => true,
        { val: '10' }
      )
    })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    patch<MyType>({
      obj: compose(
        true,
        { val: '10' }
      )
    })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    patch<MyType>({
      obj: compose(
        obj => obj!.val === '1',
        { val: '10' }
      )
    })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    patch<MyType>({
      obj: compose(
        () => false,
        { val: '10' },
        { val: '20' }
      )
    })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    patch<MyType>({
      obj: compose(
        false,
        { val: '10' },
        { val: '20' }
      )
    })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    patch<MyType>({
      obj: compose(
        obj => obj!.val === '2',
        { val: '10' },
        { val: '20' }
      )
    })(original); // $ExpectType MyType

    compose<MyObj | null>(
      () => true,
      null
    )({ val: '100' }); // $ExpectType MyObj | null
    compose<MyObj | null>(
      () => false,
      { val: '1' }
    )({ val: '100' }); // $ExpectType MyObj | null
    compose<MyObj | null>(
      () => false,
      { val: '1' },
      null
    )({ val: '100' }); // $ExpectType MyObj | null
    // Commented out because they document an existing bug
    // patch<MyType>({ _obj: compose(() => true, null) })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    // patch<MyType>({ _obj: compose(() => false, { val: '123' }, null) })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }

    compose<MyObj | undefined>(
      () => true,
      undefined
    )({ val: '100' }); // $ExpectType MyObj | undefined
    compose<MyObj | undefined>(
      () => true,
      { val: '1' }
    )({ val: '100' }); // $ExpectType MyObj | undefined
    compose<MyObj | undefined>(
      () => true,
      { val: '1' },
      undefined
    )({ val: '100' }); // $ExpectType MyObj | undefined
    // Commented out because they document an existing bug
    // patch<MyType>({ __obj: compose(() => true, undefined) })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }
    // patch<MyType>({ __obj: compose(() => false, { val: '123' }, undefined) })(original); // $ExpectType { obj: MyObj; _obj: MyObj | null; __obj?: MyObj | undefined; }

    compose<MyType>(
      () => true,
      patch<MyType>({ obj: { val: '1' } })
    )(original); // $ExpectType MyType
    compose<MyType>(
      () => true,
      patch<MyType>({ obj: { val: '3' }, _obj: { val: '4' } }),
      patch<MyType>({ obj: { val: '5' }, __obj: { val: '6' } })
    )(original); // $ExpectType MyType

    patch<MyType>({
      obj: compose(
        () => false,
        { val: '10' },
        { val: '30' }
      ),
      _obj: compose(
        () => true,
        { val: '50' },
        { val: '100' }
      ),
      __obj: compose(
        () => true,
        { val: '5' },
        { val: '10' }
      )
    })(original); // $ExpectType MyType
  });

  it('should have the following valid complex usage', () => {
    interface Person {
      name: string;
      lastName?: string;
      nickname?: string;
    }

    interface Greeting {
      motivated?: boolean;
      person: Person;
    }

    interface Model {
      a: number;
      b: {
        hello?: Greeting;
        goodbye?: Greeting;
        greeting?: string;
      };
      c?: number;
    }

    const original: Model = {
      a: 1,
      b: {
        hello: {
          person: {
            name: 'you'
          }
        },
        goodbye: {
          person: {
            name: 'Artur'
          }
        }
      }
    };

    /* !>TS3.4!
    patch<Model>({
      b: compose<Model['b']>(
        b => typeof b!.hello === 'object',
        patch<Model['b']>({
          hello: patch({
            motivated: compose(motivated => motivated !== true, true),
            person: patch({
              name: 'Artur',
              lastName: 'Androsovych'
            })
          }),
          greeting: 'How are you?'
        })
      ),
      c: compose(c => c !== 100, () => 0 + 100, 10)
    })(original); // $/ExpectType Model

    patch<Model>({
      b: patch<Model['b']>({
        hello: patch<Greeting>({
          motivated: compose(motivated => motivated !== true, true),
          person: patch({
            name: compose(name => name !== 'Mark', 'Artur'),
            lastName: compose(lastName => lastName !== 'Whitfeld', 'Androsovych')
          })
        }),
        greeting: compose(greeting => !greeting, 'How are you?')
      }),
      c: compose(c => !c, 100, 10)
    })(original); // $/ExpectType Model
    */
  });

  it('should not accept the following usages', () => {
    interface MyType {
      num: number;
      _num: number | null;
      __num?: number;
      str: string;
      _str: string | null;
      __str?: string;
      bool: boolean;
      _bool: boolean | null;
      __bool?: boolean;
    }

    const original: MyType = {
      num: 1,
      _num: null,
      str: '2',
      _str: null,
      bool: true,
      _bool: null
    };

    patch<MyType>({
      num: compose(
        true,
        '1'
      )
    })(original); // $ExpectError
    patch<MyType>({
      num: compose(
        true,
        {}
      )
    })(original); // $ExpectError
    patch<MyType>({
      _num: compose(
        true,
        '1'
      )
    })(original); // $ExpectError
    patch<MyType>({
      _num: compose(
        true,
        undefined
      )
    })(original); // $ExpectError
    patch<MyType>({
      __num: compose(
        true,
        '1'
      )
    })(original); // $ExpectError
    patch<MyType>({
      __num: compose(
        true,
        null
      )
    })(original); // $ExpectError
    patch<MyType>({
      str: compose(
        true,
        1
      )
    })(original); // $ExpectError
    patch<MyType>({
      str: compose(
        true,
        {}
      )
    })(original); // $ExpectError
    patch<MyType>({
      _str: compose(
        true,
        1
      )
    })(original); // $ExpectError
    patch<MyType>({
      _str: compose(
        true,
        undefined
      )
    })(original); // $ExpectError
    patch<MyType>({
      __str: compose(
        true,
        1
      )
    })(original); // $ExpectError
    patch<MyType>({
      __str: compose(
        true,
        null
      )
    })(original); // $ExpectError
    patch<MyType>({
      bool: compose(
        true,
        '1'
      )
    })(original); // $ExpectError
    patch<MyType>({
      bool: compose(
        true,
        {}
      )
    })(original); // $ExpectError
    patch<MyType>({
      _bool: compose(
        true,
        '1'
      )
    })(original); // $ExpectError
    patch<MyType>({
      _bool: compose(
        true,
        undefined
      )
    })(original); // $ExpectError
    patch<MyType>({
      __bool: compose(
        true,
        '1'
      )
    })(original); // $ExpectError
    patch<MyType>({
      __bool: compose(
        true,
        null
      )
    })(original); // $ExpectError
  });
});
