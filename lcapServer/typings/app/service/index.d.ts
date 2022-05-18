// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportApplication = require('../../../app/service/application');
import ExportApplicationOpensource = require('../../../app/service/application_opensource');
import ExportComponent = require('../../../app/service/component');
import ExportComponentOpensource = require('../../../app/service/component_opensource');
import ExportMenu = require('../../../app/service/menu');
import ExportProject = require('../../../app/service/project');
import ExportRole = require('../../../app/service/role');
import ExportTag = require('../../../app/service/tag');
import ExportTrade = require('../../../app/service/trade');
import ExportUser = require('../../../app/service/user');
import ExportUserDouc = require('../../../app/service/user_douc');
import ExportUserYapi = require('../../../app/service/user_yapi');

declare module 'egg' {
  interface IService {
    application: AutoInstanceType<typeof ExportApplication>;
    applicationOpensource: AutoInstanceType<typeof ExportApplicationOpensource>;
    component: AutoInstanceType<typeof ExportComponent>;
    componentOpensource: AutoInstanceType<typeof ExportComponentOpensource>;
    menu: AutoInstanceType<typeof ExportMenu>;
    project: AutoInstanceType<typeof ExportProject>;
    role: AutoInstanceType<typeof ExportRole>;
    tag: AutoInstanceType<typeof ExportTag>;
    trade: AutoInstanceType<typeof ExportTrade>;
    user: AutoInstanceType<typeof ExportUser>;
    userDouc: AutoInstanceType<typeof ExportUserDouc>;
    userYapi: AutoInstanceType<typeof ExportUserYapi>;
  }
}
