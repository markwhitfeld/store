import { Inject, Injectable } from '@angular/core';
import { NgxsPlugin, StateOperations } from '@ngxs/store';

import { NgxsDevModePluginOptions, NGXS_DEV_MODE_PLUGIN_OPTIONS } from './symbols';

const deepFreeze = require('deep-freeze-strict');

@Injectable()
export class NgxsDevModePlugin implements NgxsPlugin {
  constructor(@Inject(NGXS_DEV_MODE_PLUGIN_OPTIONS) private _options: NgxsDevModePluginOptions) {}

  handle(state, event, next) {
    return next(state, event);
  }

  wrapStateOperations(root: StateOperations<any>): StateOperations<any> {
    if (!this._options.freeze) {
      return root;
    }
    return {
      getState: () => root.getState(),
      setState: value => {
        const frozenValue = deepFreeze(value);
        return root.setState(frozenValue);
      },
      dispatch: actions => {
        const frozenActions = deepFreeze(actions);
        return root.dispatch(frozenActions);
      }
    };
  }
}
