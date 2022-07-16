// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccessLogger = require('../../../app/middleware/access_logger');
import ExportAuthCheck = require('../../../app/middleware/auth_check');
import ExportErrorHandler = require('../../../app/middleware/error_handler');
import ExportNotfoundHandler = require('../../../app/middleware/notfound_handler');

declare module 'egg' {
  interface IMiddleware {
    accessLogger: typeof ExportAccessLogger;
    authCheck: typeof ExportAuthCheck;
    errorHandler: typeof ExportErrorHandler;
    notfoundHandler: typeof ExportNotfoundHandler;
  }
}
