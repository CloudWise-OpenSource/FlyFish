'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const AdmZip = require('adm-zip');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const BaseController = require('./base');
const CODE = require('../lib/error');
const Enum = require('../lib/enum');

class ApplicationController extends BaseController {
  async create() {
    const { ctx, app: { Joi }, service } = this;

    const createSchema = Joi.object().keys({
      name: Joi.string().required(),
      projectId: Joi.string().length(24).required(),
      type: Joi.string().valid(...Object.values(Enum.APP_TYPE)).required(),
      tags: Joi.array().items(Joi.object().keys({
        id: Joi.string().length(24),
        name: Joi.string().required(),
      })),
    });
    const body = await createSchema.validateAsync(ctx.request.body);
    const applicationInfo = await service.application.create(body);

    if (applicationInfo.msg === 'Exists Already') {
      this.fail('创建失败, 应用名称已存在', null, CODE.FAIL);
    } else {
      this.success('创建成功', { id: _.get(applicationInfo, [ 'data', 'id' ]) });
    }
  }

  async editBasicInfo() {
    const { ctx, app: { Joi }, service } = this;

    const editSchema = Joi.object().keys({
      name: Joi.string(),
      type: Joi.string().valid(...Object.values(Enum.APP_TYPE)),
      tags: Joi.array().items(Joi.object().keys({
        id: Joi.string().length(24),
        name: Joi.string().required(),
      })),
      projectId: Joi.string().length(24),
      developStatus: Joi.string().valid(...Object.values(Enum.APP_DEVELOP_STATUS)),
      isRecommend: Joi.boolean(),
      status: Joi.string().valid(...Object.values(Enum.COMMON_STATUS)),
    });

    const { value: id } = ctx.validate(Joi.string().length(24).required(), ctx.params.id);
    const body = await editSchema.validateAsync(ctx.request.body);

    if (body.status === Enum.COMMON_STATUS.VALID && !body.name) {
      return this.fail('还原失败, 请重新填写应用名称', null, CODE.FAIL);
    }

    if (body.isRecommend && !await ctx.helper.isAdmin()) {
      return this.fail('更新失败, 无权限', null, CODE.FAIL);
    }

    const updateResult = await service.application.updateBasicInfo(id, body);
    if (updateResult.msg === 'Exists Already') {
      this.fail('更新失败, 应用名称已存在', null, CODE.FAIL);
    } else if (updateResult.msg === 'No Auth') {
      this.fail('更新失败： 无权限', null, CODE.FAIL);
    } else {
      this.success('编辑基础信息成功', { id });
    }
  }

  async editDesignInfo() {
    const { ctx, app: { Joi }, service } = this;

    const editSchema = Joi.object().keys({
      pages: Joi.array().items(Joi.object().keys({
        components: Joi.array().items(Joi.object().keys({
          id: Joi.string().required(),
          type: Joi.string().required(),
          version: Joi.string().required(),
        }).unknown()),
      }).unknown()).required(),
    });

    const { value: id } = ctx.validate(Joi.string().length(24).required(), ctx.params.id);
    const body = await editSchema.validateAsync(ctx.request.body);

    const designResult = await service.application.updateDesignInfo(id, body);
    if (designResult.msg === 'Params Error') {
      this.fail('编辑失败, 关联资源必传！', JSON.stringify(designResult.data), CODE.FAIL);
    } else if (designResult.msg === 'No Auth') {
      this.fail('编辑失败, 无权限！', null);
    } else {
      this.success('编辑成功', { id });
    }
  }

  async copy() {
    const { ctx, app, service } = this;

    const copyApplicationSchema = app.Joi.object().keys({
      name: app.Joi.string(),
      tags: app.Joi.array().items(app.Joi.object().keys({
        id: app.Joi.string().length(24),
        name: app.Joi.string().required(),
      })),
      projectId: app.Joi.string().length(24),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(copyApplicationSchema, ctx.request.body);

    const applicationInfo = await service.application.copyApplication(id, requestData);

    if (applicationInfo.msg === 'Exists Already') {
      this.fail('复制失败, 应用名称已存在', null, CODE.FAIL);
    } else if (applicationInfo.msg === 'No Exists') {
      this.fail('复制失败, 复制应用不存在', null, CODE.FAIL);
    } else {
      this.success('复制成功', { id: _.get(applicationInfo, [ 'data', 'id' ]) });
    }
  }

  async getInfo() {
    const { ctx, app, service } = this;
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);

    const applicationInfo = await service.application.getApplicationInfo(id);
    if (_.isEmpty(applicationInfo)) {
      this.fail('获取失败', null, CODE.FAIL);
    } else {
      this.success('获取成功', applicationInfo);
    }
  }

  async delete() {
    const { ctx, app, service } = this;

    const deleteApplicationSchema = app.Joi.object().keys({
      isMonitor: app.Joi.boolean().default(false),
    });
    const { value: deleteParams } = ctx.validate(deleteApplicationSchema, ctx.request.body);
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const deleteResult = await service.application.delete(id, deleteParams.isMonitor);

    if (deleteResult.msg === 'Delete Doma App Error') {
      this.fail('删除失败： 监控中心删除失败', JSON.stringify(deleteResult.data || null), CODE.FAIL);
    } else if (deleteResult.msg === 'No Auth') {
      this.fail('删除失败： 无权限', null, CODE.FAIL);
    } else if (deleteResult.msg === 'No Item') {
      this.fail('卸载失败： 无此应用', null, CODE.FAIL);
    } else {
      this.success('删除成功', { id });
    }
  }

  async getList() {
    const { ctx, app: { Joi }, service } = this;
    const getListSchema = Joi.object().keys({
      name: Joi.string(),
      modelId: Joi.string(),
      type: Joi.string(),
      projectId: Joi.string().length(24),
      tags: Joi.array().items(Joi.string().length(24)),
      developStatus: Joi.string(),
      isRecommend: Joi.boolean(),
      isMonitor: Joi.boolean(),
      trades: Joi.array().items(Joi.string().length(24)),
      status: Joi.string().valid(...Object.values(Enum.COMMON_STATUS)),

      curPage: Joi.number().default(0),
      pageSize: Joi.number().default(10),
    });
    const body = await getListSchema.validateAsync(ctx.request.body);

    const appList = await service.application.getList(body);

    const returnInfo = {
      total: appList.total,
      curPage: body.curPage,
      pageSize: body.pageSize,
      list: appList.data,
    };

    this.success('获取成功', returnInfo);
  }

  async getComponentList() {
    const { ctx, app: { Joi }, service } = this;
    const getListSchema = Joi.object().keys({
      id: Joi.string().length(24),
      type: Joi.string().valid(...Object.values(Enum.COMPONENT_TYPE)).required(),
      allowDataSearch: Joi.number().valid(...Object.values(Enum.COMPONENT_ALLOW_DATA_SOURCE)),
      name: Joi.string(),
    });

    const body = await getListSchema.validateAsync(ctx.request.body);
    const result = await service.application.getComponentList(body);
    if (result.msg === 'No Exists ProjectId') {
      this.fail('获取失败, 应用不属于任何项目', null, CODE.FAIL);
    } else {
      this.success('获取成功', result.data);
    }
  }

  async export() {
    const { ctx, config: { apiKey, pathConfig: { staticDir, commonPath, componentsPath, appTplPath, appBuildPath, applicationPath } } } = this;
    const id = ctx.params.id;

    const buildPath = path.resolve(staticDir, appBuildPath, id);
    const appPath = path.resolve(staticDir, applicationPath);
    const configPath = path.resolve(buildPath, 'config');

    const appInfo = await ctx.model.Application._findOne({ id });

    const appKey = null,
      appSecret = null;

    await fs.outputFile(path.resolve(configPath, 'env.conf.json'), '');
    await fs.writeJson(path.resolve(configPath, 'env.conf.json'), {
      id,
      appKey,
      appSecret,
      pages: appInfo.pages,
    });

    const mergedGlobalOptions = {};
    const targetComponentPath = path.resolve(buildPath, 'components');
    for (const page of appInfo.pages || []) {
      Object.assign(mergedGlobalOptions, page.options.ENVGlobalOptions || {});
      for (const component of page.components || []) {
        if (component.type === 'PageLink') continue;
        await fs.copy(
          path.resolve(staticDir, componentsPath, component.type, component.version, 'release'),
          path.resolve(targetComponentPath, component.type, component.version, 'release')
        );
      }
    }

    await fs.outputFile(
      path.resolve(configPath, 'env.production.js'),
      require(path.resolve(staticDir, appTplPath, 'config/env.js'))({ globalOptions: JSON.stringify(mergedGlobalOptions) })
    );

    const sourceIndexPath = path.resolve(staticDir, appTplPath, 'index.html');
    const targetIndexPath = path.resolve(staticDir, buildPath, 'index.html');

    const sourceIndex = await fs.readFile(sourceIndexPath, { encoding: 'utf8' });
    const targetIndex = sourceIndex.replace('{{apiKey}}', `'${apiKey}'`);
    await fs.writeFile(targetIndexPath, targetIndex);

    const sourcePublicPath = path.resolve(staticDir, appTplPath, 'public');
    const targetPublicPath = path.resolve(staticDir, buildPath, 'public');

    const sourceCommonPath = path.resolve(staticDir, commonPath);

    await fs.copy(`${sourceCommonPath}/data-vi.js`, `${targetPublicPath}/data-vi.js`);
    await fs.copy(`${sourceCommonPath}/editor.css`, `${targetPublicPath}/editor.css`);
    await fs.copy(`${sourceCommonPath}/editor.js`, `${targetPublicPath}/editor.js`);

    await fs.copy(sourcePublicPath, targetPublicPath);

    const sourceImgPath = path.resolve(staticDir, appPath, id);
    const targetImgPath = path.resolve(staticDir, buildPath, 'applications', id);
    const appExist = await fs.pathExists(sourceImgPath);
    if (appExist) {
      await fs.copy(sourceImgPath, targetImgPath);
    }

    const zipName = `screen_${id}.zip`;
    const destZip = `${staticDir}/${appBuildPath}/${zipName}`;
    try {
      const zip = new AdmZip();

      zip.addLocalFolder(buildPath);
      zip.writeZip(destZip);

      const data = await fs.stat(destZip);
      ctx.set('Content-Length', data.size);

      ctx.set('Content-Disposition', `attachment;filename=${zipName}`);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.body = fs.createReadStream(destZip);
    } finally {
      await fs.remove(destZip);
      await fs.remove(buildPath);
    }
  }

  async uploadApplicationImg() {
    const { ctx, app: { Joi }, config: { pathConfig: { staticDir, applicationPath } } } = this;
    const appSchema = Joi.object().keys({
      id: Joi.string().length(24).required(),
    });

    const { id } = await appSchema.validateAsync(ctx.params);
    const file = ctx.request.files[0];
    const targetRelativePath = `${applicationPath}/${id}/${uuidv4()}${path.extname(file.filepath)}`;
    const targetPath = path.resolve(staticDir, targetRelativePath);

    try {
      await fs.copy(file.filepath, targetPath);
    } finally {
      await fs.remove(file.filepath);
    }

    this.success('上传成功', targetRelativePath);
  }

  async deleteApplicationImg() {
    const { ctx, app: { Joi }, config: { pathConfig: { staticDir, applicationPath } } } = this;
    const appSchema = Joi.object().keys({
      id: Joi.string().length(24).required(),
    });
    const { id } = await appSchema.validateAsync(ctx.params);
    const { img } = ctx.query;
    const imgPath = `${staticDir}/${applicationPath}/${id}/${img}`;
    const imgExist = fs.existsSync(imgPath);
    if (imgExist) {
      await fs.remove(imgPath);
    }
    this.success('删除成功');
  }

  async exportSource() {
    const { ctx, config: { pathConfig: { staticDir, appSourceTpl, appBuildPath, applicationPath, componentsPath, commonPath, appTplPath } } } = this;
    const id = ctx.params.id;

    const appSourceTplPath = path.resolve(staticDir, appSourceTpl);
    const sourcePath = path.resolve(staticDir, appBuildPath, `${id}_source`);
    const appPath = path.resolve(staticDir, applicationPath);
    const configPath = path.resolve(sourcePath, 'public/config');

    await fs.copy(appSourceTplPath, sourcePath);

    const appInfo = await ctx.model.Application._findOne({ id });

    await fs.outputFile(path.resolve(configPath, 'env.conf.json'), '');
    await fs.writeJson(path.resolve(configPath, 'env.conf.json'), appInfo.pages);

    const mergedGlobalOptions = {};
    const compDependencies = {};
    const componentEntry = {};
    const targetComponentPath = path.resolve(sourcePath, 'src/components');

    for (const page of appInfo.pages || []) {
      Object.assign(mergedGlobalOptions, page.options.ENVGlobalOptions || {});
      for (const component of page.components || []) {
        await fs.copy(
          path.resolve(staticDir, componentsPath, component.type, component.version, 'src'),
          path.resolve(targetComponentPath, component.type, component.version, 'src')
        );

        const packagePath = path.resolve(staticDir, componentsPath, component.type, component.version, 'package.json');
        const packageData = await fs.readJson(packagePath);
        Object.assign(compDependencies, packageData.devDependencies, packageData.dependencies);

        componentEntry[`${component.type}/${component.version}/release/main`] = `./src/components/${component.type}/${component.version}/src/main.js`;
      }
    }

    await fs.outputFile(
      path.resolve(configPath, 'env.production.js'),
      require(path.resolve(staticDir, appTplPath, 'config/env.js'))({ globalOptions: JSON.stringify(mergedGlobalOptions) })
    );

    const sourceIndexPath = path.resolve(staticDir, appTplPath, 'index.html');
    const targetIndexPath = path.resolve(sourcePath, 'public/index.html');
    await fs.copy(sourceIndexPath, targetIndexPath);

    const sourceCommonPath = path.resolve(staticDir, commonPath);

    await fs.copy(`${sourceCommonPath}/data-vi.js`, `${sourcePath}/public/public/data-vi.js`);

    await fs.copy(`${appPath}/${id}`, `${sourcePath}/applications/${id}`);

    const templatePackage = await fs.readJson(`${sourcePath}/package.json`);
    Object.assign(templatePackage.dependencies, compDependencies);
    await fs.writeJson(`${sourcePath}/package.json`, templatePackage);


    const webpackDevPath = path.resolve(sourcePath, 'webpack.config.dev.js');
    const webpackBuildPath = path.resolve(sourcePath, 'webpack.config.build.js');
    const webpackDev = await fs.readFile(webpackDevPath, { encoding: 'utf8' });
    const webpackBuild = await fs.readFile(webpackBuildPath, { encoding: 'utf8' });

    const newWebpackDev = webpackDev.replace('entry: {}', `entry: ${JSON.stringify(componentEntry)}`);
    await fs.writeFile(webpackDevPath, newWebpackDev);
    const newWebpackBuild = webpackBuild.replace('entry: {}', `entry: ${JSON.stringify(componentEntry)}`);
    await fs.writeFile(webpackBuildPath, newWebpackBuild);

    const zipName = `${id}_source.zip`;
    const destZip = `${staticDir}/${appBuildPath}/${zipName}`;
    try {
      const zip = new AdmZip();

      zip.addLocalFolder(sourcePath);
      zip.writeZip(destZip);

      ctx.set('Content-Disposition', `attachment;filename=${zipName}`);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.body = fs.createReadStream(destZip);
    } finally {
      await fs.remove(destZip);
      await fs.remove(sourcePath);
    }
  }

  async getModelList() {
    const { service } = this;
    const modelListResult = await service.application.getModelList();
    if (modelListResult.msg === 'success') {
      this.success('success', modelListResult.data);
    } else {
      this.fail('error', null);
    }
  }

  async getModelData() {
    const { ctx, app: { Joi }, service } = this;
    const createSchema = Joi.object().keys({
      id: Joi.number().required(),
      vars: Joi.object(),
    });
    const body = await createSchema.validateAsync(ctx.request.body);
    const modelDataResult = await service.application.getModelData(body);
    if (modelDataResult.msg === 'success') {
      this.success('success', { data: modelDataResult.data });
    } else {
      this.fail('error', null);
    }
  }

  async exportAll() {
    const { ctx, app, config: { envMap } } = this;
    const id = ctx.params.id;

    await exec(`cd ${path.resolve(__dirname, '../../changelog')} && NODE_ENV=${envMap[app.config.env]} node scripts/downloadApp.js ${id}`);
    const destAppTar = path.resolve(__dirname, `../../changelog/download/${id}.tar`);

    try {
      ctx.set('Content-Disposition', `attachment;filename=${id}.tar`);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.body = fs.createReadStream(destAppTar);
    } finally {
      await fs.remove(destAppTar);
    }
  }
}

module.exports = ApplicationController;

