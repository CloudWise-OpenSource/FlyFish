// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import { EggAppConfig } from 'egg';
import ExportConfigDefault = require('../../config/config.default');
type ConfigDefault = ReturnType<typeof ExportConfigDefault>;
type NewEggAppConfig = ConfigDefault;
declare module 'egg' {
  interface EggAppConfig extends NewEggAppConfig { }
}