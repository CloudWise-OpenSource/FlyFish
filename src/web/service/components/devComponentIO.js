const fs = require("async-file");
const sfs = require('fs');
const path = require("path");
const _ = require("lodash");
const util = require("util");
const child_process = require("child_process");
const child_process_exec = util.promisify(child_process.exec);
const EnumComponentType = require('../../../common/constants/EnumComponentType');

const EnumComponentInfoCryptoKey =
  require("../../../common/constants/app/visual/EnumVisualComponents").EnumComponentInfoCryptoKey;
const EnumComponentCodeType =
  require("../../../common/constants/app/visual/EnumVisualComponents").EnumComponentCodeType;
const EnumComponentDevStatus =
  require("../../../common/constants/app/visual/EnumVisualComponents").EnumComponentDevStatus;
const EnumComponentIOPath =
  require("../../../common/constants/app/visual/EnumVisualComponents").EnumComponentIOPath;

module.exports = class extends think.Service {
  constructor(db = null) {
    super();
    this.helperService = think.service("helper");
    this.cryptoService = think.service("crypto");
    // 用户model实例
    this.modelVisualComponentsIns = db
      ? think
          .model("components", {}, think.config("custom.appModules.web"))
          .db(db)
      : think.model(
          "components",
          {},
          think.config("custom.appModules.web")
        );
    this.modelVisualOrgIns = db
      ? think
          .model("componentsOrg", {}, think.config("custom.appModules.web"))
          .db(db)
      : think.model("componentsOrg", {}, think.config("custom.appModules.web"));
    this.modelComponentIns = think.model('components', {}, think.config('custom.appModules.web'));
  }

  /**
   *
   * @param {Number} component_id
   * @returns {Promise<*>}
   */
  async initDevWorkspace(component_id) {
    
    // 查询组件的内容
    const compData = await this.modelVisualComponentsIns
    .where({ component_id })
    .find();
    //查询组件类型
    const {type} = compData;
    
    const baseInfo = await this.modelVisualComponentsIns
      .transaction(async () => {
        // 将组件置成开发状态
        await this.modelVisualComponentsIns
          .where({ component_id })
          .update({ is_developping: EnumComponentDevStatus.yes })
          .catch((e) => console.log(e));
        // 查询组件的内容
        const componentInfo = await this.modelVisualComponentsIns
          .where({ component_id })
          .find();
        return {
          componentInfo,
          orgInfo: await this.modelVisualOrgIns
            .where({ org_id: componentInfo.org_id })
            .find(),
        };
      })
      .catch((e) => (think.isError(e) ? e : new Error(e)));

    if (think.isError(baseInfo)) return baseInfo;

    const { componentInfo, orgInfo } = baseInfo;

    const component_mark = componentInfo.component_mark;
    const org_mark = orgInfo.org_mark;
    const org_name = orgInfo.name;

    const source = EnumComponentIOPath.source;
    const target = EnumComponentIOPath.target(org_mark, component_mark);

    try {
      const isFirstInit = !(await fs.exists(target.componentMarkPath));
      // 创建开发组件目录
      if (!(await fs.exists(target.orgPath))) {
        await fs.mkdir(target.orgPath);
      }

      if (!(await fs.exists(target.componentMarkPath))) {
        await fs.mkdir(target.componentMarkPath);
      }

      if (!(await fs.exists(target.buildPath))) {
        await fs.mkdir(target.buildPath);
      }

      if (!(await fs.exists(target.srcPath))) {
        await fs.mkdir(target.srcPath);
      }

      // 创建webpack配置文件
      if (!(await fs.exists(target.webpackDevConfFile))) {
        await fs.writeFile(
          target.webpackDevConfFile,
          source.webpackConfDevTpl(org_mark, component_mark)
        );
      }

      if (!(await fs.exists(target.webpackProductionFile))) {
        await fs.writeFile(
          target.webpackProductionFile,
          source.webpackConfProductionTpl(org_mark, component_mark)
        );
      }

      if (!(await fs.exists(target.editorHtmlFile))) {
        await fs.writeFile(
          target.editorHtmlFile,
          source.editorHtmlTpl(org_mark, component_mark)
        );
      }

      if (!(await fs.exists(target.gitignoreFile))) {
        await fs.writeFile(target.gitignoreFile, "package-lock.json\nnode_modules");
      }

      if (!(await fs.exists(target.envFile))) {
        await fs.writeFile(
          target.envFile,
          source.envTpl(org_mark, component_mark)
        );
      }

      if (!(await fs.exists(target.optionsJsonFile))) {
        await fs.writeFile(
          target.optionsJsonFile,
          source.optionsJsonTpl(component_mark)
        );
      }

      if (!(await fs.exists(target.packageJsonFile))) {
        await fs.writeFile(
          target.packageJsonFile,
          source.packageJsonTpl(component_mark)
        );
      }

      // 创建src路径下文件 ---- start
      if (isFirstInit) {
        if (!(await fs.exists(target.srcMainJsFile))) {
          await fs.writeFile(
            target.srcMainJsFile,
            source.srcMainJsTpl(component_mark)
          );
        }
        
        if (!(await fs.exists(target.srcComponentJsFile))) {
          await fs.writeFile(
            target.srcComponentJsFile,
            source.srcComponentJsTpl(component_mark)
          );
        }

        if (!(await fs.exists(target.srcSettingJsFile))) {
          await fs.writeFile(
            target.srcSettingJsFile,
            source.srcSettingJsTpl(component_mark)
          );
        }

        if (!(await fs.exists(target.srcSettingsPath))) {
          await fs.mkdir(target.srcSettingsPath);
        }

        if (!(await fs.exists(target.srcSettingsOptionsJsFile))) {
          await fs.writeFile(
            target.srcSettingsOptionsJsFile,
            source.srcSettingsOptionsJsTpl(component_mark)
          );
        }

        if (!(await fs.exists(target.srcSettingsDataJsFile))) {
          await fs.writeFile(
            target.srcSettingsDataJsFile,
            source.srcSettingsDataJsTpl(component_mark)
          );
        }
      }
      // 创建src路径下文件 ---- end

      // 源代码src目录
      if (
        await fs.exists(
          source.releaseComponentMarkCodePath(org_mark, component_mark)
        )
      ) {
        await this.helperService.copyDir(
          source.releaseComponentMarkCodePath(org_mark, component_mark),
          target.srcPath
        );
      }
    } catch (e) {
      think.logger.error(e);
      return think.isError(e) ? e : new Error(e);
    }

    return target.componentMarkPath;
  }
  
  /**
   * 获取组织标示
   * @param component_id
   * @return {Promise<{org_mark: *|{type: string, notNull: boolean, length: number}|tableName.org_mark|{type, notNull, length}|null, org_name, component_mark: *|String|{aliasName: string, trim: boolean, required: boolean, length: {max: number}}|component_mark|{aliasName, trim, required, length}|{length}, component_name}>}
   */
  async getComponentInfoById(component_id) {
    const componentInfo = await this.modelVisualComponentsIns
      .where({ component_id })
      .find();
    const orgInfo = await this.modelVisualOrgIns
      .where({ org_id: componentInfo.org_id })
      .find();

    return {
      create_user_id: componentInfo.create_user_id,
      update_user_id: componentInfo.update_user_id,
      org_mark: orgInfo.org_mark,
      org_name: orgInfo.name,
      component_mark: componentInfo.component_mark,
      component_name: componentInfo.name,
      type: componentInfo.type,
      typeId: componentInfo.typeId
    };
  }
  

  /**
   * 编译组件
   * @param {Number} component_id
   * @param {Boolean}isProduction
   * @return {Promise<*>}
   */
  async compileComponent(component_id, isProduction = false) {
    const { org_mark } = await this.getComponentInfoById(component_id);
    // 查询组件的内容
    const componentInfo = await this.modelVisualComponentsIns
      .where({ component_id })
      .find();
    const component_mark = componentInfo.component_mark;
    const target = EnumComponentIOPath.target(org_mark, component_mark);

    const componentjs  = await fs.readFile(path.resolve(target.componentMarkPath,'./src/Component.js'),'utf-8');
    
    const componentTexts = componentjs.split('\n') || [];
    const index = _.findIndex(componentTexts, text => text.includes('getDefaultData'));

    const defaultValue = componentTexts[index + 1].includes('return []');
    await this.modelVisualComponentsIns.where({ component_id }).update({ default_value: defaultValue ? 0 : 1}).catch((e) => console.log(e));

    const packageJson = JSON.parse(
      (await fs.readFile(target.packageJsonFile)).toString()
    );

    if (
      (!think.isEmpty(packageJson.dependencies) ||
        !think.isEmpty(packageJson.devDependencies)) &&
      !(await fs.exists(path.resolve(target.componentMarkPath, "node_modules")))
    )
      return new Error("请安装开发依赖");

    let resp = null;
    if (isProduction) {
      const { stderr, stdout } = await child_process_exec(
        "cd " + target.componentMarkPath + " && npm run build-production"
      ).catch((e) => (think.isError(e) ? e : new Error(e)));
      resp = stdout;
      if (think.isError(stderr)) return stderr;
    } else {
      const { stderr, stdout } = await child_process_exec(
        "cd " + target.componentMarkPath + " && npm run build-dev"
      ).catch((e) => (think.isError(e) ? e : new Error(e)));
      resp = stdout;
      if (think.isError(stderr)) return stderr;
    }

    return resp;
  }

  /**
   * npm install 开发组件
   * @param component_id
   * @return {Promise<void>}
   */
  async npmDevComponent(component_id) {
    const { org_mark } = await this.getComponentInfoById(component_id);
    // 查询组件的内容
    const componentInfo = await this.modelVisualComponentsIns
      .where({ component_id })
      .find();
    const component_mark = componentInfo.component_mark;
    const target = EnumComponentIOPath.target(org_mark, component_mark);
    const { stderr, stdout } = await child_process_exec(
      "cd " + target.componentMarkPath + " && npm install"
    ).catch((e) => (think.isError(e) ? e : new Error(e)));
    if (think.isError(stderr)) return stderr;

    return stdout;
  }

  /**
   * 读取文件内容
   * @param {Number} component_id
   * @param {String} filePath  文件路径
   * @return {Promise<*>}
   */
  async readFile(component_id, filePath) {
    const { org_mark } = await this.getComponentInfoById(component_id);
    return await fs
      .readFile(
        path.resolve(EnumComponentIOPath.target(org_mark).orgPath, filePath)
      )
      .then((content) => content.toString())
      .catch((e) => (think.isError(e) ? e : new Error(e)));
  }

  /**
   * 保存文件内容
   * @param {Number} component_id
   * @param {String} filePath  文件路径
   * @param {String} fileContent  文件内容
   * @return {Promise<*>}
   */
  async saveFileContent(account_id, user_id, component_id, filePath, fileContent) {
    const { org_mark, create_user_id } = await this.getComponentInfoById(component_id);
    let data = {
      update_user_id: user_id
    };
    if (think.isEmpty(create_user_id)) {
      data.create_user_id = user_id;
    }
    await this.modelComponentIns.where({ account_id, component_id }).update(data).catch(err => {
      think.logger.error(err);
      return think.isError(err) ? err : new Error(err)
    });
    return await fs
      .writeFile(
        path.resolve(EnumComponentIOPath.target(org_mark).orgPath, filePath),
        fileContent
      )
      .catch((e) => (think.isError(e) ? e : new Error(e)));
  }

  /**
   * 添加文件或目录
   * @param {Number} component_id
   * @param {String} filePath
   * @param {String} name
   * @param {Number} type
   * @return {Promise<*>}
   */
  async addFileOrDir(component_id, filePath, name, type) {
    const { org_mark } = await this.getComponentInfoById(component_id);
    const newFilePath = path.resolve(
      EnumComponentIOPath.target(org_mark).orgPath,
      filePath,
      name
    );
    if (await fs.exists(newFilePath)) return new Error("名称已经存在");

    switch (type) {
      case EnumComponentCodeType.file:
        return await fs.createWriteStream(newFilePath);
      case EnumComponentCodeType.dir:
        return await fs
          .mkdir(newFilePath)
          .catch((e) => (think.isError(e) ? e : new Error(e)));
    }
  }

  /**
   * 更新文件或目录
   * @param {Number} component_id
   * @param {String} filePath
   * @param {String} name
   * @return {Promise<*>}
   */
  async updateFileOrDir(component_id, filePath, name) {
    const { org_mark } = await this.getComponentInfoById(component_id);
    console.log(org_mark)
    const filePathArr = filePath.split("/");
    filePathArr.pop();
    filePathArr.push(name);

    return await this.helperService
      .move(
        path.resolve(EnumComponentIOPath.target(org_mark).orgPath, filePath),
        path.resolve(
          EnumComponentIOPath.target(org_mark).orgPath,
          filePathArr.join("/")
        )
      )
      .catch((e) => (think.isError(e) ? e : new Error(e)));
  }

  /**
   * 删除文件或目录
   * @param {Number} component_id
   * @param {String} filePath
   * @return {Promise<*>}
   */
  async delFileOrDir(component_id, filePath) {
    const { org_mark } = await this.getComponentInfoById(component_id);
    return await fs
      .delete(
        path.resolve(EnumComponentIOPath.target(org_mark).orgPath, filePath)
      )
      .catch((e) => (think.isError(e) ? e : new Error(e)));
  }

  /**
   * 制作组件zip包
   * @param component_id
   * @return {Promise<*>}
   */
  async mkComponentZip(component_id) {
    const { org_mark, org_name, component_mark, component_name ,type,typeId} =
      await this.getComponentInfoById(component_id);
    const target = EnumComponentIOPath.target(org_mark, component_mark);
    const filepath = path.resolve(
      target.releaseBuildPath,
      `${component_mark}.zip`
    );
    const componentjs  = await fs.readFile(path.resolve(target.componentMarkPath,'./src/Component.js'),'utf-8');
      if (think.isError(componentjs)) return componentjs;
      
    if (type==EnumComponentType.type_ht) {
      //修改component.js 3d场景资源路径
      const buildjs = componentjs.replace(
        /\/\*framejs start\*\//,
        `const envWindow = window.DATAVI_ENV||window.parent.DATAVI_ENV||window.parent.parent.DATAVI_ENV||window.parent.parent.parent.DATAVI_ENV;
          const componentsDir = envWindow.componentsDir;
        `
      ).replace(
        /\/\*convertURL start\*\/.*\/\*convertURL end\*\//,
        'ht.Default.convertURL = (url) => {return componentsDir+"/${this.config.name}/public/storage/"+url;};'
      ).replace(
        /\/\*ht_main start\*\/.*\/\*ht_main end\*\//,
        'ht_main.src = componentsDir+"/${this.config.name}/public/ht/k5o4stdqy93D.js";'
      ).replace(
        /\/\*ht_valid start\*\/.*\/\*ht_valid end\*\//,
        'ht_valid.src = componentsDir+"/${this.config.name}/public/ht/Xsy4zRvefN8W.js";'
      ).replace(
        /\/\*ht_script start\*\/.*\/\*ht_script end\*\//,
        'ht_script.src = componentsDir+"/${this.config.name}/public/ht/ht.js";'
      ).replace(
        /\/\*ht_buck start\*\/.*\/\*ht_buck end\*\//,
        'ht_buck.src = componentsDir+"/${this.config.name}/public/ht/buckle.js";'
      ).replace(
        /\/\*pluginSrc start\*\/.*\/\*pluginSrc end\*\//,
        'scriptElement.src = componentsDir+"/${this.config.name}/"+item;'
      );
      const writeUrlMsg = await fs.writeFile(path.resolve(target.componentMarkPath,'./src/Component.js'),buildjs);
      if (think.isError(writeUrlMsg)) return writeUrlMsg;
    }

    // 编译组件包
    const compileResp = await this.compileComponent(component_id, true);
    if (think.isError(compileResp)) return compileResp;
    
    if (type==EnumComponentType.type_ht) {
      //还原components.js
      const rewriteUrlMsg = await fs.writeFile(path.resolve(target.componentMarkPath,'./src/Component.js'),componentjs);
      if (think.isError(rewriteUrlMsg)) return rewriteUrlMsg;
    }

    // 将组件信息写入文件
    const writeResp = await fs.writeFile(
      path.resolve(target.componentReleaseBuildPath, "component_info.txt"),
      this.cryptoService.aesEncrypt(
        JSON.stringify({ org_mark, org_name, component_mark, component_name }),
        EnumComponentInfoCryptoKey
      ),
    );
    if (think.isError(writeResp)) return writeResp;
    
    if (type==EnumComponentType.type_ht) {
      const { dirPath } = await this.getSceneInfoById(typeId);
      //ht资源复制
      const publicPath = path.resolve(target.componentReleaseBuildPath,'./public');
      if (!(await fs.exists(publicPath))){
        await fs.mkdir(publicPath);
      }
      await this.helperService.copyDir(
        path.resolve(target.componentMarkPath,'./public'),path.resolve(target.componentReleaseBuildPath,'./public')
      );
      //场景资源复制
      const storagePath = path.resolve(target.componentReleaseBuildPath,'./public/storage');
      if (!(await fs.exists(storagePath))){
        await fs.mkdir(storagePath);
      }
      await this.helperService.copyDir(
        think.config("custom.wwwDirPath")+dirPath+'/storage',path.resolve(target.componentReleaseBuildPath,'./public/storage')
      )
    }
    
    // 将编译后的组件包打包成zip包
    const result = await this.helperService.zip(
      target.componentReleaseBuildPath,
      filepath
    );
    if (think.isError(result)) return result;

    return filepath;
  }

  /**
   * 上下架组件
   * @param component_id
   * @param shelf_status
   * @return {Promise<*>}
   */
   async shelfComponent(component_id) {
      const { org_mark, org_name, component_mark, component_name } =
      await this.getComponentInfoById(component_id);
      const target = EnumComponentIOPath.target(org_mark, component_mark);
     
      const componentjs  = await fs.readFile(path.resolve(target.componentMarkPath,'./src/Component.js'),'utf-8');
        if (think.isError(componentjs)) return componentjs;

      // 编译组件包
      const compileResp = await this.compileComponent(component_id, true);
      if (think.isError(compileResp)) return compileResp;

      // 将组件信息写入文件
      const writeResp = await fs.writeFile(
        path.resolve(target.componentReleaseBuildPath, "component_info.txt"),
        this.cryptoService.aesEncrypt(
          JSON.stringify({ org_mark, org_name, component_mark, component_name }),
          EnumComponentInfoCryptoKey
        )
      );
      if (think.isError(writeResp)) return writeResp;

      // copy下载的资源到组件中
      await this.helperService.copyDir(path.resolve(target.componentReleaseBuildPath), path.resolve(target.publicWorkspace, component_mark));
  }

  /**
   * 下载组件源代码
   * @param component_id
   * @return {Promise<void>}
   */
  async downloadComponentCode(component_id) {
    const { org_mark, org_name, component_mark, component_name } =
      await this.getComponentInfoById(component_id);
    const target = EnumComponentIOPath.target(org_mark, component_mark);

    if (!(await fs.exists(target.releaseCodePath))) {
      await fs.mkdir(target.releaseCodePath);
    }

    const releaseCodeComponentMarkPath = path.resolve(
      target.releaseCodePath,
      component_mark
    );
    if (!(await fs.exists(releaseCodeComponentMarkPath))) {
      await fs.mkdir(releaseCodeComponentMarkPath);
    }

    // 将组件信息写入文件
    const writeResp = await fs.writeFile(
      path.resolve(releaseCodeComponentMarkPath, "component_info.txt"),
      this.cryptoService.aesEncrypt(
        JSON.stringify({ org_mark, org_name, component_mark, component_name }),
        EnumComponentInfoCryptoKey
      )
    );
    if (think.isError(writeResp)) return writeResp;

    // copy下载的资源到组件中
    await this.helperService.copyDir(
      path.resolve(target.componentMarkPath, "build"),
      path.resolve(releaseCodeComponentMarkPath, "build")
    );
    await this.helperService.copyFile(
      path.resolve(target.devWorkspace, "webpack.config.base.js"),
      path.resolve(
        releaseCodeComponentMarkPath,
        "build",
        "webpack.config.base.js"
      )
    );
    await this.helperService.copyFile(
      path.resolve(target.devWorkspace, "package.json"),
      path.resolve(releaseCodeComponentMarkPath, "build", "package.json")
    );
    await this.helperService.copyDir(
      path.resolve(target.componentMarkPath, "src"),
      path.resolve(releaseCodeComponentMarkPath, "src")
    );
    await this.helperService.copyFile(
      path.resolve(target.componentMarkPath, "package.json"),
      path.resolve(releaseCodeComponentMarkPath, "package.json")
    );
    await this.helperService.copyFile(
      path.resolve(target.componentMarkPath, "options.json"),
      path.resolve(releaseCodeComponentMarkPath, "options.json")
    );

    // 将编译后的组件包打包成zip包
    const filepath = path.resolve(
      target.releaseCodePath,
      `${component_mark}.zip`
    );
    const result = await this.helperService.zip(
      releaseCodeComponentMarkPath,
      filepath
    );
    if (think.isError(result)) return result;

    return filepath;
  }

  /**
   * 上传文件
   * @param component_id
   * @param filePath
   * @param uploadFileList
   * @return {Promise<void>}
   */
  async uploadFile(component_id, filePath, uploadFileList) {
    const { org_mark, component_mark } = await this.getComponentInfoById(
      component_id
    );
    const target = EnumComponentIOPath.target(org_mark, component_mark);
    const targetPath = path.resolve(target.orgPath, filePath);

    uploadFileList = Array.isArray(uploadFileList)
      ? uploadFileList
      : [uploadFileList];
    for (let i = 0; i < uploadFileList.length; i++) {
      const item = uploadFileList[i];
      await this.helperService.copyFile(
        item.path,
        path.resolve(targetPath, item.name)
      );
    }

    return true;
  }

  /**
   * copy组件
   * @param {Number} origin_component_id
   * @param {Number} target_component_id
   * @return {Promise<boolean>}
   */
  async copyComponent(origin_component_id, target_component_id) {
    const replaceFileContent = async (filePath, regxArr, replaceArr) => {
      if (!(await fs.exists(filePath))) return false;

      let fileContent = (await fs.readFile(filePath)).toString();
      regxArr.forEach((regx, index) => {
        fileContent = fileContent.replace(RegExp(regx, "g"), replaceArr[index]);
      });
      await fs.writeFile(filePath, fileContent);
    };

    const originComponent = await this.getComponentInfoById(
      origin_component_id
    );
    const targetComponent = await this.getComponentInfoById(
      target_component_id
    );

    const origin = EnumComponentIOPath.target(
      originComponent.org_mark,
      originComponent.component_mark
    );
    const target = EnumComponentIOPath.target(
      targetComponent.org_mark,
      targetComponent.component_mark
    );
    if (!(await fs.exists(target.orgPath))) {
      await fs.mkdir(target.orgPath);
    }

    if (!(await fs.exists(target.componentMarkPath))) {
      await fs.mkdir(target.componentMarkPath);
    }

    await this.helperService.copyDir(origin.buildPath, target.buildPath);
    await this.helperService.copyDir(origin.srcPath, target.srcPath);
    await this.helperService.copyFile(
      origin.editorHtmlFile,
      target.editorHtmlFile
    );
    await this.helperService.copyFile(origin.envFile, target.envFile);
    await this.helperService.copyFile(
      origin.packageJsonFile,
      target.packageJsonFile
    );
    await this.helperService.copyFile(
      origin.optionsJsonFile,
      target.optionsJsonFile
    );

    await replaceFileContent(
      target.webpackDevConfFile,
      [originComponent.org_mark, originComponent.component_mark],
      [targetComponent.org_mark, targetComponent.component_mark]
    );
    await replaceFileContent(
      target.webpackProductionFile,
      [originComponent.org_mark, originComponent.component_mark],
      [targetComponent.org_mark, targetComponent.component_mark]
    );
    await replaceFileContent(
      target.editorHtmlFile,
      [originComponent.org_mark, originComponent.component_mark],
      [targetComponent.org_mark, targetComponent.component_mark]
    );
    await replaceFileContent(
      target.envFile,
      [originComponent.org_mark, originComponent.component_mark],
      [targetComponent.org_mark, targetComponent.component_mark]
    );
    await replaceFileContent(
      target.packageJsonFile,
      [originComponent.org_mark, originComponent.component_mark],
      [targetComponent.org_mark, targetComponent.component_mark]
    );
    await replaceFileContent(
      target.optionsJsonFile,
      [originComponent.org_mark, originComponent.component_mark],
      [targetComponent.org_mark, targetComponent.component_mark]
    );
    await replaceFileContent(
      path.resolve(target.srcPath, "main.js"),
      [originComponent.component_mark],
      [targetComponent.component_mark]
    );
    await replaceFileContent(
      path.resolve(target.srcPath, "setting.js"),
      [originComponent.component_mark],
      [targetComponent.component_mark]
    );

    return true;
  }
  /**
   * 导入组件代码
   * @param {Number} origin_component_id
   * @param {Number} target_component_id
   * @return {Promise<boolean>}
   */
  async importComponentCode(component_id, componentInfo, tempPath) {
    const { org_mark, component_mark } = componentInfo;
    const target = EnumComponentIOPath.target(org_mark, component_mark);

    const componentMarkPath = target.componentMarkPath;

    // copy导入的资源到组件中
    if (
      (await fs.exists(path.resolve(tempPath, "build/webpack.config.dev.js")))
    ) {
      await this.helperService.copyFile(
        path.resolve(tempPath, "build/webpack.config.dev.js"),
        path.resolve(componentMarkPath, "build/webpack.config.dev.js")
      );
    }
    if (
      (await fs.exists(
        path.resolve(tempPath, "build/webpack.config.production.js")
      ))
    ) {
      await this.helperService.copyFile(
        path.resolve(tempPath, "build/webpack.config.production.js"),
        path.resolve(componentMarkPath, "build/webpack.config.production.js")
      );
    }
    await this.helperService.copyDir(
      path.resolve(tempPath, "src"),
      path.resolve(componentMarkPath, "src")
    );
    if ((await fs.exists(path.resolve(tempPath, "package.json")))) {
      await this.helperService.copyFile(
        path.resolve(tempPath, "package.json"),
        path.resolve(componentMarkPath, "package.json")
      );
    }
    if ((await fs.exists(path.resolve(tempPath, "options.json")))) {
      await this.helperService.copyFile(
        path.resolve(tempPath, "options.json"),
        path.resolve(componentMarkPath, "options.json")
      );
    }

    return true;
  }
};
