'use strict';
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const BaseController = require('./base');
const CODE = require('../lib/error');
const _ = require('lodash');
const Enum = require('../lib/enum');

class ComponentsController extends BaseController {
  async updateCategory() {
    const { ctx, app, service } = this;

    const addRoleBasicInfoSchema = app.Joi.object().keys({
      categories: app.Joi.array().items({
        id: app.Joi.number(),
        name: app.Joi.string().required(),
        from: app.Joi.string().valid(...Object.values(Enum.DATA_FROM)),
        children: app.Joi.array().items({
          id: app.Joi.number(),
          name: app.Joi.string().required(),
          from: app.Joi.string().valid(...Object.values(Enum.DATA_FROM)),
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
    } else if (categoryInfo.msg === 'No Auth') {
      this.fail('更新失败, 内置分类不允许修改！', null, CODE.FAIL);
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
      automaticCover: app.Joi.number().valid(...Object.values(Enum.SNAPSHOT_TYPE)).default(Enum.SNAPSHOT_TYPE.AUTO),
      componentCover: app.Joi.string().allow(),
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
    } else if (componentInfo.msg === 'Picture failed') {
      this.fail('图片错误', errInfo, CODE.FAIL);
    } else {
      this.success('创建成功', { id: _.get(componentInfo, [ 'data', 'id' ]) });
    }
  }

  async uploadComponentImg() {
    const { ctx, config: { pathConfig: { staticDir, tmpPath } } } = this;
    const file = ctx.request.files[0];
    const targetRelativePath = `${tmpPath}/${uuidv4()}${path.extname(file.filepath)}`;
    const targetPath = path.resolve(staticDir, targetRelativePath);

    try {
      await fs.copy(file.filepath, targetPath);
    } finally {
      await fs.remove(file.filepath);
    }
    this.success('创建成功', targetRelativePath);
  }

  async copy() {
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
      automaticCover: app.Joi.number().valid(...Object.values(Enum.SNAPSHOT_TYPE)).default(Enum.SNAPSHOT_TYPE.AUTO),
      componentCover: app.Joi.string().allow(),
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
    } else if (componentInfo.msg === 'Picture failed') {
      this.fail('图片错误', errInfo, CODE.FAIL);
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
    } else if (componentInfo.msg === 'No Auth') {
      this.fail('编译失败, 无权限', errInfo, CODE.FAIL);
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
    } else if (componentInfo.msg === 'No Auth') {
      this.fail('依赖安装失败, 无权限', errInfo, CODE.FAIL);
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
      automaticCover: app.Joi.number().valid(...Object.values(Enum.SNAPSHOT_TYPE)).default(Enum.SNAPSHOT_TYPE.AUTO),
      componentCover: app.Joi.string().allow(),
    });

    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(updateInfoSchema, ctx.request.body);


    const updateResult = await service.component.updateInfo(id, requestData);
    const errInfo = updateResult.data.error || null;
    if (updateResult.msg === 'Exists Already') {
      this.fail('更新失败, 组件名称已存在', errInfo, CODE.FAIL);
    } else if (updateResult.msg === 'Picture failed') {
      this.fail('图片错误', errInfo, CODE.FAIL);
    } else if (updateResult.msg === 'No Auth') {
      this.fail('更新失败, 无权限', errInfo, CODE.FAIL);
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

    if (componentInfo.msg === 'No Auth') {
      this.fail('删除失败, 无权限', errInfo, CODE.FAIL);
    } else if (componentInfo.msg === 'Exists Already') {
      this.fail('删除失败, 该组件被使用, 不允许删除', errInfo, CODE.FAIL);
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
    } else if (releaseComponent.msg === 'No Auth') {
      this.fail('更新失败, 无权限', errInfo, CODE.FAIL);
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

  async importSource() {
    const { ctx, app, service } = this;
    const { value: componentId } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.componentId);
    const file = ctx.request.files[0];

    const importResult = await service.component.importSource(componentId, file);
    const errInfo = importResult.data.error || null;

    if (importResult.msg === 'Import Fail') {
      this.fail('导入失败', errInfo, CODE.FAIL);
    } else if (importResult.msg === 'No Auth') {
      this.fail('更新失败, 无权限', errInfo, CODE.FAIL);
    } else {
      this.success('导入成功', null);
    }
  }

  async exportSource() {
    const { ctx, app, service } = this;
    const { value: componentId } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.componentId);

    const exportResult = await service.component.exportSource(componentId);
    const errInfo = exportResult.data.error || null;

    if (exportResult.msg === 'No Source Code') {
      this.fail('导出失败: 源码不存在, 不允许导出', errInfo, CODE.FAIL);
    } else if (exportResult.msg === 'Export Fail') {
      this.fail('导出失败', errInfo, CODE.FAIL);
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

