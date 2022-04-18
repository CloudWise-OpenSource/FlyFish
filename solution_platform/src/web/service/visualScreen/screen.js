const path = require('path');
const fs = require('async-file');
const EnumWebResourcePath = require('../../../common/constants/app/visual/EnumVisualScreen').EnumWebResourcePath;
const getInitScreenOptionsConf = require('../../../common/constants/app/visual/EnumVisualScreen').getInitScreenOptionsConf;
const mkScreenId = require('../../../common/constants/app/visual/EnumVisualScreen').mkScreenId;
const _ = require("lodash");

/**
 * 格式化过滤条件
 * @param search
 * @returns {*}
 */
const formatSearchParams = (search) => {
    search = think.isEmpty(search) ? {} : JSON.parse(search);
    if (search.hasOwnProperty('name')) search.name = ['like', '%' + search.name + '%'];

    return search;
};



const checkLogoDirExist = async () => {
    const logoDirExist = await fs.exists(EnumWebResourcePath.logo);
    if (!logoDirExist) {
        await fs.mkdir(EnumWebResourcePath.logo);
    }
}

module.exports = class extends think.Service {
    constructor() {
        super();
        this.helperService = think.service('helper');
        // 大屏model实例
        this.modelScreenIns = think.model('visualScreen', {}, think.config('custom.appModules.web'));
        // 标签大屏对照表model实例
        this.modelScreenTagIns = think.model('visualScreenTagView', {}, think.config('custom.appModules.web'));
        this.modelComponentIns = think.model('visualComponents', {}, think.config('custom.appModules.web'));
    }

    /**
     * 移动大屏封面
     * @param srcPath
     * @param screen_id
     * @return {Promise<*>}
     */
    async moveScreenCover(srcPath, screen_id) {
        const targetName = screen_id + path.extname(srcPath);
        const targetCoverPath = path.resolve(EnumWebResourcePath.cover, targetName);

        const result = await this.helperService.move(srcPath, targetCoverPath).catch(e => think.isError(e) ? e : new Error(e));
        if (think.isError(result)) return result;

        return targetName;
    };

    /**
     * 移动大屏logo
     * @param srcPath
     * @param screen_id
     * @return {Promise<*>}
     */
    async moveScreenLogo(srcPath, screen_id) {
        const targetName = screen_id + path.extname(srcPath);
        const targetLogoPath = path.resolve(EnumWebResourcePath.logo, targetName);
        await checkLogoDirExist();
        const result = await this.helperService.move(srcPath, targetLogoPath).catch(e => think.isError(e) ? e : new Error(e));
        if (think.isError(result)) return result;

        return targetName;
    };


    /**
     * 复制大屏封面图片
     * @param oldCover
     * @param screen_id
     * @return {Promise<*>}
     */
    async copyScreenCover(oldCover, screen_id) {
        const targetName = screen_id + path.extname(oldCover);
        const oldCoverPath = path.resolve(EnumWebResourcePath.cover, oldCover);
        const newCoverPath = path.resolve(EnumWebResourcePath.cover, targetName);

        const result = await this.helperService.copyFile(oldCoverPath, newCoverPath).catch(e => think.isError(e) ? e : new Error(e));
        if (think.isError(result)) return result;

        return targetName;
    }


    /**
     * 复制大屏logo图片
     * @param oldLogo
     * @param screen_id
     * @return {Promise<*>}
     */
    async copyScreenLogo(oldLogo, screen_id) {
        const targetName = screen_id + path.extname(oldLogo);
        const oldLogoPath = path.resolve(EnumWebResourcePath.logo, oldLogo);
        const newLogoPath = path.resolve(EnumWebResourcePath.logo, targetName);
        await checkLogoDirExist();
        const result = await this.helperService.copyFile(oldLogoPath, newLogoPath).catch(e => think.isError(e) ? e : new Error(e));
        if (think.isError(result)) return result;

        return targetName;
    }


    /**
     * 校验大屏名称是否存在
     * @param {Number} account_id
     * @param {String} name
     * @param {Mixed} screen_id 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExistScreen(account_id, name, screen_id = null) {
        const where = { account_id, name };
        if (screen_id) where.screen_id = ['!=', screen_id];

        const result = await this.modelScreenIns.where(where).softCount().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });

        return result > 0 ? true : false;
    }

    /**
     * 添加大屏
     * @param {Number} account_id
     * @param {String} account_id
     * @param {Object} params
     * @param {String} params.name 大屏名称
     * @param {String} params.coverPath 大屏封面临时上传 path
     * @param {String} params.logoPath 大屏logo临时上传 path
     * @param {Number} params.status 大屏状态
     * @returns {Promise<*>}
     */
    async addScreen(account_id, user_id, tag_id, params) {
        const screen_id = mkScreenId();
        let cover = null, logo = null;

        console.log(params)

        // 将大屏封面转移到真实封面路径下
        if (params.coverPath) {
            cover = await this.moveScreenCover(params.coverPath, screen_id);
            if (think.isError(cover)) return cover;

        } else {
            await think.mkdir(path.resolve(EnumWebResourcePath.cover, screen_id));
            await think.mkdir(path.resolve(EnumWebResourcePath.fragment, screen_id));
        }

        if (params.logoPath) {
            logo = await this.moveScreenLogo(params.logoPath, screen_id);
            if (think.isError(logo)) {
                return logo;
            }
        }

        delete params.coverPath;
        delete params.logoPath;

        // 记录大屏信息
        Object.assign(params, {
            account_id,
            screen_id,
            cover: cover || '',
            logo: logo || '',
            create_user_id: user_id,
            options_conf: JSON.stringify(getInitScreenOptionsConf(params.name))
        });

        // 开启事务
        return await this.modelScreenIns.transaction(async () => {
            try {
                const addScreenResult = await this.modelScreenIns.add(params);
                if (think.isError(addScreenResult)) Promise.reject(addScreenResult);
                const screenTagView = this.modelScreenTagIns.db(this.modelScreenIns.db());
                const addScreenTagResult = await screenTagView.addScreenLink({ tag_id, screen_id });
                if (think.isError(addScreenTagResult)) Promise.reject(addScreenTagResult);
                return addScreenTagResult;
            } catch (e) {
                think.logger.error(e);
                return Promise.reject(e);
            }

        });
    }

    /**
     * 获取大屏列表
     * @param {Number} account_id
     * @param {Number} user_id
     * @param {Number} page   当前分页数
     * @param {Number} pageSize  每页显示的数量
     * @param {Array | String} fields  查询字段
     * @param {Object} [search]  搜索条件
     * @param {String} order  排序条件
     * @param {Number} condition  排序方式
     * @returns {Promise<void>}
     */
    async getScreenPageList(account_id, user_id, page, pageSize = 15, fields = "*", search = {}, order, condition) {
        const where = {};
        if (account_id) {
            where.account_id = account_id;
        }
        fields = Array.isArray(fields) ? fields.join(',') : fields;
        search = think.isEmpty(search) ? {} : JSON.parse(search);
        if (search.hasOwnProperty("status"))
            where.status = search.status;
        if (search.hasOwnProperty("name"))
            where.name = ["like", "%" + search.name + "%"];
        if (search.hasOwnProperty("tagList")) {
            let tagList = search.tagList.split(",");
            if (tagList != null && Array.isArray(tagList)) {
                const screenTagView = this.modelScreenTagIns.db(
                    this.modelScreenIns.db()
                );
                const componentIdList = await screenTagView.getScreenList(
                    tagList
                );
                if (think.isError(componentIdList))
                    throw new Error("查询列表失败");
                if (!think.isEmpty(componentIdList)) {
                    where["screen_id"] = [
                        "IN",
                        componentIdList.map((v) => v.screen_id),
                    ];
                } else {
                    where["screen_id"] = null;
                }
            }
        }
        const orderCondition = ['updated_at DESC'];
        if (order) {
            orderCondition.unshift(`${order} ${!condition ? 'ASC' : 'DESC'}`);
        }
        const result = await this.modelScreenIns.where(where).field(fields).order(orderCondition).page(page, pageSize).softCountSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });

        let resultUserList = [];
        result.data.forEach((item) => {
          if (
            !think.isEmpty(item.create_user_id) &&
            resultUserList.indexOf(item.create_user_id) === -1
          ) {
            resultUserList.push(item.create_user_id);
          }
          if (
            !think.isEmpty(item.developing_user_id) &&
            resultUserList.indexOf(item.developing_user_id) === -1
          ) {
            resultUserList.push(item.developing_user_id);
          }
        });
        const userService = think.service("rbac/user");
        let userInfoList = resultUserList.length > 0 ? await userService.getUserList(resultUserList) : [];

        result.data = result.data.map((item => {
            item.is_lock = !think.isEmpty(item.developing_user_id) ? item.developing_user_id != user_id : true;
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
            if (item.developing_user_id) {
              const updateUserInfo = userInfoList.find(
                (user) => user.user_id === item.developing_user_id
              );
              if (!think.isEmpty(updateUserInfo)) {
                item.developing_user_name = updateUserInfo.user_name;
              }
            }
            return item;
        }));

        return result;
    }

    /**
     * 获取单个大屏详情
     * @param {Number} account_id
     * @param {Number} screen_id
     * @param {Array | String} fields
     * @returns {Promise<any>}
     */
    async getScreenById(account_id, screen_id, fields = "*") {
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        const where = account_id ? { account_id, screen_id } : { screen_id };

        return await this.modelScreenIns.where(where).field(fields).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 更新大屏
     * @param {Number} account_id
     * @param {Number} screen_id
     * @param {String} tag_id
     * @param {Object} data
     * @param {String} [data.name]  大屏名称
     * @param {String} data.coverPath 大屏封面临时上传 path
     * @param {String} data.logoPath 大屏logo临时上传 path
     * @param {Number} data.status 大屏状态
     * @returns {Promise<void>}
     */
    async updateScreen(account_id, screen_id, tag_id, data = {}) {
        let cover = null, logo = null;
        const screenInfo = await this.getScreenById(account_id, screen_id);

        if (data.coverPath) {
            cover = await this.moveScreenCover(data.coverPath, screen_id);
            if (think.isError(cover)) return cover;

            const oldCover = screenInfo.cover;
            // 删除以前的封面
            if (!this.helperService.lodash.isEmpty(oldCover) && oldCover !== cover) {
                const oldCoverPath = path.resolve(EnumWebResourcePath.cover, oldCover);
                if (await fs.exists(oldCoverPath)) {
                    await fs.delete(oldCoverPath);
                }
            }
        }

        if (data.logoPath) {
            const oldLogo = screenInfo.logo;

            logo = await this.moveScreenLogo(data.logoPath, screen_id);
            if (think.isError(logo)) return logo;

            // 删除以前的logo
            if (!this.helperService.lodash.isEmpty(oldLogo) && oldLogo !== logo) {
                const oldLogoPath = path.resolve(EnumWebResourcePath.logo, oldLogo);
                if (await fs.exists(oldLogoPath)) {
                    await fs.delete(oldLogoPath);
                }
            }
        }

        delete data.coverPath;
        delete data.logoPath;

        if (cover) data.cover = cover;
        if (logo) data.logo = logo;
        if (screenInfo.options_conf) {
            let options_conf = JSON.parse(screenInfo.options_conf);
            if (this.helperService.lodash.isPlainObject(options_conf.options) && options_conf.options.hasOwnProperty('name')) {
                options_conf.options.name = data.name;
                data.options_conf = JSON.stringify(options_conf);
            }
        }

        return await this.modelScreenIns.transaction(async () => {
            try {
                const updateScreenResult = await this.modelScreenIns.where({ account_id, screen_id }).update(data);
                if (think.isError(updateScreenResult)) return Promise.reject(updateScreenResult);
                const screenTagView = this.modelScreenTagIns.db(this.modelScreenIns.db());
                const prevScreenTagInfo = await screenTagView.getScreenLink(screen_id);
                let updateScreenTagResult = null;
                if (think.isEmpty(prevScreenTagInfo)) {
                    // 兼容旧数据
                    updateScreenTagResult = await screenTagView.addScreenLink({ screen_id, tag_id })
                } else {
                    updateScreenTagResult = await screenTagView.updateScreenLink({ screen_id, tag_id });
                }
                if (think.isError(updateScreenTagResult) || think.isEmpty(updateScreenTagResult)) return Promise.reject(updateScreenTagResult);
                return updateScreenTagResult;
            } catch (e) {
                think.logger.error(e);
                return Promise.reject(e)
            }
        });
    }

    /**
     * 删除大屏
     * @param {Number} account_id
     * @param {Array} screen_ids
     * @returns {Promise<void>}
     */
    async delScreen(account_id, screen_ids) {
        return await this.modelScreenIns.transaction(async () => {
            try {
                const screenDeleteResult = await this.modelScreenIns.where({ account_id, screen_id: ['IN', screen_ids] }).softDel();
                if (think.isError(screenDeleteResult)) return Promise.reject(screenDeleteResult);
                const screenTagView = this.modelScreenTagIns.db(this.modelScreenIns.db());
                const screenTagDeleteResult = await screenTagView.deleteScreenLink(screen_ids);
                if (think.isError(screenTagDeleteResult)) return Promise.reject(screenTagDeleteResult);
                return screenTagDeleteResult;
            } catch (e) {
                think.logger.error(e);
                return Promise.reject(e);
            }
        });
    }

    /**
     * 解锁大屏
     * @param {Number} account_id
     * @param {Array} screen_id
     * @returns {Promise<void>}
     */
    async unlockScreen(account_id, screen_id) {
        return await this.modelScreenIns.where({ account_id, screen_id }).update({ developing_user_id: "" }).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 保存大屏配置
     * @param {Number} account_id
     * @param {String} developing_user_id
     * @param {String} screen_id
     * @param {Object} options_conf
     * @return {Promise<number>}
     */
    async saveScreenOptionsConf(account_id, developing_user_id, screen_id, options_conf) {
        let data = {
          developing_user_id,
          options_conf: JSON.stringify(options_conf),
        };
        const { create_user_id } = await this.getScreenById(account_id, screen_id, "create_user_id");
        if (think.isEmpty(create_user_id)) {
          data.create_user_id = developing_user_id;
        }
        return await this.modelScreenIns.where({ account_id, screen_id }).update(data).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 保存上传的图片
     * @param account_id
     * @param screen_id
     * @param srcPath
     * @return {Promise<*>}
     */
    async saveUploadImg(account_id, screen_id, srcPath) {
        const targetName = this.helperService.uuid.v1() + path.extname(srcPath);
        const fragmentScreenIdDir = path.resolve(EnumWebResourcePath.fragment, screen_id);
        if (!await fs.exists(fragmentScreenIdDir)) {
            await fs.mkdir(fragmentScreenIdDir);
        }
        const targetPath = path.resolve(fragmentScreenIdDir, targetName);

        const result = await this.helperService.move(srcPath, targetPath).catch(e => think.isError(e) ? e : new Error(e));
        if (think.isError(result)) return result;

        return EnumWebResourcePath.webFragment + '/' + screen_id + '/' + targetName;
    }

    /**
     * 删除上传的图片
     * @param account_id
     * @param screen_id
     * @param imgName
     * @return {Promise<*>}
     */
    async deleteUploadImg(account_id, screen_id, imgName) {
        const fragmentScreenIdDir = path.resolve(EnumWebResourcePath.fragment, screen_id);
        if (!await fs.exists(fragmentScreenIdDir)) {
            return;
        }
        const targetPath = path.resolve(fragmentScreenIdDir, imgName);
        if (await fs.exists(targetPath)) {
            const result = await fs.delete(targetPath);
            if (think.isError(result)) return result;
        }

        return true;
    }

    /**
     * 复制大屏
     * @param account_id
     * @param screen_old_id
     * @param {String} params.name  大屏名称
     * @param {String} params.coverPath 大屏封面临时上传 path
     * @param {String} params.logoPath 大屏logo临时上传 path
     * @param {Number} params.status 大屏状态
     * @returns {Promise<*>}
     */
    async copyScreen(account_id, user_id, screen_old_id, tag_id, params) {
        const screen_id = mkScreenId();
        let cover = null, logo = null;
        const screenInfo = await this.getScreenById(account_id, screen_old_id);
        let config = JSON.parse(screenInfo.options_conf);
        // 将大屏封面转移到真实封面路径下
        if (params.coverPath) {
            cover = await this.moveScreenCover(params.coverPath, screen_id);
            if (think.isError(cover)) return cover;

        } else if(screenInfo.cover) {
            //复制旧的大屏封面图片重新命名
            cover = await this.copyScreenCover(screenInfo.cover, screen_id);
        }

        if (params.logoPath) {
            logo = await this.moveScreenLogo(params.logoPath, screen_id);
            if (think.isError(logo)) return logo;

        } else if(screenInfo.logo) {
            //复制旧的大屏logo图片重新命名
            logo = await this.copyScreenLogo(screenInfo.logo, screen_id);
        }

        delete params.coverPath;
        delete params.logoPath;

        const fragmentScreenIdOldDir = path.resolve(EnumWebResourcePath.fragment, screen_old_id);
        const fragmentScreenIdDir = path.resolve(EnumWebResourcePath.fragment, screen_id);
        //判断原大屏和新复制的大屏是否存在片段目录,如果存在则复制目录下所有图片
        if (!await fs.exists(fragmentScreenIdDir) && await fs.exists(fragmentScreenIdOldDir)) {
            await this.helperService.copyDir(fragmentScreenIdOldDir, fragmentScreenIdDir);
            if (config.options.backgroundImage) {
                let imgPath = config.options.backgroundImage.split('/');
                config.options.backgroundImage = EnumWebResourcePath.webFragment + '/' + screen_id + '/' + imgPath[imgPath.length - 1];
            }
            if (config.components) {
                for (let i = 0; i < config.components.length; i++) {
                    if (config.components[i].type === 'system/image') {
                        let imgSrc = config.components[i].options.image.split('/');
                        config.components[i].options.image = EnumWebResourcePath.webFragment + '/' + screen_id + '/' + imgSrc[imgSrc.length - 1];
                    }
                }
            }
        }

        // 记录大屏信息
        Object.assign(params, {
            account_id,
            screen_id,
            cover: cover || '',
            logo: logo || '',
            create_user_id: user_id,
            options_conf: JSON.stringify(config)
        });

        return await this.modelScreenIns.transaction(async () => {
            try {
                const copyScreenResult = await this.modelScreenIns.add(params);
                if (think.isError(copyScreenResult)) return Promise.reject(copyScreenResult);
                const screenTagView = this.modelScreenTagIns.db(this.modelScreenIns.db());
                const copyScreenTagResult = await screenTagView.addScreenLink({ screen_id, tag_id });
                if (think.isError(copyScreenTagResult)) return Promise.reject(copyScreenTagResult);
                return copyScreenTagResult;
            } catch (e) {
                think.logger.error(e);
                return Promise.reject(e);
            }
        });
    }

    /**
     * 获取大屏已删除数据
     * @param account_id
     * @param page
     * @param pageSize
     * @param fields  查询字段
     * @param search
     * @returns {Promise<T>}
     */
    async getScreenDelPageList(account_id, page, pageSize = 15, fields = "*", search = {}) {
        const where = Object.assign({ account_id }, formatSearchParams(search));
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelScreenIns.where(where).field(fields).page(page, pageSize).deletedCountSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 还原已删除大屏
     * @param account_id
     * @param screen_ids
     * @returns {Promise<*>}
     */
    async undoDelScreen(account_id, screen_ids) {
        return await this.modelScreenIns.where({ account_id, screen_id: ['IN', screen_ids] }).undoDel().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }
    /**
     * 下载大屏文件
     * @param account_id
     * @param screen_id
     * @param conf
     * @returns {Promise<*>}
     */
    async downloadScreenCode(account_id, screen_id, conf = {}) {
        const screenDownloadPath = path.resolve(EnumWebResourcePath.screenBuildPath);
        const screenTpl = path.resolve(think.ROOT_PATH, "template/screen_tpl");
        //清空文件夹
        this.helperService.delDir(screenDownloadPath);
        const configPath = path.resolve(EnumWebResourcePath.screenBuildPath, "config");
        if (!(await fs.exists(screenDownloadPath))) {
            await fs.mkdir(screenDownloadPath, { recursive: true });
        }
        if (!(await fs.exists(configPath))) {
            await fs.mkdir(configPath, { recursive: true });
        }
        fs.writeFile(path.resolve(configPath, "env.conf.json"), JSON.stringify(conf), function (err) {
            if (err) {
                return console.error(err);
            }
        });
        let ENVGlobalOptions = "";
        try {
            ENVGlobalOptions = JSON.stringify(
                conf.options.ENVGlobalOptions || {}
            );
        } catch {
            ENVGlobalOptions = "{}";
        }
        if (ENVGlobalOptions === "") {
            ENVGlobalOptions = "{}";
        }
        await fs.writeFile(
            path.resolve(configPath, "env.production.js"),
            require(path.resolve(screenTpl, "config/env.js"))({
                globalOptions: ENVGlobalOptions,
            }),
            function (err) {
                if (err) {
                    return console.error(err);
                }
            }
        );

        // copy下载的config 到 config文件夹
        await this.helperService.copyFile(
            path.resolve(
                EnumWebResourcePath.screenBuildPath,
                "../../template/screen_local_index.html"
            ),
            path.resolve(screenDownloadPath, "index.html")
        );
        await this.helperService.copyDir(
            path.resolve(
                EnumWebResourcePath.screenBuildPath,
                path.resolve(think.config("custom.wwwDirPath"), 'static/big_screen/public')
            ),
            path.resolve(screenDownloadPath, "public")
        );
        await this.helperService.copyDir(
            path.resolve(
                EnumWebResourcePath.screenBuildPath,
                path.resolve(think.config("custom.wwwDirPath"), 'static/big_screen/asserts')
            ),
            path.resolve(screenDownloadPath, "asserts")
        );
        const uploadImagePath = path.resolve(EnumWebResourcePath.screenBuildPath, `upload/screen/fragment/${screen_id}`)
        if (!(await fs.exists(uploadImagePath))) {
            await fs.mkdir(uploadImagePath, { recursive: true });
        }

        // 判断一下是否存在碎片地址
        const copyFragmentPath = path.resolve(EnumWebResourcePath.screenBuildPath, `${think.config("custom.wwwDirPath")}/upload/screen/fragment/${screen_id}`);
        if (await fs.exists(copyFragmentPath)) {
            await this.helperService.copyDir(
                copyFragmentPath,
                uploadImagePath
            );
        }

        if (Array.isArray(conf.components)) {
            const componentNames = _.uniq(
                conf.components.map((component) => component.type)
            );
            const componentsPath = path.resolve(EnumWebResourcePath.screenBuildPath, "components");

            if (!(await fs.exists(componentsPath))) {
                await fs.mkdir(componentsPath, { recursive: true });
            }
            for (let i = 0; i < componentNames.length; i++) {
                await this.helperService.copyDir(
                    path.resolve(
                        think.config("custom.wwwDirPath"),
                        `static/public_visual_component/${account_id}/${componentNames[i]}`
                    ),
                    path.resolve(componentsPath, componentNames[i])
                );
            }
        }

        const filepath = path.resolve(EnumWebResourcePath.screenBuildPath, `../screen.zip`);
        const result = await this.helperService.zip(screenDownloadPath, filepath);
        if (think.isError(result)) return result;
        return filepath;
    }

    async downloadScreenSource(screen_id, conf) {
        const screenSourcePath = path.resolve(EnumWebResourcePath.screenSourcePath);
        const screenSourceTemplatePath = path.resolve(EnumWebResourcePath.screenSourceTemplatePath);
        const screenTpl = path.resolve(think.ROOT_PATH, "template/screen_tpl");

        await this.helperService.delDir(screenSourcePath);
        if (!(await fs.exists(screenSourcePath))) {
            await fs.mkdir(screenSourcePath, { recursive: true });
        }
        await this.helperService.copyDir(screenSourceTemplatePath, screenSourcePath);

        const configPath = path.resolve(EnumWebResourcePath.screenSourcePath, "public/config");

        if (!(await fs.exists(configPath))) {
            await fs.mkdir(configPath, { recursive: true });
        }
        await fs.writeFile(path.resolve(configPath, "env.conf.json"), JSON.stringify(conf));
        let ENVGlobalOptions = "";
        try {
            ENVGlobalOptions = JSON.stringify(
                conf.options.ENVGlobalOptions || {}
            );
        } catch {
            ENVGlobalOptions = "{}";
        }
        if (ENVGlobalOptions === "") {
            ENVGlobalOptions = "{}";
        }
        await fs.writeFile(
            path.resolve(configPath, "env.production.js"),
            require(path.resolve(screenTpl, "config/env.js"))({
                globalOptions: ENVGlobalOptions,
            }),
            function (err) {
                if (err) {
                    return console.error(err);
                }
            }
        );

        await this.helperService.copyFile(
            path.resolve(
                screenTpl,
                "../screen_local_index.html"
            ),
            path.resolve(screenSourcePath, "public/index.html")
        );

        const publicPath = path.resolve(screenSourcePath, "public/public");
        if (!(await fs.exists(publicPath))) {
            await fs.mkdir(publicPath, { recursive: true });
        }

        await this.helperService.copyFile(
            path.resolve(think.config("custom.wwwDirPath"), 'static/big_screen/public/data-vi.js'),
            path.resolve(publicPath, "data-vi.js")
        );
        
        const uploadImagePath = path.resolve(screenSourcePath, `public/upload/screen/fragment/${screen_id}`)
        if (!(await fs.exists(uploadImagePath))) {
            await fs.mkdir(uploadImagePath, { recursive: true });
        }
        const copyFragmentPath = path.resolve(`${think.config("custom.wwwDirPath")}/upload/screen/fragment/${screen_id}`);
        if (await fs.exists(copyFragmentPath)) {
            await this.helperService.copyDir(
                copyFragmentPath,
                uploadImagePath
            );
        }

        if (Array.isArray(conf.components)) {
            const componentNames = _.uniq(
                conf.components.map((component) => component.type)
            );
            const componentsPath = path.resolve(screenSourcePath, "src/components");
            const where = {component_mark: ['IN', componentNames]};
            const fields = 'component_mark,org_mark';
            const orgInfos = await this.modelComponentIns.where(where).field(fields).softSelect().catch(err => {
                think.logger.error(err);
                return think.isError(err) ? err : new Error(err);
            })

            const compDependencies = {};
            for (let i = 0; i < componentNames.length; i++) {
                const org = _.find(orgInfos, {component_mark: componentNames[i]});
                if (!org) continue;

                const componentFromSrc = path.resolve(
                    think.config("custom.vcWwwDirPath"),
                    `static/dev_visual_component/dev_workspace/${org.org_mark}/${componentNames[i]}/src`
                )
                const fromStat = await fs.stat(componentFromSrc).catch(e => think.isError(e) ? e : new Error(e));
                if (think.isError(fromStat)) continue;

                const componentTargetSrc = path.resolve(componentsPath, componentNames[i], 'src');
                await fs.mkdir(componentTargetSrc, { recursive: true });
                await this.helperService.copyDir(componentFromSrc, componentTargetSrc).catch(e => console.error(e));

                const packagePath = path.resolve(think.config("custom.vcWwwDirPath"), `static/dev_visual_component/dev_workspace/${org.org_mark}/${componentNames[i]}/package.json`);

                const packageData = JSON.parse(await fs.readFile(packagePath, {encoding: 'utf8'}));
                Object.assign(compDependencies, packageData.dependencies);
            }

            const templatePackage = JSON.parse(await fs.readFile(path.resolve(screenSourcePath, 'package.json'), {encoding: 'utf8'}));
            Object.assign(templatePackage.dependencies, compDependencies);
            await fs.writeFile(path.resolve(screenSourcePath, 'package.json'), JSON.stringify(templatePackage));

            const webpackDevPath = path.resolve(screenSourcePath, 'webpack.config.dev.js');
            const webpackBuildPath = path.resolve(screenSourcePath, 'webpack.config.build.js');
            const webpackDev = await fs.readFile(webpackDevPath, {encoding: 'utf8'});
            const webpackBuild = await fs.readFile(webpackBuildPath, {encoding: 'utf8'});

            const componentConfig = {};
            componentNames.forEach(name => {
                componentConfig[`${name}/main`] = `./src/components/${name}/src/main.js`
            });

            const newWebpackDev = webpackDev.replace('entry: {}', `entry: ${JSON.stringify(componentConfig)}`);
            await fs.writeFile(webpackDevPath, newWebpackDev);
            const newWebpackBuild = webpackBuild.replace('entry: {}', `entry: ${JSON.stringify(componentConfig)}`);
            await fs.writeFile(webpackBuildPath, newWebpackBuild);
        }


        const outputPath = path.resolve(screenSourcePath, `../screen_source.zip`);
        const result = await this.helperService.zip(screenSourcePath, outputPath);
        if (think.isError(result)) return result;
        return outputPath;
    }
}