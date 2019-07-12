import { Predicate, RepairType } from '../../../operators/src/internals';

describe('utils', () => {
  describe('[RepairType]', () => {
    it('should have the correct return types', () => {
      function testRepairType<T>(value: T): RepairType<T> {
        return value as RepairType<T>;
      }

      testRepairType(true); // $ExpectType boolean
      testRepairType(false); // $ExpectType boolean
      testRepairType('abc'); // $ExpectType string
      testRepairType({}); // $ExpectType {}
    });
  });

  describe('[Predicate]', () => {
    it('should have the correct return types', () => {
      function testPredicate<T>(value: Predicate<T>): Predicate<T> {
        return null! as Predicate<T>;
      }
      // ??? How to test type parameter
    });
  });
});
