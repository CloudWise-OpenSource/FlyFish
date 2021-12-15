const path = require('path');
const fs = require('async-file');
const uuid = require('uuid');

/**
 * 枚举组件信息对称加密key
 * @type {string}
 */
exports.EnumComponentInfoCryptoKey = "tjsj_vc";


/**
 * 获取发布可视化组件的path
 * @param account_id
 * @return {Promise<*|string>}
 */
exports.getPublicVisualComponentPath = async (account_id) => {
    const publicPath = path.resolve(
      think.config("custom.wwwDirPath"),
      "static/public_visual_component",
      account_id.toString()
    );
    const targetAccess = await fs.access(publicPath).catch(e => e);
    if (think.isError(targetAccess)) {
        await fs.mkdir(publicPath);
    }

    return publicPath;
}

/**
 * 获取处理组件的临时目录
 * @return {Promise<*|string>}
 */
exports.getComponentTempPath = async () => {
    const targetPath = path.resolve(think.ROOT_PATH, "storage/tmp/", uuid.v1());
    const targetAccess = await fs.access(targetPath).catch(e => e);
    if (think.isError(targetAccess)) {
        await fs.mkdir(targetPath);
    }

    return targetPath
}

/**
 * 生成env.component.js文件
 * @param account_id
 * @param data
 * @return {Promise<void>}
 */
exports.mkEnvComponentConf = async (account_id, data) => {
    const ff_domain = think.config('custom.ff_domain').replace(/\/$/g, "");
    const componentWebPath = ff_domain + '/static/public_visual_component/' + account_id;

    const components = data.map(item => ({
        type: item.component_mark,
        name: item.name,
        author: '天机数据',
        description: '',
        thumb: `${componentWebPath}/${item.component_mark}/cover.png`
    }));

    const content = `
if(window.DATAVI_ENV){
    window.DATAVI_ENV.componentsDir = "${componentWebPath}";
    window.DATAVI_ENV.componentsMenuForEditor = [
        {
            name: '常用组件',
            icon: 'changyongzujian',
            components: ${JSON.stringify(components, null, 4)}
        },
        {
            name: '辅助组件',
            icon: 'fuzhuzujian',
            components: []
        }
    ];
}`

    return await fs.writeFile(path.resolve(await exports.getPublicVisualComponentPath(account_id), 'env.component.js'), content);

}
