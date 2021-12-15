const path = require('path');
const uuid = require('uuid');

/**
 * 枚举大屏web资源的路径
 * @type {{cover: *|string, fragment: *|string, webFragment: string}}
 */
exports.EnumWebResourcePath = {
    cover: path.resolve(think.config("custom.wwwDirPath"), 'upload/screen/cover'),        // 大屏封面路径
    logo: path.resolve(think.config("custom.wwwDirPath"), 'upload/screen/logo'),         // logo路径
    fragment: path.resolve(think.config("custom.wwwDirPath"), 'upload/screen/fragment'),  // 大屏碎片路径
    webFragment: 'upload/screen/fragment',         // web碎片的访问路径
    screenBuildPath: "build/screen",
    screenSourcePath: "download/screen_source",
    screenSourceTemplatePath: "download/screen_source_template",
}

/**
 * 获取初始的大屏配置
 * @param name 大屏名称
 * @return {{options: {name: *}}}
 */
exports.getInitScreenOptionsConf = (name) => ({
    options: { name }
});


/**
 * 生成大屏ID
 * @return {*}
 */
exports.mkScreenId = () => uuid.v1();
