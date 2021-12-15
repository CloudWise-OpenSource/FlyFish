/**
 * Created by chencheng on 2017/8/5.
 */

const Base = require('../base');
const EnumUserStatus = require('../../../common/constants/app/rbac/user').EnumUserStatus;
const EnumLoginUserInfo = require('../../../common/constants/EnumCookie').EnumLoginUserInfo;
const mkLoginUserCacheKey = require('../../../common/constants/EnumCache').mkWebLoginUserCacheKey;
const mkUserPassword = require('../../../common/constants/app/rbac/user').mkUserPassword;
module.exports = class extends Base {
    constructor(ctx) {
        super(ctx);
        this.userService = think.service('rbac/user');
        this.cacheService = think.service('cache');
        this.helperService = think.service('helper');
        this.authService = think.service('rbac/auth');
    }

    /**
     * @api {POST} /web/rbac/user/login 用户登录
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiDescription 用户登录
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {String} user_email 邮箱
     * @apiParam (入参) {String} user_password 密码
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async loginAction() {
        const {user_email, user_password} = this.post();
        const userInfo = await this.userService.isAllowLogin(user_email, user_password);

        if (think.isError(userInfo)) {
            return this.fail(userInfo.message);
        } else if (this.helperService.lodash.isEmpty(userInfo)) {
            return this.fail("邮箱或密码不正确");
        }

        const cacheKey = mkLoginUserCacheKey(userInfo.account_id, userInfo.user_id);
        // 设置用户信息缓存
        const result = await this.setCacheUserInfo(cacheKey, userInfo);

        if(think.isError(result)) return this.fail("登录失败");

        const loginInfo = await this.authService.getUserLoginInfo(userInfo);
        this.success(loginInfo, "登录成功");
    }


    /**
     * @api {GET} /web/rbac/user/logout 用户退出登录
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiDescription 用户退出登录
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "退出成功"
	 *      "data": {}
	 *  }
     */
    async logoutAction() {
        // 删除用户缓存信息
        await this.cacheService.del(this.cookie(EnumLoginUserInfo.key)).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });

        // 发送用户信息缓存cookie
        this.cookie(EnumLoginUserInfo.key, 'no', {
            maxAge: -1
        });

        this.success({}, "退出成功");
    }

     /**
     * @api {GET} /web/rbac/user/delete 禁用用户
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiDescription 禁用用户
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "禁用成功"
	 *      "data": {}
	 *  }
     */
      async deleteAction() {
        const { user_id } = this.post();
        await this.userService.disableUser(user_id);
        return this.success({}, "禁用成功");
    }
    
    /**
     * @api {GET} /web/rbac/user/getPageList 获取用户分页列表
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiDescription 获取用户分页列表
     *
     * @apiParam (入参) {String} user_status 用户状态
     * @apiParam (入参) {Number} page 当前分页数
     * @apiParam (入参) {Object} [search={}] 过滤条件:
     * @apiParam (入参) {String} [search.user_name] 过滤名称
     * @apiParam (入参) {String} [search.user_email] 过滤email
     * @apiParam (入参) {String} [search.user_phone] 过滤手机号
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {
                    "count": 3,
                    "totalPages": 3,
                    "pagesize": 1,
                    "currentPage": 1,
                    "data": [
                        {
                            "user_id": 1,
                            "account_id": 1,
                            "user_email": "",
                            "user_name": "",
                            "user_phone": "",
                            "user_status": 1,
                            "deleted_at": 1,
                            "created_at": 1511335476178,
                            "updated_at": 1511335476178
                        }
                    ]
                }
            }
     *  }
     */
    async getPageListAction(){
        const { account_id } = await this.getCacheUserInfo();
        const { user_status, page, search } = this.get();
        const result = await this.userService.getUserPageList(account_id, EnumUserStatus.normal, page, 15, search);

        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "success");
    }

    /**
     * @api {GET} /web/rbac/user/getAll 获取所有用户列表
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiDescription 获取所有用户列表
     *
     * @apiParam (入参) {String} user_status 用户状态
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": [
                {
                    "user_id": 1,
                    "account_id": 1,
                    "user_email": "",
                    "user_name": "",
                    "user_phone": "",
                    "user_status": 1,
                    "deleted_at": 1,
                    "created_at": 1511335476178,
                    "updated_at": 1511335476178
                }
            ]
     *  }
     */
    async getAllAction(){
        const { account_id } = await this.getCacheUserInfo();
        const result = await this.userService.getAllUser(account_id);

        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "success");
    }

    /**
     * @api {POST} /web/rbac/user/add 添加用户
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiDescription 添加用户
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {String} user_name 用户名称
     * @apiParam (入参) {String} user_email 邮箱
     * @apiParam (入参) {String} user_phone 手机号
     * @apiParam (入参) {String} user_password 密码
     * @apiParam (入参) {String} user_status 用户状态
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async addAction() {
        const { account_id } = await this.getCacheUserInfo();
        let { user_name, user_email, user_phone, user_password, user_status } = this.post();
        if (await this.userService.isExist(account_id, {user_email})) return this.fail("邮箱已存在");
        if (await this.userService.isExist(account_id, {user_phone})) return this.fail("手机号已存在");

        const result = await this.userService.addUser(account_id, {user_name, user_email, user_phone, user_password, user_status});
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "添加成功");
    }

    /**
     * @api {GET} /web/rbac/user/getDetail 获取单个用户详情
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiDescription 获取单个用户详情
     *
     * @apiParam (入参) {String} user_id 用户ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {
	 *          name: "",       // 用户名称
	 *          config: "",     // 配置
	 *      }
	 *  }
     */
    async getDetailAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { user_id } = this.get();
        const result = await this.userService.getUserById(account_id, user_id);

        if (think.isError(result)) return this.fail(result.message);
        if (think.isEmpty(result)) return this.fail("数据不存在");

        this.success(result, "success");
    }

    /**
     * @api {PUT} /web/rbac/user/update 更新用户
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiDescription 更新用户
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} user_id 用户ID
     * @apiParam (入参) {String} user_name 用户名称
     * @apiParam (入参) {String} user_email 邮箱
     * @apiParam (入参) {String} user_phone 手机号
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async updateAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { user_id, user_name, user_email, user_phone, user_status } = this.post();
        if (await this.userService.isExist(account_id, {user_email}, user_id)) return this.fail("邮箱已存在");
        if (await this.userService.isExist(account_id, {user_phone}, user_id)) return this.fail("手机号已存在");

        const result = await this.userService.updateUser(account_id, user_id, { user_name, user_email, user_phone, user_status});

        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "更新成功");
    }

    /**
     * @api {PUT} /web/rbac/user/update 重置用户密码
     * @apiGroup User
     * @apiVersion 1.0.0
     * @apiDescription 重置用户密码
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {String} user_id  用户ID
     * @apiParam (入参) {String} old_password 老密码
     * @apiParam (入参) {String} new_password 新密码
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async resetPasswordAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { user_id, old_password, new_password } = this.post();
        if (!await this.userService.isExist(account_id, {user_id, user_password: mkUserPassword(old_password)})) return this.fail("老密码不正确");

        const result = await this.userService.updateUser(account_id, user_id, { user_password: mkUserPassword(new_password) });

        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "更新成功");
    }

}
