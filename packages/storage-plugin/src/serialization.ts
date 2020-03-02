import { DEFAULT_STATE_KEY } from './internals';

export interface SerializationOption {
  /**
   * Key to serialize/deserialize.
   */
  key?: string;

  /**
   * Method to call before serialization.
   */
  onBeforeSerialize?: (obj: any) => any;

  /**
   * Method to call after deserialization.
   */
  onAfterDeserialize?: (obj: any) => any;
}

export class SerializationStrategy {
  constructor(private _options: SerializationOption[]) {}

  beforeSerialize(obj: any, key: string): any {
    return this._executeStrategy(obj, key, option => option.onBeforeSerialize);
  }

  afterDeserialize(obj: any, key: string): any {
    return this._executeStrategy(obj, key, option => option.onAfterDeserialize);
  }

  private _executeStrategy(
    obj: any,
    key: string,
    func: (option: SerializationOption) => ((obj: any) => any) | undefined
  ) {
    const strategy = this._findStrategy(key);

    if (strategy) {
      const prototype = func(strategy);

      if (prototype) {
        return prototype(obj);
      }
    }

    return obj;
  }

  private _findStrategy(key: string): SerializationOption | undefined {
    return this._options.find(
      strategy => (!strategy.key && key === DEFAULT_STATE_KEY) || strategy.key === key
    );
  }
}
