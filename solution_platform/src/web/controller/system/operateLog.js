/**
 * Created by chencheng on 2017/8/5.
 */

const Base = require('../base');

module.exports = class extends Base {
    constructor(ctx) {
        super(ctx);
        this.operateLogService = think.service('userOperateLog');
    }

    /**
     * @api {GET} /web/system/operateLog/getPageList 获取操作日志分页列表
     * @apiGroup SystemOperateLog
     * @apiVersion 1.0.0
     * @apiDescription 获取操作日志分页列表
     *
     * @apiParam (入参) {Number} page 当前分页数
     * @apiParam (入参) {Object} [search={}] 过滤条件
     * @apiParam (入参) {Number} [search.log_type] 日志类型
     * @apiParam (入参) {Number} [search.user_id] 操作用户ID
     * @apiParam (入参) {String} [search.keyword] 关键字
     * @apiParam (入参) {String} [search.startTime] 开始时间
     * @apiParam (入参) {String} [search.endTime] 结束时间
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
                            "operate_log_id": 1,
                            "account_id": 1,
                            "log_type": "",
                            "user_id": 1,
                            "content": ,""
                            "created_at": 1511335476178,
                        }
                    ]
                }
            }
     *  }
     */
    async getPageListAction(){
        const { account_id } = await this.getCacheUserInfo();
        const { page, search } = this.get();
        const result = await this.operateLogService.getLogPageList(account_id, page, 15, search);

        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "success");
    }



}
