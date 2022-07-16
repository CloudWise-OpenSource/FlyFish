// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApplication = require('../../../app/controller/application');
import ExportBase = require('../../../app/controller/base');
import ExportChrome = require('../../../app/controller/chrome');
import ExportCommon = require('../../../app/controller/common');
import ExportComponent = require('../../../app/controller/component');
import ExportMenu = require('../../../app/controller/menu');
import ExportProject = require('../../../app/controller/project');
import ExportRole = require('../../../app/controller/role');
import ExportTag = require('../../../app/controller/tag');
import ExportTrade = require('../../../app/controller/trade');
import ExportUser = require('../../../app/controller/user');

declare module 'egg' {
  interface IController {
    application: ExportApplication;
    base: ExportBase;
    chrome: ExportChrome;
    common: ExportCommon;
    component: ExportComponent;
    menu: ExportMenu;
    project: ExportProject;
    role: ExportRole;
    tag: ExportTag;
    trade: ExportTrade;
    user: ExportUser;
  }
}
