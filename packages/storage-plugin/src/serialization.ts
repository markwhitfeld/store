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

  serialize(obj: any, key?: string): string {
    const option = this._findOption(key);
    let val = obj;

    if (option && option.onBeforeSerialize) {
      val = option.onBeforeSerialize(val);
    }

    return this.serializeInternal(val);
  }

  deserialize(obj: any, key?: string): any {
    const option = this._findOption(key);
    let val = this.deserializeInternal(obj);

    if (option && option.onAfterDeserialize) {
      val = option.onAfterDeserialize(val);
    }

    return val;
  }

  protected serializeInternal(obj: any): string {
    return JSON.stringify(obj);
  }

  protected deserializeInternal(obj: any): any {
    return JSON.parse(obj);
  }

  private _findOption(key?: string): SerializationOption | undefined {
    return this._options.find(
      strategy => (!strategy.key && key === DEFAULT_STATE_KEY) || strategy.key === key
    );
  }
}
