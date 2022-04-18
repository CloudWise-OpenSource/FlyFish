const Base = require('../base');
module.exports = class extends Base{

    /**
     * 获取大屏配置
     */
    getScreenConfAction() {
        this.allowMethods = 'POST';
    }

    /**
     * 更新大屏
     */
    saveScreenConfAction() {
        this.allowMethods = 'POST';
    }

    /**
     * 上传大屏所需图片
     */
    uploadScreenImgAction(){
        this.allowMethods = 'POST';
    }

    /**
     * 获取模型列表
     */
    getModelListAction() {
        this.allowMethods = 'GET';
    }

    /**
     * 获取模型数据
     */
    getModelDataAction() {
        this.allowMethods = 'POST';
    }

}
