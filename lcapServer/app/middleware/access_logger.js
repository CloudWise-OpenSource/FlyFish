'use strict';

const { Logger, FileTransport, ConsoleTransport } = require('egg-logger');
const logger = new Logger(); // 声明一个新的日志记录器
// 配置文件输出/存储
logger.set('file', new FileTransport({
  file: 'logs/FlyFish/access.log',
  level: 'INFO',
}));
// 配置控制台输出
logger.set('console', new ConsoleTransport({
  level: 'DEBUG',
}));
/**
  * 请求响应日志
  * header信息获取 参见 https://eggjs.org/zh-cn/basics/controller.html#header
  * 自定义日志器 参见https://github.com/eggjs/egg-logger#usage
  * @return {Function} 日志中间件
  */
module.exports = () => {
  return async function accessLogger(ctx, next) {
    // const TIME_FORMAT = 'yyyy-MM-dd hh:mm:ss S';
    const { request, response } = ctx;
    const startedAt = process.hrtime(); // 获取高精度时间
    const log = { // 日志信息
      // uuid: ctx.get(), // 全链路唯一标记
      remoteIP: getIP(request), // 客户端IP
      originalUrl: request.originalUrl, // 请求地址
      // appKey: '', // 当前应用的标记
      req: {
        method: request.method,
        header: {
          'Content-Type': ctx.get('Content-Type'),
        },
        query: request.query,
        body: request.body,
        requestAt: DateForm(),
      },
      res: {},
    };
    await next();
    log.res = {
      status: response.status,
      responseTime: calcResponseTime(startedAt),
      responseAt: DateForm(),
    };

    // —————— TODO - 自定义日志输出格式 ————————
    logger.info('[' + DateForm() + '] [INFO] access - ' + JSON.stringify(log));
  };
};


/**
  * 获取实际IP信息
  * @param {object} req 请求参数
  * @return {string} 格式化IP
  */
function getIP(req) {
  let ip = req.get('x-forwarded-for'); // 获取代理前的ip地址
  if (ip && ip.split(',').length > 0) {
    ip = ip.split(',')[ 0 ];
  } else {
    ip = req.ip;
  }
  const ipArr = ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
  return ipArr && ipArr.length > 0 ? ipArr[ 0 ] : '127.0.0.1';
}

/**
  * 时间格式化函数
  * @param {Date} date 时间
  * @param {string} format 格式化
  * @return {*} 格式化后时间
  */
function DateForm(date = new Date(), format = 'yyyy-MM-dd hh:mm:ss S') {
  const o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'w+': date.getDay(), // week
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    S: date.getMilliseconds(), // millisecond
  };
  if (/(y+)/.test(format)) { // year
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1
        , RegExp.$1.length === 1 ? o[ k ] : ('00' + o[ k ]).substr(('' + o[ k ]).length));
    }
  }
  return format;
}

/**
  * 计算响应时间
  * @param {Array} startedAt 请求时间
  * @return {string} 响应时间字符串
  */
function calcResponseTime(startedAt) {
  const diff = process.hrtime(startedAt);
  // 秒和纳秒换算为毫秒,并保留3位小数
  return `${(diff[ 0 ] * 1e3 + diff[ 1 ] * 1e-6).toFixed(3)}ms`;
}

