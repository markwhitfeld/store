import { TokenName } from './symbols';
import { ensureSelectorMetadata, propGetter } from '../internal/internals';
import { SelectFactory } from '../decorators/select/select-factory';

export class StateToken<T> {
  protected constructor(public readonly name: string) {
    return <StateToken<T>>this;
    const selectorMatadata = ensureSelectorMetadata(<any>this);
    selectorMatadata.selectFromAppState = (state: any) => {
      // This is lazy initialized with the select from app state function
      // so that it can get the config at the last responsible moment
      const getter = propGetter([name], SelectFactory.config!);
      selectorMatadata.selectFromAppState = getter;
      return getter(state);
    };
  }

  static create<U = void>(name: TokenName<U>): StateToken<U> {
    return new StateToken<U>(name);
  }

  toString(): string {
    return this.name;
  }
}
