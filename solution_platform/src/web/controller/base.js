const EnumLoginUserInfo = require('../../common/constants/EnumCookie').EnumLoginUserInfo;
const EnumErrorCode = require('../../common/constants/EnumError').EnumErrorCode;
const EnumOperateLogTpl = require('../../common/constants/app/system/operateLog').EnumOperateLogTpl;
const _ = require('lodash');

module.exports = class extends think.Controller {
    constructor(ctx) {
        super(ctx);
        this.cacheService = think.service('cache');
        this.cacheUserInfo = null;
    }

    async __before() {
        const ctxHeaderAuthorizationToken = (this.ctx.headers.authorization || '').replace('Bearer ', '');
        const authToken = Object.values(think.config('authToken', undefined, 'web') || {});
        const noCheckIsLoginRoutes = think.config('noCheckIsLoginRoutes', undefined, 'web');
        const defaultAccountId = think.config('defaultAccountId', undefined, 'web');
        const withToken = authToken.includes(ctxHeaderAuthorizationToken);
        const isSkipLogin = withToken || noCheckIsLoginRoutes.indexOf(this.ctx.path) !== -1

        if (withToken) {
            this.cacheUserInfo = {
                account_id: defaultAccountId
            }
        }

        // 不在白名单中的路由检查是否登录
        if (!isSkipLogin) {
            if (!this.checkIsLogin()) return this.fail(EnumErrorCode.NOT_LOGIN, "请先登录", {});
        }
    }

    async __after() {
        // 记录操作日志
        await this.recordOperateLog();
    }

    __call() {

    }

    /**
     * 检查是否登录
     * @returns {boolean}
     */
    checkIsLogin() {
        const loginUserInfoKey = this.cookie(EnumLoginUserInfo.key);

        return loginUserInfoKey ? true : false;
    }

    /**
     * 设置用户登录信息
     * @param cacheKey
     * @param userInfo
     * @return {Promise<*|boolean>}
     */
    async setCacheUserInfo(cacheKey, userInfo) {
        const setCacheRes = await this.cacheService.set(cacheKey, userInfo, EnumLoginUserInfo.expire).catch(err => {
            think.logger.error("设置用户登录信息失败:");
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });

        if (think.isError(setCacheRes)) return setCacheRes;

        // 发送用户信息缓存cookie
        this.cookie(EnumLoginUserInfo.key, cacheKey, {
            maxAge: EnumLoginUserInfo.expire
        });

        return true;
    }

    /**
     * 获取缓存用户数据
     * @returns {Promise<any>}
     */
    async getCacheUserInfo() {
        const loginUserInfoKey = this.cookie(EnumLoginUserInfo.key);
        if (!this.cacheUserInfo) {
            this.cacheUserInfo = await this.cacheService.get(loginUserInfoKey).catch(err => {
                think.logger.error("获取用户登录信息失败:");
                think.logger.error(err);
                return think.isError(err) ? err : new Error(err)
            });

            await this.setCacheUserInfo(loginUserInfoKey, this.cacheUserInfo)
        }

        return this.cacheUserInfo;
    }

    /**
     * 记录操作日志
     * @return {Promise<void>}
     */
    async recordOperateLog() {
        for (let i = 0; i < EnumOperateLogTpl.length; i++) {
            let item = EnumOperateLogTpl[i];

            if (this.ctx.path == item.path && this.cacheUserInfo) {
                const { account_id, user_id } = this.cacheUserInfo;
                await think.service('userOperateLog').addLog(account_id, user_id, item.log_type, item.getContent(this.ctx));
                break;
            }
        }
    }
    /**
     * 下载文件
     * @param {String} filepath 文件路径
     */
    download(filepath) {
        this.ctx.download(filepath);
    }
};
