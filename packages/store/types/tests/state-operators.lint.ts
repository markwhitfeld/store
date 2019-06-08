/* tslint:disable:max-line-length */
/// <reference types="@types/jest" />
import { iif, patch } from '../../operators/src';
import { assertType } from './utils/assert-type';

describe('[TEST]: State Operators', () => {
  describe('iif', () => {
    it('should have the following valid usages', () => {
      interface MyType {
        num: number;
        _num: number | null;
        __num?: number;
        str: string;
        _str?: string;
        bool: boolean;
        _bool?: boolean;
      }

      const original: MyType = { num: 1, _num: null, str: '2', bool: true };

      patch<MyType>({ num: iif(null!, 1) })(original); // $ExpectType MyType
      patch<MyType>({ num: iif(null!, 2, 3) })(original); // $ExpectType MyType
      patch<MyType>({ num: iif(undefined!, 1) })(original); // $ExpectType MyType
      patch<MyType>({ num: iif(undefined!, 2, 3) })(original); // $ExpectType MyType

      patch<MyType>({ num: iif(() => true, 10) })(original); // $ExpectType MyType
      patch<MyType>({ num: iif(true, 10) })(original); // $ExpectType MyType
      patch<MyType>({ num: iif(val => val === 1, 10) })(original); // $ExpectType MyType
      patch<MyType>({ num: iif(() => false, 10, 20) })(original); // $ExpectType MyType
      patch<MyType>({ num: iif(false, 10, 20) })(original); // $ExpectType MyType
      patch<MyType>({ num: iif(val => val === 2, 10, 20) })(original); // $ExpectType MyType

      iif<number | undefined>(() => true, undefined)(100); // $ExpectType number | undefined
      iif<number | undefined>(() => true, 1)(100); // $ExpectType number | undefined
      iif<number | undefined>(() => true, 1, undefined)(100); // $ExpectType number | undefined
      patch<MyType>({ __num: iif(() => true, undefined) })(original); // $ExpectType MyType
      patch<MyType>({ __num: iif(() => false, 123, undefined) })(original); // $ExpectType MyType

      iif<number | null>(() => true, null)(100); // $ExpectType number | null
      iif<number | null>(() => false, 1)(100); // $ExpectType number | null
      iif<number | null>(() => false, 1, null)(100); // $ExpectType number | null
      patch<MyType>({ _num: iif(() => true, null) })(original); // $ExpectType MyType
      patch<MyType>({ _num: iif(() => false, 123, null) })(original); // $ExpectType MyType

      iif<MyType>(() => true, patch<MyType>({ num: 1 }))(original); // $ExpectType MyType
      iif<MyType>(
        () => true,
        patch<MyType>({ num: 3, _num: 4 }),
        patch<MyType>({ num: 5, __num: 6 })
      )(original); // $ExpectType MyType

      patch<MyType>({
        // $ExpectType MyType
        num: iif(() => false, 10, 30),
        _num: iif(() => true, 50, 100)
      })(original);
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

      patch<Model>({
        b: iif<Model['b']>(
          b => typeof b!.hello === 'object',
          patch({
            hello: patch({
              motivated: iif(motivated => motivated !== true, true),
              person: patch({
                name: 'Artur',
                lastName: 'Androsovych'
              })
            }),
            greeting: 'How are you?'
          })
        ),
        c: iif(c => c !== 100, () => 0 + 100, 10)
      })(original); // $ExpectType Model

      patch<Model>({
        b: patch<Model['b']>({
          hello: patch<Greeting>({
            motivated: iif(motivated => motivated !== true, true),
            person: patch({
              name: iif(name => name !== 'Mark', 'Artur'),
              lastName: iif(lastName => lastName !== 'Whitfeld', 'Androsovych')
            })
          }),
          greeting: iif(greeting => !greeting, 'How are you?')
        }),
        c: iif(c => !c, 100, 10)
      })(original); // $ExpectType Model
    });
  });

  it('should not accept the following usages', () => {
    interface MyType {
      num: number;
      _num: number | null;
      __num?: number;
      str: string;
      _str?: string;
      bool: boolean;
      _bool?: boolean;
    }

    const original: MyType = { num: 1, _num: null, str: '2', bool: true };

    patch<MyType>({ num: iif(null!, '1') })(original); // $ExpectError
  });
});
