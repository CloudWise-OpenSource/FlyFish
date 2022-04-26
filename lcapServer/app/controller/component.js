'use strict';
const fs = require('fs-extra');
const AdmZip = require('adm-zip');
const path = require('path');

const BaseController = require('./base');
const CODE = require('../lib/error');
const _ = require('lodash');
const Enum = require('../lib/enum');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class ComponentsController extends BaseController {
  async updateCategory() {
    const { ctx, app, service } = this;

    const addRoleBasicInfoSchema = app.Joi.object().keys({
      categories: app.Joi.array().items({
        id: app.Joi.number(),
        name: app.Joi.string().required(),
        children: app.Joi.array().items({
          id: app.Joi.number(),
          name: app.Joi.string().required(),
        }),
      }).required(),
    });
    const { value: requestData } = ctx.validate(addRoleBasicInfoSchema, ctx.request.body);

    const categoryInfo = await service.component.updateCategoryInfo(requestData);
    if (categoryInfo.msg === 'Exists Already Components') {
      this.fail('更新失败, 删除类别中存在组件', null, CODE.FAIL);
    } else if (categoryInfo.msg === 'Exists Already Category Name') {
      this.fail('更新失败, 组件分类名称重复！', null, CODE.FAIL);
    } else if (categoryInfo.msg === 'Exists Already SubCategory Name') {
      this.fail('更新失败, 组件分类名称重复！', null, CODE.FAIL);
    } else {
      this.success('更新成功', null);
    }
  }

  async getCategoryList() {
    const { ctx, service, app } = this;
    const getListSchema = app.Joi.object().keys({
      key: app.Joi.string(),
    });
    const { key } = await getListSchema.validateAsync(ctx.request.body);
    const result = await service.component.getCategoryList(key);
    this.success('获取成功', result);
  }

  async getList() {
    const { ctx, app, service } = this;

    const getListSchema = app.Joi.object().keys({
      key: app.Joi.string(),
      name: app.Joi.string(),
      tags: app.Joi.array().items(app.Joi.string().length(24)),
      trades: app.Joi.array().items(app.Joi.string().length(24)),
      projectId: app.Joi.string().length(24),
      isLib: app.Joi.boolean(),
      developStatus: app.Joi.string(),
      type: app.Joi.string().valid(...Object.values(Enum.COMPONENT_TYPE)),
      category: app.Joi.number(),
      subCategory: app.Joi.number(),

      curPage: app.Joi.number().default(0),
      pageSize: app.Joi.number().default(10),
    });
    const { value: requestData } = ctx.validate(getListSchema, ctx.request.body);

    const componentList = await service.component.getList(requestData);
    const returnInfo = {
      total: componentList.total,
      curPage: requestData.curPage,
      pageSize: requestData.pageSize,
      list: componentList.data,
    };

    this.success('获取成功', returnInfo);
  }

  async add() {
    const { ctx, app, service } = this;

    const addComponentSchema = app.Joi.object().keys({
      name: app.Joi.string(),
      type: app.Joi.string().valid(...Object.values(Enum.COMPONENT_TYPE)),
      projects: app.Joi.array().items(app.Joi.string()),
      tags: app.Joi.array().items(app.Joi.object().keys({
        id: app.Joi.string().length(24),
        name: app.Joi.string().required(),
      })),
      category: app.Joi.number().required(),
      subCategory: app.Joi.number().required(),
      desc: app.Joi.string().allow(''),
    });
    const { value: requestData } = ctx.validate(addComponentSchema, ctx.request.body);

    const componentInfo = await service.component.addComponent(requestData);

    const errInfo = componentInfo.data.error || null;
    if (componentInfo.msg === 'Exists Already') {
      this.fail('创建失败, 组件名称已存在', errInfo, CODE.FAIL);
    } else if (componentInfo.msg === 'Init Workplace Fail') {
      this.fail('创建失败, 初始化开发空间失败', errInfo, CODE.FAIL);
    } else if (componentInfo.msg === 'Build Workplace Fail') {
      this.fail('编译失败', errInfo, CODE.FAIL);
    } else {
      this.success('创建成功', { id: _.get(componentInfo, [ 'data', 'id' ]) });
    }
  }

  async copy() {
    const { ctx, app, service } = this;

    const addComponentSchema = app.Joi.object().keys({
      name: app.Joi.string(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(addComponentSchema, ctx.request.body);

    const componentInfo = await service.component.copyComponent(id, requestData);

    const errInfo = componentInfo.data.error || null;
    if (componentInfo.msg === 'Exists Already') {
      this.fail('复制失败, 组件名称已存在', null, CODE.FAIL);
    } else if (componentInfo.msg === 'Fail') {
      this.fail('复制失败, 初始化开发空间失败', null, CODE.FAIL);
    } else if (componentInfo.msg === 'No Exists') {
      this.fail('复制失败, 复制组件不存在', null, CODE.FAIL);
    } else if (componentInfo.msg === 'Init Workplace Fail') {
      this.fail('复制失败, 复制组件空间失败', errInfo, CODE.FAIL);
    } else {
      this.success('复制成功', { id: _.get(componentInfo, [ 'data', 'id' ]) });
    }
  }

  async compile() {
    const { ctx, app, service } = this;
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);

    const componentInfo = await service.component.compileComponent(id);

    const errInfo = componentInfo.data.error || null;
    if (componentInfo.msg === 'No Exists Db') {
      this.fail('编译失败, db中不存在此组件', errInfo, CODE.FAIL);
    } else if (componentInfo.msg === 'No Exists Dir') {
      this.fail('编译失败, 组件文件不存在', errInfo, CODE.FAIL);
    } else if (componentInfo.msg === 'No Install Depend') {
      this.fail('编译失败, 请先安装依赖', errInfo, CODE.FAIL);
    } else if (componentInfo.msg === 'Compile Fail') {
      this.fail('编译失败', errInfo, CODE.FAIL);
    } else {
      this.success('编译成功', null);
    }
  }

  async installDepend() {
    const { ctx, app, service } = this;
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);

    const componentInfo = await service.component.installComponentDepend(id);

    const errInfo = componentInfo.data.error || null;
    if (componentInfo.msg === 'No Exists Db') {
      this.fail('安装失败, db中不存在此组件', errInfo, CODE.FAIL);
    } else if (componentInfo.msg === 'No Exists Dir') {
      this.fail('安装失败, 组件文件不存在', errInfo, CODE.FAIL);
    } else if (componentInfo.msg === 'Install Fail') {
      this.fail('依赖安装失败', errInfo, CODE.FAIL);
    } else {
      this.success('依赖安装成功', null);
    }
  }

  async updateInfo() {
    const { ctx, app, service } = this;

    const updateInfoSchema = app.Joi.object().keys({
      name: app.Joi.string(),
      type: app.Joi.string().valid(...Object.values(Enum.COMPONENT_TYPE)),
      projects: app.Joi.array().items(app.Joi.string()),
      tags: app.Joi.array().items(app.Joi.object().keys({
        id: app.Joi.string().length(24),
        name: app.Joi.string().required(),
      })),
      category: app.Joi.number(),
      subCategory: app.Joi.number(),
      desc: app.Joi.string().allow(''),
      dataConfig: app.Joi.object(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(updateInfoSchema, ctx.request.body);

    const updateResult = await service.component.updateInfo(id, requestData);
    const errInfo = updateResult.data.error || null;
    if (updateResult.msg === 'Exists Already') {
      this.fail('更新失败, 组件名称已存在', errInfo, CODE.FAIL);
    } else {
      this.success('更新成功', { id });
    }
  }

  async toLib() {
    const { ctx, app, service } = this;
    const updateInfoSchema = app.Joi.object().keys({
      toLib: app.Joi.boolean().required(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(updateInfoSchema, ctx.request.body);

    await service.component.toLib(id, requestData);

    this.success('更新成功', { id });
  }

  async delete() {
    const { ctx, app, service } = this;

    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const componentInfo = await service.component.delete(id);

    const errInfo = componentInfo.data.error || null;
    if (componentInfo.msg === 'Exists Already') {
      this.fail('删除失败, 该组件已经被项目应用使用', errInfo, CODE.FAIL);
    } else {
      this.success('删除成功', null);
    }
  }

  async release() {
    const { ctx, app, service } = this;

    const releaseComponentSchema = app.Joi.object().keys({
      compatible: app.Joi.boolean().required(),

      no: app.Joi.string(),
      desc: app.Joi.string().allow(''),
    });

    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(releaseComponentSchema, ctx.request.body);

    if (!requestData.compatible && !requestData.no) this.fail('组件版本不兼容旧版本，请添加版本号', null, CODE.PARAM_ERR);
    const releaseComponent = await service.component.releaseComponent(id, requestData);

    const errInfo = releaseComponent.data.error || null;
    if (releaseComponent.msg === 'Exists Already') {
      this.fail('发行版本失败, 组件版本已存在', errInfo, CODE.FAIL);
    } else if (releaseComponent.msg === 'Init Workplace Fail') {
      this.fail('发行版本失败, 初始化空间失败', errInfo, CODE.FAIL);
    } else if (releaseComponent.msg === 'Build Workplace Fail') {
      this.fail('发行版本失败, npm build失败', errInfo, CODE.FAIL);
    } else {
      this.success('发行版本成功', null);
    }
  }

  async getInfo() {
    const { ctx, app, service } = this;
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);

    const componentInfo = await service.component.getComponentInfo(id);
    if (_.isEmpty(componentInfo)) {
      this.fail('获取失败', null, CODE.FAIL);
    } else {
      this.success('获取成功', componentInfo);
    }
  }

  async uploadComponentSource() {
    const { ctx, config: { pathConfig: { staticDir, componentsPath, initComponentVersion } } } = this;
    const componentId = ctx.params.componentId;

    const file = ctx.request.files[0];
    const filename = path.basename(file.filename, '.zip');
    const uploadDir = `${staticDir}/${componentsPath}/${componentId}/${filename}_${Date.now()}`;
    const currentPath = `${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}`;
    try {
      await fs.copy(file.filepath, `${uploadDir}/${file.filename}`);
      const zip = new AdmZip(`${uploadDir}/${file.filename}`);
      zip.extractAllTo(uploadDir, true);
      const extractDir = fs.existsSync(`${uploadDir}/${filename}`);
      if (extractDir) {
        await fs.copy(`${uploadDir}/${filename}`, currentPath);
      } else {
        await fs.remove(`${uploadDir}/${file.filename}`);
        await fs.copy(uploadDir, currentPath);
      }

      const optionsJson = fs.readJSONSync(`${currentPath}/options.json`);
      const oldId = _.get(optionsJson, [ 'components', 0, 'type' ]);

      await exec(`sed -i -e "s#${oldId}#${componentId}#g" ${currentPath}/src/main.js`);
      await exec(`sed -i -e "s#${oldId}#${componentId}#g" ${currentPath}/src/setting.js`);
      await exec(`sed -i -e "s#${oldId}#${componentId}#g" ${currentPath}/options.json`);
      await exec(`sed -i -e "s#${oldId}#${componentId}#g" ${currentPath}/index.html`);
      await exec(`sed -i -e "s#${oldId}#${componentId}#g" ${currentPath}/editor.html`);

      const buildDevPath = `${currentPath}/components`;
      if (fs.pathExistsSync(buildDevPath)) {
        await exec(`sed -i -e "s#${oldId}#${componentId}#g" ${currentPath}/components/main.js`);
        await exec(`sed -i -e "s#${oldId}#${componentId}#g" ${currentPath}/components/main.js.map`);
        await exec(`sed -i -e "s#${oldId}#${componentId}#g" ${currentPath}/components/setting.js`);
        await exec(`sed -i -e "s#${oldId}#${componentId}#g" ${currentPath}/components/setting.js.map`);
      }
    } finally {
      await fs.remove(file.filepath);
      await fs.remove(uploadDir);
    }

    this.success('上传成功');
  }

  async exportComponentSource() {
    const { ctx, config: { pathConfig: { staticDir, componentsPath, initComponentVersion } } } = this;
    const componentId = ctx.params.componentId;

    const componentInfo = await ctx.model.Component._findOne({ id: componentId });
    const sourceFolder = `${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}`;
    const destZip = `${staticDir}/${componentsPath}/${componentId}/${componentInfo.name}.zip`;
    try {
      const zip = new AdmZip();
      zip.addLocalFolder(sourceFolder, '', src => {
        const dirname = src.split('/')[0];
        return dirname !== 'node_modules' && dirname !== '.git';
      });
      zip.writeZip(destZip);
      const zipName = `${componentInfo.name}.zip`;

      const data = await fs.stat(destZip);
      ctx.set('Content-Disposition', `attachment;filename=${encodeURIComponent(zipName)}`);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.set('Content-Length', data.size);
      ctx.body = fs.createReadStream(destZip);
    } finally {
      await fs.remove(destZip);
    }
  }

  async getComponentHistory() {
    const { ctx, app: { Joi }, service } = this;

    const idSchema = Joi.object().keys({
      id: Joi.string().length(24).required(),
    });
    const { id } = await idSchema.validateAsync(ctx.params);

    const historySchema = Joi.object().keys({
      curPage: Joi.number().required(),
      pageSize: Joi.number().required(),
    });
    const query = await historySchema.validateAsync(ctx.query);
    const res = await service.component.getComponentHistory({ id, ...query });
    this.success('成功', res);
  }

  async getCommitInfo() {
    const { ctx, app: { Joi }, service } = this;

    const idSchema = Joi.object().keys({
      id: Joi.string().length(24).required(),
    });
    const { id } = await idSchema.validateAsync(ctx.params);

    const historySchema = Joi.object().keys({
      hash: Joi.string().required(),
    });
    const query = await historySchema.validateAsync(ctx.query);

    const res = await service.component.getCommitInfo({ id, ...query });
    ctx.set('content-type', 'text/html');
    ctx.body = res;
  }
}

module.exports = ComponentsController;

