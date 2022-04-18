const path = require("path");
const fs = require("async-file");

const EnumComponentDevStatus = require('../../../common/constants/app/visual/EnumVisualComponents').EnumComponentDevStatus;
const EnumComponentPublishStatus = require('../../../common/constants/app/visual/EnumVisualComponents').EnumComponentPublishStatus;
const getComponentTempPath = require('../../../common/constants/app/visual/EnumVisualComponents').getComponentTempPath;
const EnumComponentInfoCryptoKey =
  require("../../../common/constants/app/visual/EnumVisualComponents").EnumComponentInfoCryptoKey;
const EnumComponentType = require('../../../common/constants/EnumComponentType');
const EnumComponentIOPath =
  require("../../../common/constants/app/visual/EnumVisualComponents").EnumComponentIOPath;
/**
 * 格式化过滤条件
 * @param search
 * @returns {*}
 */
const formatSearchParams = (search) => {
    search = think.isEmpty(search) ? {} : JSON.parse(search);
    if (search.hasOwnProperty('name')) search.name = ['like','%' + search.name + '%'];

    return search;
};

module.exports = class extends think.Service{
    constructor(){
        super();
        this.helperService = think.service("helper");
        // 用户model实例
        this.modelComponentIns = think.model('visualComponents', {}, think.config('custom.appModules.web'));
        // this.modelComponentVersionIns = think.model('visualComponentVersion', {}, think.config('custom.appModules.web'));
        this.cryptoService = think.service("crypto");
    }

    /**
     * 校验组件标示名称是否存在
     * @param {Number} account_id
     * @param {Number} org_id
     * @param {String} component_mark
     * @param {Mixed} component_id    // 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExistComponentMark(account_id, org_id, component_mark, component_id = null) {
        const where = {account_id, org_id, component_mark};
        if(component_id) where.component_id = ['!=', component_id];
        const result = await this.modelComponentIns.where(where).softCount().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
        return result > 0 ?  true : false;
    }
    /**
     * 校验组件标示名称是否存在
     * @param {Number} account_id
     * @param {Number} org_id
     * @param {String} component_mark
     * @param {Mixed} component_id    // 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExistComponentMarkIncludeDel(account_id, org_id, component_mark, component_id = null) {
      const where = {account_id, org_id, component_mark};
      if(component_id) where.component_id = ['!=', component_id];
      const result = await this.modelComponentIns.where(where).count().catch(err => {
          think.logger.error(err);
          return think.isError(err) ? err : new Error(err);
      });
      return result > 0 ?  true : false;
  }

    /**
     * 添加组件
     * @param {Number} account_id
     * @param {Object} params
     * @param {String} params.name                // 组件名称
     * @param {String} params.component_mark      // 组件标识
     * @param {Number} params.org_id              // 组织
     * @param {Number} params.categories_id       // 组织分类
     * @returns {Promise<*>}
     */
    async addComponent(account_id, user_id, params){
        Object.assign(params, {
            account_id,
            create_user_id: user_id,
            is_developping: EnumComponentDevStatus.yes,
            is_published: EnumComponentPublishStatus.no,
        });
        return await this.modelComponentIns.add(params).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 获取组件列表
     * @param {Number} account_id
     * @param {Number} page         // 当前分页数
     * @param {Number} pageSize     // 每页显示的数量
     * @param {Object} search       // 搜索条件
     * @returns {Promise<void>}
     */
    async getComponentPageList(account_id, page, pageSize = 15, search = {}) {
        search = think.isEmpty(search) ? {} : JSON.parse(search);
        let where = { account_id, ...search };
        if (search.hasOwnProperty("name")) {
            delete where.name;
            where["name|component_mark"] = ["like", "%" + search.name + "%"];
        }

        let result = await this.modelComponentIns.where(where).page(page, pageSize).softCountSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
        
        let resultUserList = [];
        result.data.forEach(item => {
            if (
              !think.isEmpty(item.create_user_id) &&
              resultUserList.indexOf(item.create_user_id) === -1
            ) {
              resultUserList.push(item.create_user_id);
            }
            if (
              !think.isEmpty(item.update_user_id) &&
              resultUserList.indexOf(item.update_user_id) === -1
            ) {
              resultUserList.push(item.update_user_id);
            }
        });
        const userService = think.service("rbac/user");
        let userInfoList = resultUserList.length > 0 ? await userService.getUser(resultUserList) : [];

        result.data = result.data.map((item) => {
            if (item.create_user_id) {
              const createUserInfo = userInfoList.find(
                (user) => user.user_id === item.create_user_id
              );
              if (
                !think.isEmpty(createUserInfo)
              ) {
                item.create_user_name = createUserInfo.user_name;
              }
            }
            if (item.update_user_id) {
              const updateUserInfo = userInfoList.find(
                (user) => user.user_id === item.update_user_id
              );
              if (
                !think.isEmpty(updateUserInfo)
              ) {
                item.update_user_name = updateUserInfo.user_name;
              }
            }
            return item;
        });

        return result;
    }

    /**
     * 获取单个组件详情
     * @param {Number} account_id
     * @param {Number} component_id
     * @param {Array|String} fields
     * @returns {Promise<any>}
     */
    async getComponentById(account_id, component_id, fields = "*"){
        fields = Array.isArray(fields) ? fields.join(',') : fields;
        return await this.modelComponentIns.where({account_id, component_id}).field(fields).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

     /**
   * 组件按组织更新文件或目录
   * @param {Number} account_id
   * @param {Number} org_id 原组织id
   * @param {Number} targetOrg_id 目标组织id
   * * @param {String} component_mark 组件标识
   * @return {Promise<*>}
   */
  async updateFileOrDir(account_id, org_id, targetOrg_id, component_mark) {
    const organizeService = think.service('visualComponents/organize', think.config("custom.appModules.web"), this.modelComponentIns.db());
    const { org_mark } = await organizeService.getOrgById(account_id, org_id);
    const targetOrg = await organizeService.getOrgById(account_id, targetOrg_id);
    const targetOrg_mark = targetOrg.org_mark
    const moveRes = await this.helperService
      .move(
        path.resolve(EnumComponentIOPath.target(org_mark).orgPath, component_mark),
        path.resolve(EnumComponentIOPath.target(targetOrg_mark).orgPath, component_mark)
      )
      .catch((e) => {return think.isError(e) ? e : new Error(e)});
    const componentPath=path.resolve(EnumComponentIOPath.target(targetOrg_mark).orgPath,component_mark)
    let editorInfo = await fs.readFile(
        path.resolve(componentPath, "editor.html")
    );
    const contentString=editorInfo.toString().replace(org_mark, targetOrg_mark)
    return await fs.writeFile(path.resolve(componentPath, "editor.html"),contentString)
  }

    /**
     * 更新组件
     * @param {Number} account_id
     * @param {Number} component_id
     * @param {Object} data
     * @param {String} data.name                // 组件名称
     * @param {String} data.type                // 组件类型
     * @returns {Promise<void>}
     */
    async updateComponent(account_id, component_id, data) {
        const originComponent = await this.getComponentById(account_id, component_id);
        const {component_mark, org_id } = originComponent
        const targetOrg_id = data.org_id
        if( org_id !== targetOrg_id ){
            if (await this.isExistComponentMark(account_id, data.org_id, component_mark, component_id)) return new Error("该组织中组件标识已存在");
            let movePathRes = null
            try {
                movePathRes =await this.updateFileOrDir(account_id, org_id, targetOrg_id, component_mark);
            } catch (e) {
                return new Error("找不到当前组织文件夹");
            } 
        }
        return await this.modelComponentIns.where({ account_id, component_id }).update(data).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 删除组件
     * @param {Number} account_id
     * @param {Array} component_ids
     * @returns {Promise<void>}
     */
    async delComponent(account_id, component_ids) {
        return await this.modelComponentIns.where({ account_id, component_id: ['IN', component_ids] }).softDel().catch(err => {
        // return await this.modelCategoriesIns.where({ account_id, component_id: ['IN', component_ids] }).delete().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * copy组件
     * @param {Number} account_id
     * @param {Object} params
     * @param {Number} params.component_id
     * @param {Number} params.target_org_id
     * @param {String} params.target_component_mark
     * @return {Promise<*>}
     */
    async copyComponent(account_id, user_id, params){
        const devComponentIOService = think.service('visualComponents/devComponentIO', think.config("custom.appModules.web"), this.modelComponentIns.db());

        const { component_id, target_org_id, target_component_mark, user_name } = params;
        const originComponent = await this.getComponentById(account_id, component_id);
        if (await this.isExistComponentMark(account_id,target_org_id, target_component_mark)) return new Error("该组织中组件标识已存在");

        // 添加组件
        return await this.modelComponentIns.transaction(async () => {
            const target_component_id = await this.addComponent(account_id, user_id, {name: originComponent.name, component_mark: target_component_mark, org_id: target_org_id, categories_id: originComponent.categories_id, type: originComponent.type || EnumComponentType.type_common });
            if (think.isError(target_component_id)) return target_component_id;

            const copyRes = await devComponentIOService.copyComponent(component_id, target_component_id, {user_name});

            if (think.isError(copyRes)) {
                think.logger.error("复制组件失败");
                think.logger.error(copyRes);
                this.modelComponentIns.rollback();
            }

            return copyRes
        })
    }

    /**
     * 解析上传的组件zip包
     * @param {Number} account_id
     * @param {Object} uploadItem 上传文件对象
     * @param {String} tempPath 处理组件的临时目录
     * @return {Promise<*>}
     */
    async processComponentZip(account_id, uploadItem, tempPath) {
        const zipTypes = ["application/zip", "application/x-zip-compressed"]
        if (!zipTypes.includes(uploadItem.type)) return new Error("此zip包不可用!");
        const componentDirName = path.basename(uploadItem.name, ".zip");

        // 解压组件zip包
        let info = await this.helperService.unzip(uploadItem.path, tempPath);
        if (think.isError(info)) this.fail("zip包错误");
        // if (think.isError(info)) this.fail('zip包错误')
        // 读取component_info.txt文件内容
        const targetPath = path.resolve(tempPath, componentDirName);

        let componentInfo = null;
        try {
            console.log(`targetPath`, targetPath);
            componentInfo = await fs.readFile(
                path.resolve(targetPath, "component_info.txt")
            );
        } catch (e) {
            return new Error("读取文件内容失败");
        }

        // let componentInfo = await fs.readFile(path.resolve(targetPath, 'component_info.txt'));

        // if (think.isError(componentInfo)) return new Error("读取文件内容失败");
        componentInfo = JSON.parse(
            this.cryptoService.aesDecrypt(
                componentInfo.toString(),
                EnumComponentInfoCryptoKey
            )
        );

        // 统一组件名称和组件标识
        if (componentDirName != componentInfo.component_mark) {
            await this.helperService.move(
                targetPath,
                path.resolve(tempPath, componentInfo.component_mark)
            );
        }

        return {
            dbData: {
                account_id,
                name: componentInfo.component_name,
                component_mark: componentInfo.component_mark,
                org_mark: componentInfo.org_mark,
                org_name: componentInfo.org_name,
            },
            targetPath, // 解压后的组件路径
        };
    }

    /**
     * 导入组件源码
     * @param {Number} component_id
     * @param {Object} component
     * @returns {Promise<void>}
     */
    async importComponentCode(account_id, component_id, component) {
        const devComponentIOService = think.service('visualComponents/devComponentIO', think.config("custom.appModules.web"), this.modelComponentIns.db());
        // 处理组件的临时目录
        const tempPath = await getComponentTempPath();

        const componentInfo = await devComponentIOService.getComponentInfoById(
          component_id
        );

        const data = await this.processComponentZip(
            account_id,
            component,
            tempPath
        );
        if (think.isError(data)) return data;

        if (componentInfo.component_mark != data.dbData.component_mark) {
            await fs.delete(tempPath).catch((e) => e);
            return new Error("更新的组件标识和已有的组件标识不一致");
        }

        const result = await this.modelComponentIns.transaction(async () => {
            try {
                const copyRes = await devComponentIOService.importComponentCode(component_id, componentInfo, data.targetPath);

                if (think.isError(copyRes)) {
                    think.logger.error("导入组件失败");
                    think.logger.error(copyRes);
                }
            } catch (e) {
                // 还原一下
                return Promise.reject(e);
            }
        });

        await fs.delete(tempPath);

        return result;
    }
}
