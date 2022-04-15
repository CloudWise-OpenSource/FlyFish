'use strict';
const Service = require('egg').Service;
const _ = require('lodash');
const fs = require('fs');
const fsExtra = require('fs-extra');
const jwt = require('jsonwebtoken');

const Enum = require('../lib/enum');

class ApplicationService extends Service {
  async create(params) {
    const { ctx, logger, config: { pathConfig: { defaultApplicationCoverPath }, services: { yapi } } } = this;
    const userInfo = ctx.userInfo;

    const returnData = { msg: 'ok', data: {} };

    const existsApplication = await ctx.model.Application._findOne({ name: params.name, status: Enum.COMMON_STATUS.VALID });
    if (!_.isEmpty(existsApplication)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    const tagData = await this.getTagData(params);
    const result = await ctx.model.Application._create(Object.assign(
      params,
      tagData,
      {
        cover: defaultApplicationCoverPath,
        creator: userInfo.userId,
        updater: userInfo.userId,
      }
    ));
    returnData.data = result;

    try {
      const payLoad = { username: userInfo.username };
      const authorizationToken = jwt.sign(payLoad, yapi.tokenEncryptionKey, { expiresIn: '1h' });
      // 同步yapi
      await ctx.http.post(
        `${yapi.baseURL}/api/app`,
        {
          name: params.name,
          desc: '',
          origin_id: result.id,
          from: 'flyfish',
          authorizationToken,
        }
      );
    } catch (error) {
      logger.error(`${result.id} create access app error: ${JSON.stringify(error)}`);
    }

    return returnData;
  }

  async install(params) {
    const { ctx, logger, config: { specialId, pathConfig: { initComponentVersion, defaultApplicationCoverPath }, services: { yapi } } } = this;
    const userInfo = ctx.userInfo;

    const returnData = { msg: 'ok', data: {} };

    const existsApplication = await ctx.model.Application._findOne({ name: params.name, status: Enum.COMMON_STATUS.VALID });
    if (!_.isEmpty(existsApplication)) {
      returnData.msg = 'Exists Already';
      returnData.data = existsApplication;
      return returnData;
    }

    const pages = [{
      id: ctx.helper.createUUID(),
      options: {
        name: '数据可视化大屏幕',
        width: params.width,
        height: params.height,
        scaleMode: 'width',
        css: '.dv-component{\n    overflow:unset;\n}',
        backgroundColor: '#F4F4F4',
        backgroundImage: '',
        backgroundRepeat: false,
        componentApiDomain: '',
        ENVGlobalOptions: {},
        faviconIocImage: '',
      },
      components: [],
      dataSources: [],
      events: [{
        action: 'callComponentMethod',
        name: 'dodb-params-change',
        options: {
          args: [ 'dodb-params-change' ],
          component: [],
          method: 'trigger',
        },
        source: [],
        type: 'dodb-params-change',
      }],
      functions: [],
    }];
    const componentIds = _.uniq((params.metrics || []).map(metric => metric.componentId));
    const components = await ctx.model.Component._find({ id: { $in: componentIds } });

    for (const metric of params.metrics) {
      const { key, name, unit, componentId, dataSource, location: { x, y, width, height } } = metric;
      const curComponent = components.find(component => componentId === component.id);
      if (_.isEmpty(curComponent)) continue;

      const componentUuid = ctx.helper.createUUID();
      pages[0].components.push({
        type: componentId,
        id: componentUuid,
        config: {
          name,
          left: x,
          top: y,
          width,
          height,
          visible: true,
          index: (specialId.componentId1 === componentId) ? 100 : 0,
        },
        options: {
          metricKey: key,
          metricName: name,
          unit,
        },
        connects: {},
        version: _.get(curComponent, [ 'versions', (curComponent.versions || []).length - 1, 'no' ], initComponentVersion),
        dataSource,
      });

      if (specialId.componentId1 === componentId) {
        pages[0].events[0].source.push(`component::${componentUuid}`);
      } else {
        pages[0].events[0].options.component.push(componentUuid);
      }
    }

    let internalProjectInfo = await ctx.model.Project._findOne({ isInternal: true, status: Enum.COMMON_STATUS.VALID });
    if (_.isEmpty(internalProjectInfo)) {
      const createInfo = await ctx.service.project.create({ isInternal: true, name: '监控中心专用项目', trades: [{ name: '监控中心专用项目' }], desc: '此项目用于存放和渲染监控中心的仪表盘，该项目不可删除' });
      internalProjectInfo = createInfo.data;
    }

    const result = await ctx.model.Application._create(Object.assign(
      params,
      {
        projectId: internalProjectInfo.id,
        isLib: _.isBoolean(params.isLib) ? params.isLib : true,
        isFromDoma: !!params.isMonitor,
        isFromDocc: !!params.modelId,
        cover: defaultApplicationCoverPath,
        pages,
        models: params.models,
        creator: userInfo.userId,
        updater: userInfo.userId,
      }
    ));
    returnData.data = result;

    try {
      const payLoad = { username: userInfo.username };
      const authorizationToken = jwt.sign(payLoad, yapi.tokenEncryptionKey, { expiresIn: '1h' });
      // 同步yapi
      await ctx.http.post(
        `${yapi.baseURL}/api/app`,
        {
          name: params.name,
          desc: '',
          origin_id: result.id,
          from: 'flyfish-install-application',
          authorizationToken,
        }
      );
    } catch (error) {
      logger.error(`${result.id} create access app error: ${JSON.stringify(error)}`);
    }

    return returnData;
  }

  async getTagData(params) {
    const { ctx } = this;

    const newTagNames = (params.tags || []).filter(item => !item.id);
    const existTags = await ctx.model.Tag._find({ name: { $in: newTagNames.map(item => item.name) }, status: Enum.COMMON_STATUS.VALID, type: Enum.TAG_TYPE.APPLICATION });
    const needInsertTags = newTagNames.filter(item => !existTags.some(tag => tag.name === item.name));

    let insertedTags = [];
    if (!_.isEmpty(needInsertTags)) {
      const insertData = needInsertTags.map(item => ({ type: Enum.TAG_TYPE.APPLICATION, name: item.name }));
      insertedTags = await ctx.model.Tag._create(insertData);
    }

    return {
      tags: [
        ...(params.tags || []).filter(item => item.id).map(item => item.id), // 前端传进来的带id的
        ...existTags.map(item => item.id), // 前端传进来无id的，但库里已存在的
        ...insertedTags.map(item => item.id) ], // 前端传进来无id的，新创建的
    };
  }

  async updateBasicInfo(id, requestData) {
    const { ctx, logger, config: { services: { yapi } } } = this;

    const userInfo = ctx.userInfo;
    const { type, name, developStatus, projectId, isLib, isRecommend, status, tags } = requestData;
    const returnData = { msg: 'ok', data: {} };

    const curApplication = await ctx.model.Application._findOne({ id });
    const curApplicationProjectInfo = await ctx.model.Project._findOne({ id: curApplication.projectId });
    if (curApplicationProjectInfo.isInternal && curApplication.isLib) {
      returnData.msg = 'No Auth';
      return returnData;
    }

    const updateData = {
      updater: userInfo.userId,
    };

    if (name) {
      const existsApplication = await ctx.model.Application._findOne({ id: { $ne: id }, name, status: Enum.COMMON_STATUS.VALID });
      if (!_.isEmpty(existsApplication)) {
        returnData.msg = 'Exists Already';
        return returnData;
      }
      updateData.name = name;
    }

    if (status) updateData.status = status;
    if (type) updateData.type = type;
    if (projectId) updateData.projectId = projectId;
    if (developStatus) updateData.developStatus = developStatus;
    if (_.isBoolean(isLib)) updateData.isLib = isLib;
    if (_.isBoolean(isRecommend)) updateData.isRecommend = isRecommend;
    if (_.isArray(tags)) {
      const tagData = await this.getTagData(requestData);
      updateData.tags = tagData.tags;
    }

    await ctx.model.Application._updateOne({ id }, updateData);

    try {
      if (name || status) {
        const payLoad = {
          username: userInfo.username,
        };
        const authorizationToken = jwt.sign(payLoad, yapi.tokenEncryptionKey, { expiresIn: '1h' });

        // 同步yapi
        const bodyInfo = { authorizationToken };
        if (name) bodyInfo.name = name;
        if (status) bodyInfo.status = status;

        await ctx.http.put(
          `${yapi.baseURL}/api/app/edit?origin_id=${id}`,
          bodyInfo
        );
      }
    } catch (error) {
      logger.error(`${id} delete app error: ${JSON.stringify(error)}`);
    }

    return returnData;
  }

  async updateDesignInfo(id, requestData) {
    const { ctx, config } = this;
    const { pages } = requestData;
    const { specialId, pathConfig: { staticDir, applicationPath } } = config;

    const curApplicationInfo = await ctx.model.Application._findOne({ id });
    const returnData = { msg: 'ok', data: {} };

    if (curApplicationInfo.isFromDoma) {
      for (const page of pages) {
        const components = page.components || [];
        for (const component of components) {
          if ((component.type !== specialId.componentId1) && _.isEmpty(_.get(component, [ 'dataSource', 'options', 'customOptions', 'ciInfo' ]))) {
            returnData.msg = 'Params Error';
            returnData.data = { error: '资源ci必传' };
            return returnData;
          }
        }
      }
    }

    const updateData = {};
    if (!_.isEmpty(pages)) updateData.pages = pages;
    await ctx.model.Application._updateOne({ id }, updateData);

    const curApplicationUseComponents = _.flatten((curApplicationInfo.pages || []).map(page => (page.components || []).map(component => component.type)));
    const updateApplicationUseComponents = _.flatten((pages || []).map(page => (page.components || []).map(component => component.type)));
    const deleteComponentIds = _.difference(curApplicationUseComponents, updateApplicationUseComponents).filter(id => id.length === 24);
    const addComponentIds = _.difference(updateApplicationUseComponents, curApplicationUseComponents).filter(id => id.length === 24);

    if (!_.isEmpty(deleteComponentIds)) {
      for (const deleteComponentId of deleteComponentIds) {
        await ctx.model.Component._updateOne({ id: deleteComponentId }, { $pull: { applications: id } });
      }
    }

    if (!_.isEmpty(addComponentIds)) {
      for (const addComponentId of addComponentIds) {
        await ctx.model.Component._updateOne({ id: addComponentId }, { $addToSet: { applications: id } });
      }
    }

    // note: async screenshot component cover, no wait!!!!!
    const savePath = `${staticDir}/${applicationPath}/${id}/cover.jpeg`;
    const options = {
      width: _.get(pages, [ 0, 'options', 'width' ], '1920'),
      height: _.get(pages, [ 0, 'options', 'height' ], '1080'),
    };
    this.genCoverImage(id, savePath, options);

    return returnData;
  }

  async copyApplication(id, applicationInfo) {
    const { ctx, logger, config } = this;
    const { pathConfig: { staticDir, applicationPath, defaultApplicationCoverPath }, services: { yapi } } = config;


    const userInfo = ctx.userInfo;
    const returnData = { msg: 'ok', data: {} };

    const copyApplication = await ctx.model.Application._findOne({ id, status: Enum.COMMON_STATUS.VALID });
    if (_.isEmpty(copyApplication)) {
      returnData.msg = 'No Exists';
      return returnData;
    }

    const existsApplications = await ctx.model.Application._findOne({ name: applicationInfo.name, status: Enum.COMMON_STATUS.VALID });
    if (!_.isEmpty(existsApplications)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    const tagData = await this.getTagData(applicationInfo);

    const createInfo = {
      name: applicationInfo.name,
      projectId: applicationInfo.projectId || copyApplication.projectId,
      tags: tagData.tags,

      type: copyApplication.type,
      category: copyApplication.category,
      cover: defaultApplicationCoverPath,
      developStatus: copyApplication.developStatus,
      pages: copyApplication.pages,
      status: copyApplication.status,
      models: copyApplication.models,

      creator: userInfo.userId,
      updater: userInfo.userId,
    };

    const result = await ctx.model.Application._create(createInfo);
    returnData.data.id = result.id;

    if (fs.existsSync(`${staticDir}/${applicationPath}/${id}`)) {
      await fsExtra.copy(`${staticDir}/${applicationPath}/${id}`, `${staticDir}/${applicationPath}/${result.id}`);
      (copyApplication.pages || []).forEach(page => {
        if (page.options && page.options.backgroundImage) page.options.backgroundImage = page.options.backgroundImage.replace(/applications\/\w{24}\/(.*)/, `applications/${result.id}/$1`);
        if (page.options && page.options.faviconIocImage) page.options.faviconIocImage = page.options.faviconIocImage.replace(/applications\/\w{24}\/(.*)/, `applications/${result.id}/$1`);
        (page.components || []).forEach(component => {
          if (component.options && component.options.image) component.options.image = component.options.image.replace(/applications\/\w{24}\/(.*)/, `applications/${result.id}/$1`);
        });
      });
      await ctx.model.Application._updateOne({ id: result.id }, { pages: copyApplication.pages });
    }

    try {
      const payLoad = {
        username: userInfo.username,
      };
      const authorizationToken = jwt.sign(payLoad, yapi.tokenEncryptionKey, { expiresIn: '1h' });

      // 同步yapi
      await ctx.http.post(
        `${yapi.baseURL}/api/app`,
        {
          name: applicationInfo.name,
          desc: '',
          origin_id: result.id,
          from: 'flyfish',
          authorizationToken,
        }
      );
    } catch (error) {
      logger.error(`${result.id} copy access app error: ${JSON.stringify(error)}`);
    }

    return returnData;
  }

  async getApplicationInfo(id) {
    const { ctx, logger, config: { services: { yapi } } } = this;
    const userInfo = ctx.userInfo;

    const applicationInfo = await ctx.model.Application._findOne({ id });
    const usersInfo = await ctx.model.User._find({ id: { $in: [ applicationInfo.creator, applicationInfo.updater ] } });
    const creatorUser = (usersInfo || []).find(user => user.id === applicationInfo.creator) || {};
    const updaterUser = (usersInfo || []).find(user => user.id === applicationInfo.updater) || {};

    let projectInfo = {};
    if (!_.isEmpty(applicationInfo.projectId)) projectInfo = await ctx.model.Project._findOne({ id: applicationInfo.projectId });
    const tagIds = applicationInfo.tags || [];
    const tagsInfo = await ctx.model.Tag._find({ id: { $in: tagIds } });

    let appKey,
      appSecret;
    try {
      const payLoad = {
        username: userInfo.username,
      };
      const authorizationToken = jwt.sign(payLoad, yapi.tokenEncryptionKey, { expiresIn: '1h' });

      // 同步yapi
      const { data: { app_key, app_secret } } = await ctx.http.get(
        `${yapi.baseURL}/api/app/detail`,
        {
          application_id: id,
          authorizationToken,
        }
      );
      appKey = app_key; appSecret = app_secret;
    } catch (error) {
      logger.error(`${id} get app_key && app_secret error: ${JSON.stringify(error)}`);
    }

    const returnInfo = {
      id: applicationInfo.id,
      name: applicationInfo.name,
      isLib: applicationInfo.isLib,
      projectInfo: {
        id: projectInfo.id || '',
        name: projectInfo.name || '',
      },
      tags: (applicationInfo.tags || []).map(tag => {
        const curTag = (tagsInfo || []).find(tagInfo => tagInfo.id === tag) || {};
        return {
          id: curTag.id || '',
          name: curTag.name || '',
        };
      }),
      pages: applicationInfo.pages || [],
      models: (applicationInfo.models || []).map(model => {
        return {
          modelInfo: model.modelInfo || {},
          ciInfos: model.ciInfos || [],
        };
      }),
      modelId: applicationInfo.modelId,
      type: applicationInfo.type,
      cover: applicationInfo.cover,
      developStatus: applicationInfo.developStatus,
      appKey,
      appSecret,

      creatorInfo: {
        id: creatorUser.id,
        username: creatorUser.username,
      },
      updaterInfo: {
        id: updaterUser.id,
        username: updaterUser.username,
      },
    };

    return returnInfo || {};
  }

  async uninstall(name) {
    const { ctx } = this;

    const applicationInfo = await ctx.model.Application._findOne({ name, status: Enum.COMMON_STATUS.VALID });
    return await deleteApplication(applicationInfo, this);
  }

  async delete(id, isMonitor) {
    const { ctx } = this;

    const applicationInfo = await ctx.model.Application._findOne({ id });
    const returnData = { msg: 'ok', data: {} };
    if (applicationInfo.isLib) {
      returnData.msg = 'No Auth';
      return returnData;
    }
    return await deleteApplication(applicationInfo, this, isMonitor);
  }

  async getList(requestData) {
    const { ctx, config: { projectWhiteList: { roleIds, authProjectId } } } = this;

    const { name, modelId, type, isMonitor, isLib, isRecommend, trades, tags, projectId, developStatus, curPage, pageSize, status } = requestData;
    const queryCond = {
      status: status ? status : Enum.COMMON_STATUS.VALID,
    };
    const users = await ctx.model.User._find({});
    const projectList = await ctx.model.Project._find({}, { _id: 1, trades: 1, is_internal: 1 });
    const tagList = await ctx.model.Tag._find();

    // 临时feature：对成员角色用户，屏蔽某些大屏应用
    const userInfo = ctx.userInfo;
    if (!roleIds.includes(userInfo.role)) queryCond.projectId = { $ne: authProjectId };

    if (name) queryCond.name = { $regex: _.escapeRegExp(name) };
    if (modelId) queryCond.modelId = modelId;
    if (developStatus) queryCond.developStatus = developStatus;
    if (projectId) queryCond.projectId = projectId;

    // 兼容监控中心获取应用逻辑，支持仅创建人看自己和模板库中的应用,后续重构
    if (isMonitor) {
      const internalProjectInfo = await ctx.model.Project._findOne({ isInternal: true, status: Enum.COMMON_STATUS.VALID });
      if (_.isEmpty(internalProjectInfo)) return { total: 0, data: [] };

      queryCond.projectId = internalProjectInfo.id;
      queryCond.$or = [{ creator: userInfo.userId }, { isLib: true }];
    }

    if (type) queryCond.type = type;
    if (_.isBoolean(isLib)) queryCond.isLib = isLib;
    if (_.isBoolean(isRecommend)) queryCond.isRecommend = isRecommend;
    if (!_.isEmpty(tags)) queryCond.tags = { $in: tags };
    if (!_.isEmpty(trades)) {
      const tradeProjects = (projectList || []).filter(project => {
        let match = true;
        for (const trade of trades) {
          if (_.isEmpty(project.trades)) {
            match = false;
            break;
          }
          if (!project.trades.includes(trade)) {
            match = false;
            break;
          }
        }
        return match;
      });
      const tradeProjectIds = (tradeProjects || []).map(project => project.id);
      if (!_.isEmpty(tradeProjectIds)) {
        queryCond.projectId = { $in: tradeProjectIds };
      } else {
        return { total: 0, data: [] };
      }
    }

    const applicationList = await ctx.model.Application._find(queryCond, { pages: 0 });

    const total = applicationList.length || 0;
    const data = _.orderBy(applicationList, [ 'updateTime' ], [ 'desc' ]).splice(curPage * pageSize, pageSize).map(application => {
      const curCreatorUser = (users || []).find(user => user.id === application.creator) || {};
      const curUpdaterUser = (users || []).find(user => user.id === application.updater) || {};
      const curProjectInfo = (projectList || []).find(project => project.id === application.projectId) || {};
      const curTags = (tagList || []).filter(tag => (application.tags || []).includes(tag.id));

      return {
        id: application.id,
        name: application.name,
        modelId: application.modelId,
        developStatus: application.developStatus,
        isRecommend: application.isRecommend || false,
        isLib: application.isLib || false,
        type: application.type,
        cover: application.cover,
        tags: (curTags || []).map(tag => {
          return {
            id: tag.id,
            name: tag.name,
          };
        }),
        projects: {
          id: curProjectInfo.id,
          name: curProjectInfo.name,
        },
        isInternal: curProjectInfo.isInternal,
        creator: curCreatorUser.username,
        updater: curUpdaterUser.username,
        updateTime: application.updateTime,
        createTime: application.createTime,
      };
    });

    return { total, data };
  }

  async getComponentList(requestData) {
    const { ctx, config: { pathConfig: { initComponentVersion } } } = this;

    const { id, name, type } = requestData;
    const applicationInfo = await ctx.model.Application._findOne({ id });

    const returnData = { msg: 'ok', data: {} };
    if (!applicationInfo.projectId) {
      returnData.msg = 'No Exists ProjectId';
      return returnData;
    }

    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
      developStatus: Enum.COMPONENT_DEVELOP_STATUS.ONLINE,
    };

    if (type === Enum.COMPONENT_TYPE.PROJECT) queryCond.projects = applicationInfo.projectId;
    if (name) queryCond.name = name;
    if (type) queryCond.type = type;

    const returnList = [];
    const componentCategories = await ctx.model.ComponentCategory._find({}, null, { sort: '-create_time', limit: 1 }) || [];
    const components = await ctx.model.Component._find(queryCond) || [];

    for (const category of _.get(componentCategories, [ 0, 'categories' ], [])) {
      const categoryInfo = { id: category.id, name: category.name, subCategories: [] };

      for (const children of category.children || []) {
        const subCategoryInfo = { id: children.id, name: children.name, components: [] };

        const curComponents = (components || []).filter(component => component.category === category.id && component.subCategory === children.id);
        subCategoryInfo.components = subCategoryInfo.components.concat(curComponents.map(component => {
          return {
            id: component.id,
            name: component.name,
            cover: component.cover,
            version: _.get(component, [ 'versions', (component.versions || []).length - 1, 'no' ], initComponentVersion),
          };
        }));

        if (_.isEmpty(subCategoryInfo.components)) continue;
        categoryInfo.subCategories.push(subCategoryInfo);
      }
      if (_.isEmpty(categoryInfo.subCategories)) continue;
      returnList.push(categoryInfo);
    }

    returnData.data = returnList;
    return returnData;
  }

  async genCoverImage(id, savePath, options) {
    const { ctx, logger, config } = this;
    const { pathConfig: { staticDir, webPath, applicationPath } } = config;

    try {
      const url = `http://${config.cluster.listen.hostname}:${config.cluster.listen.port}/${webPath}/screen/index.html?id=${id}`;

      const prePath = `${staticDir}/${applicationPath}/${id}`;
      if (!fs.existsSync(prePath)) fs.mkdirSync(prePath);

      const result = await ctx.helper.screenshot(url, savePath, options);
      if (result === 'success') {
        await ctx.model.Application._updateOne({ id }, { cover: `/${applicationPath}/${id}/cover.jpeg` });
      }
      logger.info(`${id} gen cover success!`);
    } catch (error) {
      logger.error(`${id} gen cover error: ${error || error.stack}`);
    }
  }

  async getModelList() {
    const { ctx, config } = this;
    const modelListResult = await ctx.http.get(
      `${config.services.ffPlatform.host}${config.services.ffPlatform.getModelListUrl}`,
      {},
      {
        headers: {
          authorization: `${config.services.ffPlatform.accessKeyID}:${config.services.ffPlatform.accessKeySecret}`,
        },
      }
    );
    return modelListResult;
  }

  async getModelData(params = {}) {
    const { ctx, config } = this;
    const modelDataResult = await ctx.http.post(
      `${config.services.ffPlatform.host}${config.services.ffPlatform.getModelDataUrl}`,
      params,
      {
        headers: {
          authorization: `${config.services.ffPlatform.accessKeyID}:${config.services.ffPlatform.accessKeySecret}`,
        },
      }
    );
    return modelDataResult;
  }
}

async function deleteApplication(applicationInfo, instance, isMonitor = false) {
  const { ctx, logger, config: { docpCookieConfig: { name: docpCookieName }, services: { douc, yapi } } } = instance;
  const userInfo = ctx.userInfo;

  const returnData = { msg: 'ok', data: {} };
  if (_.isEmpty(applicationInfo)) {
    returnData.msg = 'No Item';
    return returnData;
  }

  const id = applicationInfo.id;
  const isAdmin = await ctx.helper.isAdmin();
  const dashboardType = applicationInfo.isLib ? Enum.DASHBOARD_TYPE.INTERNAL : Enum.DASHBOARD_TYPE.CUSTOM;

  const curApplicationProjectInfo = await ctx.model.Project._findOne({ id: applicationInfo.projectId });
  if (curApplicationProjectInfo.isInternal && !isMonitor) {
    if (isAdmin || (userInfo.userId === applicationInfo.creator)) {
      try {
        const docpUserInfo = userInfo.username.split('-');
        const docpCookieValue = ctx.cookies.get(docpCookieName, { signed: false });

        const headers = {
          Cookie: `${docpCookieName}=${docpCookieValue}`,
          accountId: docpUserInfo[1],
          userId: docpUserInfo[2],
        };
        const { error_code, error_msg } = await ctx.http.delete(`${douc.baseURL}/gateway/monitor/api/v1/monitor/${id}`, { type: dashboardType }, { headers });

        if (error_code !== '000000') {
          logger.error(`${id} delete doma app error: ${error_msg}`);
          returnData.msg = 'Delete Doma App Error';
          return returnData;
        }
      } catch (error) {
        logger.error(`${id} delete doma app error: ${JSON.stringify(error)}`);
        returnData.msg = 'Delete Doma App Error';
        returnData.data = error;
        return returnData;
      }
    } else {
      logger.error(`${id} delete doma app error: no Auth`);
      returnData.msg = 'No Auth';
      return returnData;
    }
  }

  try {
    const payLoad = {
      username: userInfo.username,
    };
    const authorizationToken = jwt.sign(payLoad, yapi.tokenEncryptionKey, { expiresIn: '1h' });

    // 同步yapi
    await ctx.http.put(
      `${yapi.baseURL}/api/app/edit?origin_id=${id}`,
      {
        status: Enum.COMMON_STATUS.INVALID,
        authorizationToken,
      }
    );
  } catch (error) {
    logger.error(`${id} delete yai app error: ${JSON.stringify(error)}`);
  }

  await ctx.model.Application._updateOne({ id }, { status: Enum.COMMON_STATUS.INVALID });

  return returnData;
}

module.exports = ApplicationService;
