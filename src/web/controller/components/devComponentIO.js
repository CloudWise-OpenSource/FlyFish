const Base = require('../base');

module.exports = class extends Base{

    constructor(ctx) {
        super(ctx);
        this.helperService = think.service('helper');
        this.devComponentIOService = think.service('components/devComponentIO', think.config("custom.appModules.web"));
    }

    /**
     * @api {POST} /web/visualComponents/devComponentIO/initDevWorkspace 初始化组件开发空间
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 初始化组件开发空间
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "初始化组件开发空间成功"
	 *      "data": {
                "title":"hchart-line",
                "key":"hchart-line",
                "isFile":false,
                "isDir":true,
                "children":[
                    {
                        "title":"build",
                        "key":"hchart-line/build",
                        "isFile":false,
                        "isDir":true,
                        "children":[
                            {
                                "title":"webpack.config.dev.js",
                                "key":"hchart-line/build/webpack.config.dev.js",
                                "isFile":true,
                                "isDir":false,
                                "children":[

                                ]
                            }
                        ]
                    }
                ]
            }
	 *  }
     */
    async initDevWorkspaceAction(){
        const { component_id } = this.post();
        const targetComponentMarkPath = await this.devComponentIOService.initDevWorkspace(component_id);
        if(think.isError(targetComponentMarkPath)) return this.fail(targetComponentMarkPath.message);

        const dirStructure = await this.helperService.readDir(targetComponentMarkPath, ['node_modules', 'package-lock.json', 'env.js', 'editor.html', 'components', 'release', 'release_code', '.gitignore']);
        if(think.isError(dirStructure)) return this.fail(dirStructure.message);

        return this.success(dirStructure, "初始化组件开发空间成功");
    }

    /**
     * @api {GET} /web/visualComponents/devComponentIO/readDevFile 读取开发组件文件内容
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 读取开发组件文件内容
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     * @apiParam (入参) {String} filePath 待获取的文件路径
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "读取文件成功"
	 *      "data": "文件内容"
	 *  }
     */
    async readDevFileAction(){
        const { component_id, filePath } = this.get();
        const content = await this.devComponentIOService.readFile(component_id, filePath);
        if(think.isError(content)) return this.fail(content.message);

        return this.success(content, "读取文件成功");
    }

    /**
     * @api {PUT} /web/visualComponents/devComponentIO/saveDevFileContent 保存开发组件文件内容
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 保存开发组件文件内容
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     * @apiParam (入参) {String} filePath 文件路径
     * @apiParam (入参) {String} fileContent 文件内容
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "保存文件内容成功"
	 *      "data": {}
	 *  }
     */
    async saveDevFileContentAction() {
        const { account_id, user_id } = await this.getCacheUserInfo();
        const { component_id, filePath, fileContent } = this.post();
        const result = await this.devComponentIOService.saveFileContent(
            account_id,
            user_id,
            component_id,
            filePath,
            fileContent
        );
        if(think.isError(result)) return this.fail(result.message);

        return this.success(result, "保存文件成功");
    }

    /**
     * @api {PUT} /web/visualComponents/devComponentIO/saveDevFileContent 编译开发组件
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 编译开发组件
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "编译开发组件成功"
	 *      "data": {}
	 *  }
     */
    async compileDevComponentAction(){
        const { component_id } = this.post();
        const compileRes = await this.devComponentIOService.compileComponent(component_id);
        if(think.isError(compileRes)) return this.fail(compileRes.message);

        return this.success(compileRes, "编译组件成功");
    }

    /**
     * @api {POST} /web/visualComponents/devComponentIO/npmDevComponent npm开发组件
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription npm开发组件
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "npm安装成功"
	 *      "data": {}
	 *  }
     */
    async npmDevComponentAction() {
        const { component_id} = this.post();
        const result = await this.devComponentIOService.npmDevComponent(component_id);
        if(think.isError(result)) return this.fail(result.message);

        return this.success(result, "添加成功");
    }

    /**
     * @api {POST} /web/visualComponents/devComponentIO/addDevFileOrDir 添加开发组件文件或目录
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 添加开发组件文件或目录
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     * @apiParam (入参) {String} filePath 待添加的文件或目录
     * @apiParam (入参) {String} name 文件或目录名称
     * @apiParam (入参) {Number} type 类型
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "添加成功"
	 *      "data": {}
	 *  }
     */
    async addDevFileOrDirAction() {
        const { component_id, filePath, name, type } = this.post();
        const result = await this.devComponentIOService.addFileOrDir(component_id, filePath, name, type);
        if(think.isError(result)) return this.fail(result.message);

        return this.success(result, "添加成功");
    }


    /**
     * @api {PUT} /web/visualComponents/devComponentIO/updateDevFileOrDir 更新开发组件文件或目录
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 更新开发组件文件或目录
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     * @apiParam (入参) {String} filePath 待更新的文件或目录
     * @apiParam (入参) {String} name 文件或目录名称
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "更新成功"
	 *      "data": {}
	 *  }
     */
    async updateDevFileOrDirAction() {
        const { component_id, filePath, name } = this.post();
        const result = await this.devComponentIOService.updateFileOrDir(component_id, filePath, name);
        if(think.isError(result)) return this.fail(result.message);

        return this.success(result, "更新成功");
    }

    /**
     * @api {DELETE} /web/visualComponents/devComponentIO/delDevFileOrDir 删除开发组件文件或目录
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 删除开发组件文件或目录
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     * @apiParam (入参) {String} filePath 待删除的文件或目录
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "删除成功"
	 *      "data": {}
	 *  }
     */
    async delDevFileOrDirAction() {
        const { component_id, filePath } = this.post();
        const result = await this.devComponentIOService.delFileOrDir(component_id, filePath);
        if(think.isError(result)) return this.fail(result.message);

        return this.success(result, "删除成功");
    }

    /**
     * @api {POST} /web/visualComponents/devComponentIO/uploadFile 上传文件
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 上传文件
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     * @apiParam (入参) {String} filePath 上传的目标目录
     * @apiParam (入参) {Array} uploadFileList 上传的目标目录
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "上传成功"
	 *      "data": {}
	 *  }
     */
    async uploadFileAction() {
        const uploadFileList = this.file('uploadFileList');
        const {filePath, component_id} = this.post();

        const result = await this.devComponentIOService.uploadFile(component_id, filePath, uploadFileList);
        if(think.isError(result)) return this.fail(result.message);

        return this.success({}, "上传成功");
    }
}
