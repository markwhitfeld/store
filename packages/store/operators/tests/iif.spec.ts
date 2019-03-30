import { iif } from '../src/iif';
import { patch } from '../src/patch';

describe('iif', () => {
  describe('when null condition provided', () => {
    it('returns the same root if "else" not provided', () => {
      // Arrange
      const original = { a: 1, b: 2, c: 3 };

      // Act
      const newValue = patch({
        a: iif(null!, 1)
      })(original);

      // Assert
      expect(newValue).toBe(original);
    });

    it('returns the same root if "else" provides same value as existing', () => {
      // Arrange
      const original = { a: 1, b: 2, c: 3 };

      // Act
      const newValue = patch({
        a: iif(null!, 10, 1)
      })(original);

      // Assert
      expect(newValue).toBe(original);
    });

    it('returns patched object if "else" is provided with new value', () => {
      // Arrange
      const original = { a: 1, b: 2, c: 3 };

      // Act
      const newValue = patch({
        a: iif(null!, 10, 20)
      })(original);

      // Assert
      expect(newValue).not.toBe(original);
      expect(newValue).toEqual({
        a: 20,
        b: 2,
        c: 3
      });
    });
  });

  describe('when undefined condition provided', () => {
    it('returns the same root if "else" not provided', () => {
      // Arrange
      const original = { a: 1, b: 2, c: 3 };

      // Act
      const newValue = patch({
        a: iif(undefined!, 1)
      })(original);

      // Assert
      expect(newValue).toBe(original);
    });

    it('returns the same root if "else" provides same value as existing', () => {
      // Arrange
      const original = { a: 1, b: 2, c: 3 };

      // Act
      const newValue = patch({
        a: iif(undefined!, 10, 1)
      })(original);

      // Assert
      expect(newValue).toBe(original);
    });

    it('returns patched object if "else" is provided with new value', () => {
      // Arrange
      const original = { a: 1, b: 2, c: 3 };

      // Act
      const newValue = patch({
        a: iif(undefined!, 10, 20)
      })(original);

      // Assert
      expect(newValue).not.toBe(original);
      expect(newValue).toEqual({
        a: 20,
        b: 2,
        c: 3
      });
    });
  });

  describe('when undefined value provided', () => {
    it('returns undefined', () => {
      // Arrange

      // Act
      const newValue = iif<number | undefined>(() => true, undefined)(100);

      // Assert
      expect(newValue).toBeUndefined();
    });

    it('returns the same root if current value to patch is undefined', () => {
      // Arrange
      type Simple = {
        a?: number;
        b: number;
        c: number;
      };
      const original: Simple = { a: undefined, b: 2, c: 3 };

      // Act
      const newValue = patch<Simple>({
        a: iif(() => true, undefined)
      })(original);

      // Assert
      expect(newValue).toBe(original);
    });

    it('returns a new root if current value to patch is not undefined', () => {
      // Arrange
      type Simple = {
        a?: number;
        b: number;
        c: number;
      };
      const original: Simple = { a: 1, b: 2, c: 3 };

      // Act
      const newValue = patch<Simple>({
        a: iif(() => true, undefined)
      })(original);

      // Assert
      expect(newValue).toEqual({ a: undefined, b: 2, c: 3 });
    });
  });

  describe('when null value provided', () => {
    describe(`in the 'then'`, () => {
      it('returns null', () => {
        // Arrange

        // Act
        const newValue = iif<number | null>(() => true, null)(100);

        // Assert
        expect(newValue).toBeNull();
      });

      it('returns the same root if current value to patch is null', () => {
        // Arrange
        type Simple = {
          a: number | null;
          b: number;
          c: number;
        };
        const original: Simple = { a: null, b: 2, c: 3 };

        // Act
        const newValue = patch<Simple>({
          a: iif(() => true, null)
        })(original);

        // Assert
        expect(newValue).toBe(original);
      });

      it('returns a new root if current value to patch is not null', () => {
        // Arrange
        type Simple = {
          a: number | null;
          b: number;
          c: number;
        };
        const original: Simple = { a: 1, b: 2, c: 3 };

        // Act
        const newValue = patch<Simple>({
          a: iif(() => true, null)
        })(original);

        // Assert
        expect(newValue).toEqual({ a: null, b: 2, c: 3 });
      });
    });
    describe(`in the 'else'`, () => {
      it('returns null', () => {
        // Arrange

        // Act
        const newValue = iif<number | null>(() => false, 1, null)(100);

        // Assert
        expect(newValue).toBeNull();
      });

      it('returns the same root if current value to patch is null', () => {
        // Arrange
        type Simple = {
          a: number | null;
          b: number;
          c: number;
        };
        const original: Simple = { a: null, b: 2, c: 3 };

        // Act
        const newValue = patch<Simple>({
          a: <any>iif(() => false, 123, null) // known typings issue
        })(original);

        // Assert
        expect(newValue).toBe(original);
      });

      it('returns a new root if current value to patch is not null', () => {
        // Arrange
        type Simple = {
          a: number | null;
          b: number;
          c: number;
        };
        const original: Simple = { a: 1, b: 2, c: 3 };

        // Act
        const newValue = patch<Simple>({
          a: <any>iif(() => false, 123, null) // known typings issue
        })(original);

        // Assert
        expect(newValue).toEqual({ a: null, b: 2, c: 3 });
      });
    });
  });

  describe('when primitive values provided', () => {
    it('returns number if condition equals true', () => {
      // Act
      const newValue = iif(() => true, 10)(null!);
      // Assert
      expect(newValue).toBe(10);
    });

    it('returns the same root if number provided', () => {
      // Arrange
      const original = { a: 10, b: 10 };

      // Act
      const newValue = patch({
        a: iif(() => true, 10)
      })(original);

      // Assert
      expect(newValue).toBe(original);
    });

    it('returns the same root if "else" provides same value as existing', () => {
      // Arrange
      const original = { a: 10, b: 10 };

      // Act
      const newValue = patch({
        a: iif(false, 0, 10)
      })(original);

      // Assert
      expect(newValue).toEqual(original);
    });
  });

  describe('when argument provided into predicate function', () => {
    it('returns the same root if no changes', () => {
      // Arrange
      const original = { a: 1, b: 2, c: 3 };

      // Act
      const newValue = patch({
        a: iif(a => a === 1, 1),
        b: iif(b => b === 2, 2)
      })(original);

      // Assert
      expect(newValue).toBe(original);
    });

    it('returns new patched object when changed values', () => {
      // Arrange
      const original = { a: 1, b: 2, c: 3 };

      // Act
      const newValue = patch({
        a: iif(a => a! < 10, 10, 5),
        b: iif(b => b! > 0, 10, 5),
        c: iif(c => c! === 3, 10, 5)
      })(original);

      // Assert
      expect(newValue).not.toBe(original);
      expect(newValue).toEqual({
        a: 10,
        b: 10,
        c: 10
      });
    });
  });

  describe('when patch provided', () => {
    describe('and the condition is true', () => {
      it('returns the same root if the patched property is the same', () => {
        // Arrange
        const original = { a: 1, b: 2, c: 3 };

        // Act
        const newValue = iif(() => true, patch({ a: 1 }))(original);

        // Assert
        expect(newValue).toBe(original);
      });

      it('returns the same root if a large patch results in no changes', () => {
        // Arrange
        const original = { a: 1, b: 2, c: 3 };

        // Act
        const newValue = iif(() => true, patch({ a: 1, b: 2 }))(original);

        // Assert
        expect(newValue).toBe(original);
      });

      it('returns new patched object if changed', () => {
        // Arrange
        interface Original {
          a: number;
          b: number;
          c: number;
        }
        const original: Original = { a: 1, b: 2, c: 3 };

        // Act
        const newValue = iif<Original>(
          () => true,
          patch({ a: 3, b: 4 }),
          patch({ a: 5, b: 6 })
        )(original);

        // Assert
        expect(newValue).toEqual({
          a: 3,
          b: 4,
          c: 3
        });
      });
    });

    describe('and the condition is false', () => {
      it('returns the same root if the patched property is the same', () => {
        // Arrange
        interface Original {
          a: number;
          b: number;
          c: number;
        }
        const original = { a: 1, b: 2, c: 3 };

        // Act
        const newValue = iif<Original>(() => false, patch({ b: 20 }), patch({ a: 1 }))(
          original
        );

        // Assert
        expect(newValue).toBe(original);
      });

      it('returns the same root if a large patch results in no changes', () => {
        // Arrange
        const original = { a: 1, b: 2, c: 3 };

        // Act
        const newValue = iif(() => false, patch({ a: 3, b: 4 }), patch({ a: 1, b: 2 }))(
          original
        );

        // Assert
        expect(newValue).toBe(original);
      });
    });
  });

  describe('when used within a nested patch operators', () => {
    describe('with different calculated value', () => {
      it('returns new root', () => {
        // Arrange
        const original = { a: 10, b: 10 };

        // Act
        const newValue = patch({
          b: iif(() => true, 20)
        })(original);

        // Assert
        expect(newValue).not.toBe(original);
      });

      it('returns new root with calculated properties when multiple "iif"s provided', () => {
        // Arrange
        const original = { a: 20, b: 20 };

        // Act
        const newValue = patch({
          a: iif(() => false, 10, 30),
          b: iif(() => true, 50, 100)
        })(original);

        // Assert
        expect(newValue).toEqual({
          a: 30,
          b: 50
        });
      });

      it('applies a nested patch', () => {
        // Arrange
        type Combined = {
          a: number;
          b: { hello?: string; goodbye?: string };
        };
        const original: Combined = { a: 1, b: { hello: 'world' } };
        // Act
        const newValue = patch({
          b: iif<Combined['b']>(b => b!.hello === 'world', patch({ goodbye: 'there' }))
        })(original);

        // Assert
        expect(newValue).toEqual({
          a: 1,
          b: { hello: 'world', goodbye: 'there' }
        });
      });
    });

    describe('with same calculated value', () => {
      it('returns same root', () => {
        // Arrange
        const original = { a: 10, b: 10 };

        // Act
        const newValue = patch({
          b: iif(() => true, 10)
        })(original);

        // Assert
        expect(newValue).toBe(original);
      });

      it('returns same root when multiple "iif"s provided', () => {
        // Arrange
        const original = { a: 20, b: 30 };

        // Act
        const newValue = patch({
          a: iif(() => false, 10, 20),
          b: iif(() => true, 30, 100)
        })(original);

        // Assert
        expect(newValue).toBe(original);
      });

      it('returns same value for nested patch ', () => {
        // Arrange
        type Combined = {
          a: number;
          b: { hello?: string; goodbye?: string };
        };
        const original: Combined = { a: 1, b: { hello: 'world' } };
        // Act
        const newValue = patch({
          b: iif<Combined['b']>(b => b!.hello === 'world', patch({ hello: 'world' }))
        })(original);

        // Assert
        expect(newValue).toBe(original);
      });
    });

    describe('with nesting multiple levels deep', () => {
      it('returns the deeply patched object with multiple conditions provided', () => {
        // Arrange
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

        // Act
        const newValue = patch<Model>({
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
        })(original);

        const newValue2 = patch<Model>({
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
        })(original);

        // Assert
        expect(newValue).toEqual(newValue2);
        expect(newValue).toEqual({
          a: 1,
          b: {
            hello: {
              person: {
                name: 'Artur',
                lastName: 'Androsovych'
              },
              motivated: true
            },
            goodbye: {
              person: {
                name: 'Artur'
              }
            },
            greeting: 'How are you?'
          },
          c: 100
        });
      });
    });
  });
});
