/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-04 10:27:43
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-07-12 17:19:13
 */
const path = require('path');
const isDev = think.env === 'development';
module.exports = [
    //错误信息处理
    {
        handle: 'trace',
        enable: !think.isCli,       //是否开启该中间件
        options: {
            sourceMap: true,
            debug: isDev,
            error: (err, ctx) => {
                console.error(err);
                return ctx.fail(err.message);
            },
            contentType:(ctx) => {
                // All request url starts of /api or request header contains `X-Requested-With: XMLHttpRequest` will output json error
                const AJAXRequest = ctx.is('X-Requested-With', 'XMLHttpRequest');
                return AJAXRequest ? 'json' : 'html';
            }
        }
    },

    // cors 配置
    {
        handle: 'cors',
        options:{
            origin:function(ctx){
            //   if (ctx.url.startsWith('/static/uploadScenes/')) {
            //       return "*"; // 允许场景访问
            //   }

              return "*"; // 允许场景访问
            //   return 'http://localhost:8183';
            },   // 允许跨域的域名
            credentials:true,                   // 允许携带跨域的cookie
            expose : ['Content-Disposition'],   // 允许暴露给前端的header, Content-Disposition用于获取文件名称
        },
    },


    {
        handle: 'meta',
        options: {
            logRequest: isDev,
            sendResponseTime: isDev,
            sendPowerBy: false,             // 是否发送框架版本号
            requestTimeout: 30 * 1000,      // 请求超时时间，单位是"秒"
        }
    },

    //配置静态资源
    {
        handle: 'resource',
        enable: true,              //是否开启该中间件
        options: {
            root: think.config("custom.wwwDirPath"),
            publicPath: /^\/(static|webApiDoc|upload)/
        }
    },

    //解析post参数
    {
        handle: 'payload',
        options: {
            multipart: {
                multiples: true,
                keepExtensions: true,  //是否保持上传文件的扩展
                uploadDir:path.join(think.ROOT_PATH, 'storage/tmp/upload/'),
                extendTypes:{
                    json:['text/plain']
                }
            },
            limit: "8mb",          //限定post数据的大小
            encoding: "utf-8",     //数据编码
        }
    },

    //路由操作
    {
        handle: 'router',
        options: {
            defaultModule:'web',                // 默认模块
            defaultController: 'view/index',    // 默认控制器
            defaultAction: 'platform',          // 默认action
        }
    },


    //业务逻辑,数据验证
    'logic',

    //业务逻辑
    'controller',
];
