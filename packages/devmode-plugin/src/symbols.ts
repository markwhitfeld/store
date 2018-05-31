import { InjectionToken } from '@angular/core';

export interface NgxsDevModePluginOptions {
  /**
   * Strict freeze all state and actions to throw an error on mutation (default: true).
   */
  freeze?: boolean;
}

export const NGXS_DEV_MODE_PLUGIN_OPTIONS = new InjectionToken('NGXS_DEV_MODE_PLUGIN_OPTION');
