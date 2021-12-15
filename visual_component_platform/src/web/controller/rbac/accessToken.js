/**
 * Created by chencheng on 2017/8/5.
 */

const Base = require('../base');
module.exports = class extends Base {
    constructor(ctx) {
        super(ctx);
        this.accessTokenService = think.service('rbac/accessToken');
    }

    /**
     * @api {GET} /web/rbac/accessToken/getPageList 获取AccessToken分页列表
     * @apiGroup AccessToken
     * @apiVersion 1.0.0
     * @apiDescription 获取AccessToken分页列表
     *
     * @apiParam (入参) {Number} page 当前分页数
     * @apiParam (入参) {Object} [search={}] 过滤条件:
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
                            access_key_id: 1,
                            access_key_secret: 1,
                            status: "",
                            deleted_at: 1,
                            created_at: 1511335476178,
                            updated_at: 1511335476178
                        }
                    ]
                }
            }
     *  }
     */
    async getPageListAction(){
        const { account_id } = await this.getCacheUserInfo();
        const { page, search } = this.get();
        const result = await this.accessTokenService.getAccessTokenPageList(account_id, page, 15, search);

        if (think.isError(result)) return this.fail(result.message);

        return this.success(result, "success");
    }

    /**
     * @api {POST} /web/rbac/accessToken/add 添加AccessToken
     * @apiGroup AccessToken
     * @apiVersion 1.0.0
     * @apiDescription 添加AccessToken
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
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

        const result = await this.accessTokenService.addAccessToken(account_id);
        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "添加成功");
    }

    /**
     * @api {GET} /web/rbac/accessToken/getDetail 获取单个AccessToken详情
     * @apiGroup AccessToken
     * @apiVersion 1.0.0
     * @apiDescription 获取单个AccessToken详情
     *
     * @apiParam (入参) {String} access_key_id
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {
	 *          name: "",       // AccessToken名称
	 *          config: "",     // 配置
	 *      }
	 *  }
     */
    async getDetailAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { access_key_id } = this.get();
        const result = await this.accessTokenService.getAccessTokenById(access_key_id);

        if (think.isError(result)) return this.fail(result.message);
        if (think.isEmpty(result)) return this.fail("数据不存在");

        return this.success(result, "success");
    }


    /**
     * @api {PUT} /web/rbac/accessToken/updateStatus 更新状态
     * @apiGroup AccessToken
     * @apiVersion 1.0.0
     * @apiDescription 更新状态
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} access_key_id
     * @apiParam (入参) {String} status 状态
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async updateStatusAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { access_key_id, status } = this.post();

        const result = await this.accessTokenService.updateAccessToken(account_id, access_key_id, { status });

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "更新成功");
    }

    /**
     * @api {DELETE} /web/rbac/accessToken/updateStatus 删除AccessToken
     * @apiGroup AccessToken
     * @apiVersion 1.0.0
     * @apiDescription 删除AccessToken
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} access_key_id
     * @apiParam (入参) {String} status 状态
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async deleteAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { access_key_ids } = this.post();

        const result = await this.accessTokenService.delAccessToken(account_id, access_key_ids);

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "删除成功");
    }

}
