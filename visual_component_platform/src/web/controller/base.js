const EnumLoginUserInfo = require('../../common/constants/EnumCookie').EnumLoginUserInfo;
const EnumErrorCode = require('../../common/constants/EnumError').EnumErrorCode;
const _ = require('lodash');
const path = require('path');

module.exports = class extends think.Controller {
    constructor(ctx) {
        super(ctx);
        this.cacheService = think.service('cache');
        this.modelUserRoleIns = think.model('userRole');
		this.modelUserRoleRelationIns = think.model('userRoleRelation');
    }

    __before() {
        // 不在白名单中的路由检查是否登录
        if (think.config('noCheckIsLoginRoutes', undefined, 'web').indexOf(this.ctx.path) === -1 ){
            if (!this.checkIsLogin()) return this.fail(EnumErrorCode.NOT_LOGIN, "请先登录", {});
        }
    }

    __after() {

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
        const userRoleRelationInfo = await this.modelUserRoleRelationIns.where({user_id: 3 }).field('role_id').select();
        const roleIds = userRoleRelationInfo.filter(relation => relation.role_id).map(relation => relation.role_id);
        let userRoleNames = []

        if (roleIds.length > 0) {
            const userRolesInfo = await this.modelUserRoleIns.where({role_id: ['IN', roleIds] }).field('role_id,role_name').select();
            userRoleNames = (userRolesInfo || []).map(userRoles => userRoles.role_name);
        }

        userInfo.roleNames = userRoleNames || [];
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
        if (!this.cacheUserInfo){
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
     * 下载文件
     * @param {String} filepath 文件路径
     */
    download(filepath){
        this.ctx.download(filepath);
    }

};
