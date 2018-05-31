import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { NGXS_PLUGINS } from '@ngxs/store';

import { NgxsDevModePlugin } from './devmode.plugin';
import { NgxsDevModePluginOptions, NGXS_DEV_MODE_PLUGIN_OPTIONS } from './symbols';

const defaultOptions: NgxsDevModePluginOptions = {
  freeze: true
};

export function devModeOptionsFactory(options: NgxsDevModePluginOptions) {
  return {
    ...defaultOptions,
    ...options
  };
}

export const USER_OPTIONS = new InjectionToken('DEV_MODE_USER_OPTIONS');

@NgModule()
export class NgxsDevModePluginModule {
  static forRoot(options: NgxsDevModePluginOptions = defaultOptions): ModuleWithProviders {
    return {
      ngModule: NgxsDevModePluginModule,
      providers: [
        {
          provide: NGXS_PLUGINS,
          useClass: NgxsDevModePlugin,
          multi: true
        },
        {
          provide: USER_OPTIONS,
          useValue: options
        },
        {
          provide: NGXS_DEV_MODE_PLUGIN_OPTIONS,
          useFactory: devModeOptionsFactory,
          deps: [USER_OPTIONS]
        }
      ]
    };
  }
}
