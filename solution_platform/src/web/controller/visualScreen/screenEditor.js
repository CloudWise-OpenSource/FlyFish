const Base = require('../base');
module.exports = class extends Base{

    constructor(ctx) {
        super(ctx);
        this.screenService = think.service('visualScreen/screen', think.config("custom.appModules.web"));
        this.requestApiService = think.service('requestApi', think.config("custom.appModules.web"));
    }

    /**
     * 验证是否有操作大屏的权限
     * @param account_id
     * @param user_id
     * @param screen_id
     * @return {Promise<{isEdit: boolean, failMsg: string}>}
     */
    async checkIsEditScreen(account_id, user_id, screen_id){
        const screen = await this.screenService.getScreenById(account_id, screen_id, 'developing_user_id');
        const isEdit = !think.isEmpty(screen.developing_user_id) ? screen.developing_user_id == user_id : true;
        let failMsg = "";
        if (!isEdit){
            const userService = think.service('rbac/user');
            const userInfo = await userService.getUserById(account_id, screen.developing_user_id, ['user_email']);
            failMsg = `用户：${userInfo.user_email}正在操作该大屏，您暂时不能操作！`;
        }

        return {
            isEdit,
            failMsg
        }
    }

    /**
     * @api {POST} /web/visualScreen/screenEditor/getScreenConf 获取大屏配置
     * @apiGroup VScreenEditor
     * @apiVersion 1.0.0
     * @apiDescription 获取大屏配置

     * @apiHeader (请求头部) {String} Content-Type application/json
     *
     * @apiParam (入参) {String} id 大屏ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "success"
	 *      "data": {
	 *          name: "",       // 大屏分类名称
	 *          config: "",     // 配置
	 *      }
	 *  }
     */
    async getScreenConfAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { id } = this.post();
        const result = await this.screenService.getScreenById(account_id, id);

        if (think.isError(result)) return this.fail(result.message);
        if (think.isEmpty(result)) return this.fail("数据不存在");

        this.success(result.options_conf ? JSON.parse(result.options_conf) : result.options_conf, "success");
    }


    /**
     * @api {POST} /web/visualScreen/screenEditor/saveScreenConf 保存大屏配置
     * @apiGroup VScreenEditor
     * @apiVersion 1.0.0
     * @apiDescription 保存大屏配置
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     *
     * @apiParam (入参) {Number} id 大屏ID
     * @apiParam (入参) {String} config 大屏配置
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "保存大屏配置成功"
	 *      "data": {}
	 *  }
     */
    async saveScreenConfAction() {
        const { account_id, user_id } = await this.getCacheUserInfo();
        const { id, config } = this.post();

        // 检测是否有权限操作大屏
        const {isEdit, failMsg} = await this.checkIsEditScreen(account_id, user_id, id);
        if (!isEdit) return this.fail(failMsg);

        const result = await this.screenService.saveScreenOptionsConf(account_id, user_id, id, config);
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "保存成功");
    }

    /**
     * @api {POST} /web/visualScreen/screenEditor/uploadScreenImg 上传大屏所需图片
     * @apiGroup VScreenEditor
     * @apiVersion 1.0.0
     * @apiDescription 上传大屏所需图片
     *
     * @apiHeader (请求头部) {String} Content-Type multipart/form-data
     *
     * @apiParam (入参) {String} screen_id 大屏ID
     * @apiParam (入参) {Object} file 文件
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "上传成功"
	 *      "data": {}
	 *  }
     */
    async uploadScreenImgAction(){
        const { account_id,user_id } = await this.getCacheUserInfo();
        const file = this.file('file');
        const {screen_id} = this.post();

        // 检测是否有权限操作大屏
        const {isEdit, failMsg} = await this.checkIsEditScreen(account_id, user_id, screen_id);
        if (!isEdit) return this.fail(failMsg);

        const imgPath = await this.screenService.saveUploadImg(account_id, screen_id, file.path);

        this.success(imgPath, "上传成功");
    }

    /**
     * @api {POST} /web/visualScreen/screenEditor/deleteUploadScreenImg 删除上传大屏所需图片
     * @apiGroup VScreenEditor
     * @apiVersion 1.0.0
     * @apiDescription 删除上传大屏所需图片
     *
     * @apiHeader (请求头部) {String} Content-Type multipart/form-data
     *
     * @apiParam (入参) {String} screen_id 大屏ID
     * @apiParam (入参) {String} imgName 图片名称
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "删除成功"
	 *      "data": null
	 *  }
     */
    async deleteUploadScreenImgAction(){
        const { account_id,user_id } = await this.getCacheUserInfo();
        const { screen_id, imgName } = this.post();

        // 检测是否有权限操作大屏
        const {isEdit, failMsg} = await this.checkIsEditScreen(account_id, user_id, screen_id);
        if (!isEdit) return this.fail(failMsg);

        const result =await this.screenService.deleteUploadImg(account_id, screen_id, imgName);
        if (think.isError(result)) return this.fail("删除失败");

        this.success(null, "删除成功");
    }

    /**
     * @api {GET} /web/visualScreen/screenEditor/getModelList 获取模型列表
     * @apiGroup VScreenEditor
     * @apiVersion 1.0.0
     * @apiDescription 获取模型列表
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "获取成功"
	 *      "data": {}
	 *  }
     */
    async getModelListAction(){
        const result = await this.requestApiService.getModelList();
        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "success");
    }

    /**
     * @api {POST} /web/visualScreen/screenEditor/getModelData 获取模型数据
     * @apiGroup VScreenEditor
     * @apiVersion 1.0.0
     * @apiDescription 获取模型数据
     *
     * @apiHeader (请求头部) {String} Content-Type multipart/form-data
     *
     * @apiParam (入参) {String} id 模型ID
     * @apiParam (入参) {Object} vars 模型用到的变量
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "获取成功"
	 *      "data": {}
	 *  }
     */
    async getModelDataAction() {
        const { id, vars } = this.post();

        const result = await this.requestApiService.queryModelData({ id, vars });
        if (think.isError(result)) return this.fail(result.message);

        this.success({data: result}, "success");
    }

}
