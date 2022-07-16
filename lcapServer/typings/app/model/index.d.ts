// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApplication = require('../../../app/model/application');
import ExportComponentCategory = require('../../../app/model/component-category');
import ExportComponent = require('../../../app/model/component');
import ExportMenu = require('../../../app/model/menu');
import ExportProject = require('../../../app/model/project');
import ExportResourceRenderRecords = require('../../../app/model/resource-render-records');
import ExportRole = require('../../../app/model/role');
import ExportTag = require('../../../app/model/tag');
import ExportTrade = require('../../../app/model/trade');
import ExportUser = require('../../../app/model/user');

declare module 'egg' {
  interface IModel {
    Application: ReturnType<typeof ExportApplication>;
    ComponentCategory: ReturnType<typeof ExportComponentCategory>;
    Component: ReturnType<typeof ExportComponent>;
    Menu: ReturnType<typeof ExportMenu>;
    Project: ReturnType<typeof ExportProject>;
    ResourceRenderRecords: ReturnType<typeof ExportResourceRenderRecords>;
    Role: ReturnType<typeof ExportRole>;
    Tag: ReturnType<typeof ExportTag>;
    Trade: ReturnType<typeof ExportTrade>;
    User: ReturnType<typeof ExportUser>;
  }
}
