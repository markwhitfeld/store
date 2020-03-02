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
    return this._executeStrategy(obj, key, strategy =>
      strategy.onBeforeSerialize ? strategy.onBeforeSerialize(obj) : obj
    );
  }

  afterDeserialize(obj: any, key: string): any {
    return this._executeStrategy(obj, key, strategy =>
      strategy.onAfterDeserialize ? strategy.onAfterDeserialize(obj) : obj
    );
  }

  private _executeStrategy(obj: any, key: string, func: (option: SerializationOption) => any) {
    const strategy = this._findStrategy(key);

    if (strategy) {
      return func(strategy);
    }

    return obj;
  }

  private _findStrategy(key: string): SerializationOption | undefined {
    return this._options.find(
      strategy => (!strategy.key && key === DEFAULT_STATE_KEY) || strategy.key === key
    );
  }
}
