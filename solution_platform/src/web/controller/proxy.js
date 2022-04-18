/**
 * Created by chencheng on 17-9-1.
 */
const Base = require('./base');

module.exports = class extends Base {
    async doProxy() {
        const {getProxyConf, returnResult} = this.formatProxy();
        const proxyConf = getProxyConf();
        if (!proxyConf) return this.fail("未找到对应的接口");

        const result = await think.service('proxy').proxy(this.ctx, proxyConf.targetHost, proxyConf.prefix);
        return returnResult(result);
    }

    /**
     * 获取代理配置
     * @return {*}
     */
    formatProxy() {
        const proxyConf = this.config('proxy', undefined, 'web');

        const rules = [
            {
                pattern: /^\/proxyDataHub\/(.*)/i,
                getProxyConf: () => proxyConf['proxyDataHub'],
                returnResult: (result) => {
                    if (think.isError(result)) return this.fail(500, result.message);
                    if (result.code !== 'success') return this.fail(500, result.msg);

                    this.success(result.data);
                }
            },
        ];

        for (let i = 0; i < rules.length; i++) {
            if (this.ctx.path.match(rules[i].pattern)) {
                return {
                    getProxyConf: rules[i].getProxyConf,
                    returnResult: rules[i].returnResult,
                }
            }
        }

        return {};
    }

    /**
     * proxy get
     * @returns {Promise.<void>}
     */
    async getAction() {
        return this.doProxy();
    }

    /**
     * proxy post
     * @returns {Promise.<void>}
     */
    async postAction() {
        return this.doProxy();
    }

    async deleteAction() {
        return this.doProxy();
    }

    async putAction() {
        return this.doProxy();
    }
}
