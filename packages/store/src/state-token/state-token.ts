import { TokenName } from './symbols';

export class StateToken<T> {
  protected constructor(public readonly name: string) {}

  static create<U = void>(name: TokenName<U>): StateToken<U> {
    return new StateToken<U>(name);
  }

  toString(): string {
    return this.name;
  }
}
