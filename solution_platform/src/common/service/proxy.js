const Client = require('node-client-sdk');
const path = require('path');

/**
 * Created by chencheng on 2017/9/2.
 */
module.exports = class extends think.Service {

    constructor() {
        super();
        this.helperService = think.service('helper');
    }

    /**
     * 反向代理请求
     * @param {Object} ctx
     * @param {String} targetHost    目标主机
     * @param {String} proxyPrefix    代理前缀
     * @returns {Promise.<void>}
     */
    async proxy(ctx, targetHost, proxyPrefix) {
        const url = ctx.url.replace('/' + proxyPrefix, '');

        const client = new Client({
            isEncrypt: false,
            domain: targetHost
        });

        if (ctx.isGet) {

            return await client.get(url);

        } else if (ctx.isPost) {

            if (ctx.is('application/json', 'text/plain')) {

                return await client.postJson(url, ctx.post());

            } else if (ctx.is('application/x-www-form-urlencoded')) {

                return await client.post(url, ctx.post());

            } else if (ctx.is('multipart/form-data')) {
                let params = {};
                const fileKeys = Object.keys(ctx.file());

                //加载file参数
                for(let i = 0; i < fileKeys.length; i++){
                    const fieldName = fileKeys[i];
                    const filePath = ctx.file(fieldName).path;
                    const fileName = ctx.file(fieldName).name;
                    const targetFilePath = path.resolve(path.dirname(filePath), fileName);
                    await this.helperService.move(filePath, targetFilePath);
                    params[fieldName] = targetFilePath;
                }

                //加载post参数
                Object.keys(ctx.post()).map((fieldName) => {
                    params[fieldName] = ctx.post(fieldName);
                });

                return await client.upload(url, params);
            }
        } else if (ctx.method === 'DELETE') {

            return await client.delete(url, ctx.post(), {
                "Content-Type": ctx.headers['content-type']
            });

        } else if (ctx.method === 'PUT') {
            return await client.put(url, ctx.post(), {
                "Content-Type": ctx.headers['content-type']
            });
        }
    }
}
