const path = require("path");
const fs = require("async-file");

const EnumTagManage = require('../../../common/constants/app/system/tagManage');
const EnumComponentInfoCryptoKey =
    require("../../../common/constants/app/visual/EnumVisualComponents").EnumComponentInfoCryptoKey;
const getPublicVisualComponentPath =
    require("../../../common/constants/app/visual/EnumVisualComponents").getPublicVisualComponentPath;
const getComponentTempPath =
    require("../../../common/constants/app/visual/EnumVisualComponents").getComponentTempPath;
const mkEnvComponentConf =
    require("../../../common/constants/app/visual/EnumVisualComponents").mkEnvComponentConf;
const { think } = require("thinkjs");

module.exports = class extends think.Service {
    constructor() {
        super();
        this.helperService = think.service("helper");
        this.cryptoService = think.service("crypto");

        // 用户model实例
        this.modelComponentIns = think.model(
            "visualComponents",
            {},
            think.config("custom.appModules.web")
        );
        // 标签组件对照表model实例
        this.modelComponentTagIns = think.model(
            'visualComponentTagView',
            {},
            think.config('custom.appModules.web')
        );
        // 标签model实例
        this.modelTagIns = think.model(
            'componentTag',
            {},
            think.config('custom.appModules.web')
        );
    }

    /**
     * 校验组件标示名称是否存在
     * @param {Number} account_id
     * @param {String} component_mark
     * @param {Mixed} component_id    // 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExistComponentMark(
        account_id,
        component_mark,
        component_id = null
    ) {
        const where = { account_id, component_mark };
        if (component_id) where.component_id = ["!=", component_id];

        const result = await this.modelComponentIns
            .where(where)
            .softCount()
            .catch((err) => {
                think.logger.error(err);
                return think.isError(err) ? err : new Error(err);
            });

        return result > 0 ? true : false;
    }

    async mkEnvComponentConf(account_id) {
        const data = await this.modelComponentIns
            .where({ account_id })
            .softSelect()
            .catch((err) => {
                think.logger.error(err);
                return think.isError(err) ? err : new Error(err);
            });

        return await mkEnvComponentConf(account_id, data);
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
        const targetPath = path.resolve(tempPath, componentDirName);

        // 创建时验证
        const targetAccess = await fs.access(targetPath).catch((e) => e);
        if (think.isError(targetAccess)) {
            await fs.mkdir(targetPath);
        }

        // 解压组件zip包
        let info = await this.helperService.unzip(uploadItem.path, targetPath);
        if (think.isError(info)) this.fail("zip包错误");
        // if (think.isError(info)) this.fail('zip包错误')
        // 读取component_info.txt文件内容

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
     * 添加组件
     * @param {Number} account_id
     * @param {Object | Array} componentList
     * @param {Number} tag_id
     * @returns {Promise<*>}
     */
    async addComponent(account_id, componentList, tag_id) {
        if (!componentList) return new Error("组件不存在");
        const EnumPublicVisualComponentPath =
            await getPublicVisualComponentPath(account_id);

        let addData = [];
        // 处理组件的临时目录
        const tempPath = await getComponentTempPath();

        if (Array.isArray(componentList)) {
            for (let i = 0; i < componentList.length; i++) {
                const item = componentList[i];
                const data = await this.processComponentZip(
                    account_id,
                    item,
                    tempPath
                );
                if (think.isError(data)) {
                    // 删除已经处理的组件包
                    await await fs.delete(tempPath).catch((e) => e);
                    return data;
                }
                addData.push(data.dbData);
            }
        } else {
            const data = await this.processComponentZip(
                account_id,
                componentList,
                tempPath
            );
            if (think.isError(data)) {
                await fs.delete(tempPath).catch((e) => e);
                return data;
            }
            addData.push(data.dbData);
        }

        const childDirPaths = await fs.readdir(tempPath);
        // 校验发布组件中是否存在上传的组件
        for (let i = 0; i < childDirPaths.length; i++) {
            const childDir = childDirPaths[i];
            const targetDirPath = path.resolve(
                EnumPublicVisualComponentPath,
                childDir
            );
            const targetAccess = await fs.access(targetDirPath).catch((e) => e);
            if (!think.isError(targetAccess)) {
                await fs.delete(tempPath).catch((e) => e);
                return new Error("组件已经存在,不能重复添加");
            }
        }

        // 将组件移动到发布目录
        for (let i = 0; i < childDirPaths.length; i++) {
            const childDir = childDirPaths[i];
            const sourceDirPath = path.resolve(tempPath, childDir);
            const targetDirPath = path.resolve(
                EnumPublicVisualComponentPath,
                childDir
            );
            await this.helperService.move(sourceDirPath, targetDirPath);
        }

        // 删除组件的临时目录
        await fs.delete(tempPath).catch((e) => e);

        return await this.modelComponentIns.transaction(async () => {
            try {
                const addDataResult = await this.modelComponentIns.addMany(addData);
                if (think.isError(addDataResult)) throw new Error('添加组件失败');
                const generateEnv = await this.mkEnvComponentConf(account_id);
                if (think.isError(generateEnv)) throw new Error('添加组件失败');
                const componentTagView = this.modelComponentTagIns.db(this.modelComponentIns.db());
                const addComponentTagResult = await componentTagView.addComponentLink({ component_id: addDataResult, tag_id });
                if (think.isError(addComponentTagResult)) throw new Error('添加组件失败');
                return addComponentTagResult;
            } catch (e) {
                // 但凡失败都把建好的目录移除
                await fs.delete(EnumPublicVisualComponentPath);
                think.logger.error(e);
                return Promise.reject(e)
            }
        });
    }

    /**
     * 更新组件
     * @param {Number} account_id
     * @param {Number} component_id
     * @param {Object} component
     * @param {Number} tag_id
     * @returns {Promise<void>}
     */
    async updateComponent(account_id, component_id, component, tag_id) {
        // 处理组件的临时目录
        const tempPath = await getComponentTempPath();

        const componentInfo = await this.getComponentById(
            account_id,
            component_id
        );
        // 缓存一下之前的文件(回滚的时候方便恢复)
        const backUpOriginPath = await getComponentTempPath();
        let data = null;
        if (component) {
            data = await this.processComponentZip(
                account_id,
                component,
                tempPath
            );
            if (think.isError(data)) return data;

            if (componentInfo.component_mark != data.dbData.component_mark) {
                await fs.delete(tempPath).catch((e) => e);
                return new Error("更新的组件标识和已有的组件标识不一致");
            }

            const EnumPublicVisualComponentPath = await getPublicVisualComponentPath(account_id);

            // 缓存一下之前的文件(回滚的时候方便恢复)
            await this.helperService.copyDir(EnumPublicVisualComponentPath, backUpOriginPath);

            const childDirPaths = await fs.readdir(tempPath);
            // 将组件移动到发布目录
            for (let i = 0; i < childDirPaths.length; i++) {
                const childDir = childDirPaths[i];
                const sourceDirPath = path.resolve(tempPath, childDir);
                const targetDirPath = path.resolve(
                    EnumPublicVisualComponentPath,
                    childDir
                );
                await this.helperService.copyDir(sourceDirPath, targetDirPath);
            }

            // 删除组件的临时目录
            await fs.delete(tempPath).catch((e) => e);
        }

        const result = await this.modelComponentIns.transaction(async () => {
            try {
                if (component && data) {
                    const updateComponentResult = await this.modelComponentIns.where({ account_id, component_id }).update({
                        name: data.dbData.component_name,
                        org_name: data.dbData.org_name,
                    });
                    if (think.isEmpty(updateComponentResult))
                      throw new Error("更新组件失败");
                }
                const generateEnv = await this.mkEnvComponentConf(account_id);
                if (think.isError(generateEnv)) throw new Error('更新组件失败');
                const componentTagView = this.modelComponentTagIns.db(this.modelComponentIns.db());
                const updateComponentTagResult = await componentTagView.updateComponentLink({ component_id, tag_id });
                if (think.isError(updateComponentTagResult)) throw new Error('更新组件失败');
                return updateComponentTagResult;
            } catch (e) {
                // 还原一下
                if (component) {
                    await this.helperService.copyDir(
                        backUpOriginPath,
                        EnumPublicVisualComponentPath
                    );
                }
                think.logger.error(e);
                return Promise.reject(e);
            }
        });
        await fs.delete(backUpOriginPath);
        await fs.delete(tempPath);

        return result;
    }

    /**
     * 上传更新组件封面
     * @param account_id
     * @param component_id
     * @param coverFile
     * @return {Promise<*>}
     */
    async uploadComponentCover(account_id, component_id, coverFile) {
        const componentInfo = await this.getComponentById(
            account_id,
            component_id
        );
        return await this.helperService.copyFile(
            coverFile.path,
            path.resolve(
                await getPublicVisualComponentPath(account_id),
                componentInfo.component_mark,
                "cover.png"
            )
        );
    }

    /**
     * 删除组件
     * @param {Number} account_id
     * @param {Array} component_ids
     * @returns {Promise<void>}
     */
    async delComponent(account_id, component_ids) {
        const EnumPublicVisualComponentPath = await getPublicVisualComponentPath(account_id);
        // 缓存一下之前的文件(回滚的时候方便恢复)
        const backUpOriginPath = await getComponentTempPath();
        await this.helperService.copyDir(EnumPublicVisualComponentPath, backUpOriginPath);

        return await this.modelComponentIns.transaction(async () => {
            try {
                const componentResult = await this.modelComponentIns.where({ account_id, component_id: ["IN", component_ids] }).softSelect();
                // 从组件发布目录中删除组件
                for (let i = 0; i < componentResult.length; i++) {
                    const item = componentResult[i];
                    const targetDirPath = path.resolve(
                        EnumPublicVisualComponentPath,
                        item.component_mark
                    );
                    await fs.delete(targetDirPath).catch((e) => e);
                }
                const deleteComponentResult = await this.modelComponentIns.where({ account_id, component_id: ["IN", component_ids] }).delete();
                if (think.isError(deleteComponentResult)) throw new Error('删除组件失败');
                const componentTagView = this.modelComponentTagIns.db(this.modelComponentIns.db());
                const deleteComponentTagResult = await componentTagView.deleteComponentLink(component_ids);
                if (think.isError(deleteComponentTagResult)) throw new Error('删除组件失败');
                const generateEnv = await this.mkEnvComponentConf(account_id);
                if (think.isError(generateEnv)) throw new Error('删除组件失败');
                return deleteComponentTagResult;
            } catch (e) {
                await this.helperService.copyDir(backUpOriginPath, EnumPublicVisualComponentPath);
                think.logger.error(e);
                return Promise.reject(e);
            }
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
        const where = { account_id };
        search = think.isEmpty(search) ? {} : JSON.parse(search);
        if (search.hasOwnProperty("name")) {
          where["name|component_mark"] = ["like", "%" + search.name + "%"];
        }
        if (search.hasOwnProperty("tagList")) {
            let tagList = search.tagList.split(",");
            if (tagList != null && Array.isArray(tagList)) {
                const componentTagView = this.modelComponentTagIns.db(
                  this.modelComponentIns.db()
                );
                const componentIdList = await componentTagView.getComponentList(
                  tagList
                );
                if (think.isError(componentIdList))
                    throw new Error("查询组件列表失败");
                if (!think.isEmpty(componentIdList)) {
                    where["component_id"] = [
                        "IN",
                        componentIdList.map((v) => v.component_id),
                    ];
                } else {
                    where["component_id"] = null;
                }
            }
        }

        return await this.modelComponentIns
            .where(where)
            .page(page, pageSize)
            .order("created_at desc")
            .softCountSelect()
            .catch((err) => {
                think.logger.error(err);
                return think.isError(err) ? err : new Error(err);
            });
    }

    /**
     * 根据标签id获取组件列表
     * @param {Number} tag_id  标签id列表
     * @param {Number} is_hide 是否获取可见
     * @returns {Promise<void>}
     */
    async getComponentListByTagId(tag_id, is_hide = 0) {
        tag_id = tag_id.split(',');
        return await this.modelComponentIns.transaction(async () => {
            try {
                const componentTagView = this.modelComponentTagIns.db(this.modelComponentIns.db());
                const tag = this.modelTagIns.db(this.modelComponentIns.db());
                const tagInfo = await tag.getTag(tag_id);
                if (think.isError(tagInfo) || think.isEmpty(tagInfo)) throw new Error('查询组件列表失败');
                const searchTagIdList = [EnumTagManage.EumnDefaultTagId, ...tag_id]
                const componentIdList = await componentTagView.getComponentList(searchTagIdList);
                if (think.isError(componentIdList)) throw new Error('查询组件列表失败');
                if (think.isEmpty(componentIdList)) return { tag_info: tagInfo, component_list: [] };
                let componentList = await this.modelComponentIns.where({ component_id: ['IN', componentIdList.map(v => v.component_id)], is_hide }).limit(componentIdList.length).select();
                if (think.isError(componentList)) throw new Error('查询组件列表失败');
                componentList = componentList.map((item) => {
                    let target = componentIdList.find(componentIdItem => componentIdItem.component_id === item.component_id);
                    item.tag_id = target ? target.tag_id : null;
                    return item;
                });
                return { tag_info: tagInfo, component_list: componentList };
            } catch (e) {
                think.logger.error(e);
                return Promise.reject(e)
            }
        });
    }

    /**
     * 获取单个组件详情
     * @param {Number} account_id
     * @param {Number} component_id
     * @returns {Promise<any>}
     */
    async getComponentById(account_id, component_id) {
        return await this.modelComponentIns
            .where({ account_id, component_id })
            .softFind()
            .catch((err) => {
                think.logger.error(err);
                return think.isError(err) ? err : new Error(err);
            });
    }


    /**
     * 更改组件可见状态
     * @param component_id
     * @param is_hide
     * @return {Promise<*>}
     */
     async changeVisible(component_id, is_hide) {
        return await this.modelComponentIns.where({ component_id }).update({ is_hide });
    }
};
