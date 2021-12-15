/**
 * @description 大屏配置
 */

window.DATAVI_ENV = (function() {
    return {
        debug: true,
        //图片地址
        uploadImgDir:`./`,
        componentsDir: `./components`,
        apiSuccessCode: 200,
        componentApiDomain: '',

        screenAPI: {    // 大屏展示和编辑用到的API
            getScreenData: '/web/visualScreen/screenEditor/getScreenConf',            // 获取大屏数据
            saveScreenConf: '/web/visualScreen/screenEditor/saveScreenConf',          // 保存大屏配置
            uploadScreenImg: '/web/visualScreen/screenEditor/uploadScreenImg',        // 上传大屏所需图片

            getModelList: '/web/visualScreen/screenEditor/getModelList',             // 获取模型列表
            getModelData: '/web/visualScreen/screenEditor/getModelData',             // 获取模型数据
        },

        // 大屏编辑器组件菜单枚举
        componentsMenuForEditor: [
            
        ]
    }
})();

