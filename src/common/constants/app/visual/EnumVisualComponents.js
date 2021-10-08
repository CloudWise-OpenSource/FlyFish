const path = require('path');
const fs = require('async-file');
const uuid = require('uuid');

/**
 * 枚举组件信息对称加密key
 * @type {string}
 */
exports.EnumComponentInfoCryptoKey = "tjsj_vc";

/**
 * 枚举可视化组件类型
 * @type {{all: number}}
 */
 exports.EnumComponentsCategoriesType = {
    all: 0, // 全部类型
  };
  
  /**
   * 枚举组件代码类型
   * @type {{file: number, dir: number}}
   */
  exports.EnumComponentCodeType = {
    file: 1,
    dir: 2,
  };
  
  /**
   * 组件类型
   * @type {{all: number, system: number, custom: number}}
   */
  exports.EnumComponentType = {
    all: 0, // 全部类型
    system: 1, // 系统组件
    custom: 2, // 个性组件
  };
  
  /**
   * 组件开发状态
   * @type {{no: number, yes: number}}
   */
  exports.EnumComponentDevStatus = {
    no: 0, // 未开发
    yes: 1, // 开发中
  };
  
  /**
   * 组件发布状态
   * @type {{no: number, yes: number}}
   */
  exports.EnumComponentPublishStatus = {
    no: 0, // 未发布
    yes: 1, // 已发布
  };

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


/**
 * 枚举组件信息对称加密key
 * @type {string}
 */
 exports.EnumComponentInfoCryptoKey = "tjsj_vc";

 /**
  * 枚举可视化组件类型
  * @type {{all: number}}
  */
 exports.EnumComponentsCategoriesType = {
   all: 0, // 全部类型
 };
 
 /**
  * 枚举组件代码类型
  * @type {{file: number, dir: number}}
  */
 exports.EnumComponentCodeType = {
   file: 1,
   dir: 2,
 };
 
 /**
  * 组件类型
  * @type {{all: number, system: number, custom: number}}
  */
 exports.EnumComponentType = {
   all: 0, // 全部类型
   system: 1, // 系统组件
   custom: 2, // 个性组件
 };
 
 /**
  * 组件开发状态
  * @type {{no: number, yes: number}}
  */
 exports.EnumComponentDevStatus = {
   no: 0, // 未开发
   yes: 1, // 开发中
 };
 
 /**
  * 组件发布状态
  * @type {{no: number, yes: number}}
  */
 exports.EnumComponentPublishStatus = {
   no: 0, // 未发布
   yes: 1, // 已发布
 };
 
 /**
  * 组件开发IO操作
  * @type {{web, source, target}}
  */
 exports.EnumComponentIOPath = (() => {
   const webCommonPath = "/static/dev_visual_component"; // 公共web path
   const webDevWorkspacePath = webCommonPath + "/dev_workspace"; // 组件开发的web path
 
   const devComponentTpl = path.resolve(
     think.ROOT_PATH,
     "template/visual_component/dev_component_tpl"
   );
   const releaseCodeBase = path.resolve(
     think.ROOT_PATH,
     "template/visual_component/release_code"
   );
   const publicDir = path.resolve(
     think.ROOT_PATH,
     "template/visual_component/dev_component_tpl/public"
   );
 
   // ---------------------- 源路径 ----------------------
   const editorHtmlTpl = (org_mark, component_mark) =>
     require(path.resolve(devComponentTpl, "editor.html.js"))(
       webCommonPath,
       webDevWorkspacePath,
       org_mark,
       component_mark
     );
   const envTpl = (org_mark, component_mark) =>
     require(path.resolve(devComponentTpl, "env.js"))(
       webDevWorkspacePath,
       org_mark,
       component_mark
     );
 
   const optionsJsonTpl = (component_mark) =>
     require(path.resolve(devComponentTpl, "options.json.js"))(component_mark);
   const packageJsonTpl = (component_mark) =>
     require(path.resolve(devComponentTpl, "package.json.js"))(component_mark);
   const webpackConfDevTpl = require(path.resolve(
     devComponentTpl,
     "build/webpack.config.dev.js"
   ));
   const webpackConfProductionTpl = require(path.resolve(
     devComponentTpl,
     "build/webpack.config.production.js"
   ));
   // src下文件
   const srcMainJsTpl = (component_mark) =>
     require(path.resolve(devComponentTpl, "src/mainJs.js"))(component_mark);
   const srcComponentJsTpl = (component_mark) =>
     require(path.resolve(devComponentTpl, "src/ComponentJs.js"))(
       component_mark
     );
   const srcComponentJsTplForHt = (component_mark,sceneInfo) =>
     require(path.resolve(devComponentTpl, "src/ComponentJsForHt.js"))(
       component_mark,sceneInfo
   );
   const srcSettingJsTpl = (component_mark) =>
     require(path.resolve(devComponentTpl, "src/setting.js"))(component_mark);
   const srcSettingsOptionsJsTpl = (component_mark) =>
     require(path.resolve(devComponentTpl, "src/options.js"))(component_mark);
   const srcSettingsDataJsTpl = (component_mark) =>
     require(path.resolve(devComponentTpl, "src/data.js"))(component_mark);
 
   return {
     web: {
       commonPath: webCommonPath,
       devWorkspacePath: webDevWorkspacePath,
     },
 
     // 源路径
     source: {
       editorHtmlTpl,
       envTpl,
       optionsJsonTpl,
       packageJsonTpl,
       webpackConfDevTpl,
       webpackConfProductionTpl,
       releaseCodeBase,
       releaseComponentMarkCodePath: (org_mark, component_mark) =>
         path.resolve(releaseCodeBase, org_mark, component_mark),
       //src
       srcMainJsTpl,
       srcComponentJsTpl,
       srcComponentJsTplForHt,
       srcSettingJsTpl,
       srcSettingsOptionsJsTpl,
       srcSettingsDataJsTpl,
       publicDir
     },
 
     // 目标路径
     target: (org_mark = null, component_mark = null) => {
       // ---------------------- 目标路径 ----------------------
       const devWorkspace = path.resolve(
         think.config("custom.wwwDirPath"),
         "static/dev_visual_component/dev_workspace"
       );
       const publicWorkspace = path.resolve(
        think.config("custom.wwwDirPath"),
        "static/public_visual_component/1"
      );
       const orgPath = path.resolve(devWorkspace, org_mark);
       if (!component_mark) return { devWorkspace, orgPath };
        
       const componentMarkPath = path.resolve(orgPath, component_mark);
       const releaseCodePath = path.resolve(componentMarkPath, "release_code");
       const releaseBuildPath = path.resolve(componentMarkPath, "release");
       const componentReleaseBuildPath = path.resolve(
         releaseBuildPath,
         component_mark
       );
       const buildPath = path.resolve(componentMarkPath, "build");
       const srcPath = path.resolve(componentMarkPath, "src");
 
       const gitignoreFile = path.resolve(componentMarkPath, ".gitignore");
       const envFile = path.resolve(componentMarkPath, "env.js");
       const optionsJsonFile = path.resolve(componentMarkPath, "options.json");
       const packageJsonFile = path.resolve(componentMarkPath, "package.json");
       const editorHtmlFile = path.resolve(componentMarkPath, "editor.html");
       const webpackDevConfFile = path.resolve(
         buildPath,
         "webpack.config.dev.js"
       );
       const webpackProductionFile = path.resolve(
         buildPath,
         "webpack.config.production.js"
       );
 
       //src内容
       const srcMainJsFile = path.resolve(srcPath, "main.js");
       const srcComponentJsFile = path.resolve(srcPath, "Component.js");
       const srcSettingJsFile = path.resolve(srcPath, "setting.js");
       const srcSettingsPath = path.resolve(srcPath, "settings");
       const srcSettingsOptionsJsFile = path.resolve(
         srcSettingsPath,
         "options.js"
       );
       const srcSettingsDataJsFile = path.resolve(srcSettingsPath, "data.js");
       return {
         devWorkspace,
         publicWorkspace,
         orgPath,
         componentMarkPath,
         releaseCodePath,
         releaseBuildPath,
         componentReleaseBuildPath,
         buildPath,
         srcPath,
         gitignoreFile,
         envFile,
         optionsJsonFile,
         packageJsonFile,
         editorHtmlFile,
         webpackDevConfFile,
         webpackProductionFile,
         srcMainJsFile,
         srcComponentJsFile,
         srcSettingJsFile,
         srcSettingsPath,
         srcSettingsOptionsJsFile,
         srcSettingsDataJsFile
       };
     },
   };
 })();
 
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
