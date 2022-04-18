/**
 * Created by chencheng on 2017/8/5.
 */

const Base = require('../base');

module.exports = class extends Base {
    constructor(ctx) {
        super(ctx);
        this.permissionService = think.service('rbac/permission');
    }

    /**
     * @api {GET} /web/rbac/permission/getMenuPermission 获取菜单权限
     * @apiGroup RBACPermission
     * @apiVersion 1.0.0
     * @apiDescription 获取菜单权限
     *
     * @apiParam (入参) {Number} subject_type 权限主体类型
     * @apiParam (入参) {Number} subject_id 权限主体ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
     *  }
     */
    async getMenuPermissionAction(){
        const { account_id } = await this.getCacheUserInfo();
        const { subject_type, subject_id } = this.get();

        const result = await this.permissionService.getMenuPermissionById(account_id, subject_id, subject_type);

        if (think.isError(result)) return this.fail(result.message);
        if (!think.isEmpty(result)) result.permission = JSON.parse(result.permission);

        this.success(result, "success");
    }

    /**
     * @api {PUT} /web/rbac/permission/disposeMenuPermission 处理菜单权限
     * @apiGroup RBACPermission
     * @apiVersion 1.0.0
     * @apiDescription 处理菜单权限
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} subject_type 权限主体类型
     * @apiParam (入参) {Number} subject_id 权限主体ID
     * @apiParam (入参) {Array} permission 菜单权限
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
     *  }
     */
    async disposeMenuPermissionAction(){
        const { account_id } = await this.getCacheUserInfo();
        const { subject_type, subject_id, permission } = this.post();

        const result = await this.permissionService.addOrUpdateMenuPermission(account_id, subject_id, subject_type, permission);

        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "更新成功");
    }

}
