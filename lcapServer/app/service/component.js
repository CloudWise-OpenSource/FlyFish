'use strict';
const Service = require('egg').Service;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const _ = require('lodash');
const simpleGit = require('simple-git');
const Diff2html = require('diff2html');
const minify = require('html-minifier').minify;
const fsExtra = require('fs-extra');

const Enum = require('../lib/enum');

class ComponentService extends Service {
  async updateCategoryInfo(updateInfo) {
    const { ctx } = this;

    const existsCategory = await ctx.model.ComponentCategory._find({}, null, { sort: '-create_time', limit: 1 }) || [];

    const existsCategoryIds = _.flatten(_.get(existsCategory, [ 0, 'categories' ], []).map(category => (category.children || []).map(children => children.id + '')));
    const updateCategoryIds = _.flatten((updateInfo.categories || []).map(category => (category.children || []).filter(children => children.id).map(children => children.id + '')));
    const deleteCategoryIds = _.difference(existsCategoryIds, updateCategoryIds);

    const returnData = { msg: 'ok', data: {} };
    if (!_.isEmpty(deleteCategoryIds)) {
      const components = await ctx.model.Component._find({ subCategory: { $in: deleteCategoryIds }, status: Enum.COMMON_STATUS.VALID }, null, { limit: 1 }) || [];
      if (!_.isEmpty(components)) {
        returnData.msg = 'Exists Already Components';
        return returnData;
      }
    }

    const names = [];
    for (let i = 0; i < (updateInfo.categories || []).length; i++) {
      const category = updateInfo.categories[i];

      const existsName = names.find(name => name === category.name);
      if (!_.isEmpty(existsName)) {
        returnData.msg = 'Exists Already Category Name';
        return returnData;
      }
      names.push(category.name);

      if (!category.id) category.id = `${Date.now()}${i}`;
      for (let j = 0; j < (category.children || []).length; j++) {
        const subCategory = category.children[j];
        const existsName = names.find(name => name === subCategory.name);
        if (!_.isEmpty(existsName)) {
          console.log(subCategory.name);
          returnData.msg = 'Exists Already SubCategory Name';
          return returnData;
        }
        names.push(subCategory.name);

        if (!subCategory.id) subCategory.id = `${Date.now()}${i}${j}`;
      }
    }

    await ctx.model.ComponentCategory._create(updateInfo);

    return returnData;
  }

  async getCategoryList(key) {
    const { ctx } = this;

    let returnList = [];
    const list = await ctx.model.ComponentCategory._find({}, null, { sort: '-create_time', limit: 1 });
    const categories = _.get(list, [ 0, 'categories' ], []);

    returnList = categories;

    if (key) {
      returnList = [];
      for (const category of categories || []) {
        const newCategory = { name: category.name, children: [] };
        if (category.name.includes(key)) {
          newCategory.children = category.children;
          returnList.push(newCategory);
          continue;
        }

        for (const children of category.children || []) {
          if (children.name.includes(key)) {
            newCategory.children.push(children);
          }
        }
        if (_.isEmpty(newCategory.children)) continue;
        returnList.push(newCategory);
      }
    }

    return returnList;
  }

  async getList(requestData) {
    const { ctx } = this;

    let orderField = 'updateTime';
    const queryProjects = [];
    const { key, name, isLib, tags, trades, projectId, developStatus, type, category, subCategory, curPage, pageSize } = requestData;
    const queryCond = { status: Enum.COMMON_STATUS.VALID };

    const users = await ctx.model.User._find();
    const projectList = await ctx.model.Project._find();
    const tagList = await ctx.model.Tag._find();

    queryCond.$or = [];
    let matchUserIds = [];
    if (key) {
      queryCond.$or.push({ desc: { $regex: _.escapeRegExp(key) } });
      if (isLib) {
        queryCond.$or.push({ name: { $regex: _.escapeRegExp(key) } });
      } else {
        const matchUsers = (users || []).filter(user => user.username.includes(key));
        matchUserIds = matchUsers.map(user => user.id);
        if (!_.isEmpty(matchUserIds)) queryCond.$or.push({ creator: { $in: matchUserIds } });

        const matchTags = (tagList || []).filter(tag => tag.name.includes(key));
        const matchTagIds = matchTags.map(tag => tag.id);
        if (!_.isEmpty(matchTagIds)) queryCond.$or.push({ tags: { $in: matchTagIds } });
      }
    }

    if (name) queryCond.name = { $regex: _.escapeRegExp(name) };
    if (category) queryCond.category = category;
    if (subCategory) queryCond.subCategory = subCategory;
    if (developStatus) queryCond.developStatus = developStatus;
    if (type) queryCond.type = type;
    if (projectId) queryProjects.push(projectId);
    if (!_.isEmpty(tags)) queryCond.tags = { $in: tags };
    if (_.isBoolean(isLib)) {
      if (isLib) orderField = 'createTime';
      queryCond.isLib = isLib;
    }
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
        queryProjects.push(...tradeProjectIds);
      } else {
        return { total: 0, data: [] };
      }
    }
    if (!_.isEmpty(queryProjects)) queryCond.projects = { $in: queryProjects };

    if (_.isEmpty(queryCond.$or)) delete queryCond.$or;
    const componentList = await ctx.model.Component._find(queryCond);

    const total = componentList.length || 0;
    const data = _.orderBy(componentList, [ orderField ], [ 'desc' ]).splice(curPage * pageSize, pageSize).map(component => {
      const curUser = (users || []).find(user => user.id === component.creator) || {};
      const curProjects = (projectList || []).filter(project => (component.projects || []).includes(project.id));
      const curTags = (tagList || []).filter(tag => (component.tags || []).includes(tag.id));

      return {
        id: component.id,
        name: component.name,
        developStatus: component.developStatus,
        type: component.type,
        category: component.category,
        subCategory: component.subCategory,
        tags: (curTags || []).map(tag => {
          return {
            id: tag.id,
            name: tag.name,
          };
        }),
        projects: (curProjects || []).map(project => {
          return {
            id: project.id,
            name: project.name,
          };
        }),
        version: _.get(component, [ 'versions', (component.versions || []).length - 1, 'no' ], '暂未上线'),
        creator: curUser.username,
        isLib: component.isLib || false,
        cover: component.cover,
        desc: component.desc,

        updateTime: component.updateTime,
        createTime: component.createTime,
      };
    });

    return { total, data };
  }

  async getComponentInfo(id) {
    const { ctx } = this;

    const componentInfo = await ctx.model.Component._findOne({ id });
    const userInfo = await ctx.model.User._findOne({ id: componentInfo.creator });

    const projectIds = componentInfo.projects || [];
    const projectsInfo = await ctx.model.Project._find({ id: { $in: projectIds } });

    const tradeIds = [];
    let tradesInfo = [];

    for (const projectInfo of projectsInfo) {
      if (!_.isEmpty(projectInfo.trades)) tradeIds.push(...projectInfo.trades);
    }
    if (!_.isEmpty(tradeIds)) tradesInfo = await ctx.model.Trade._find({ id: { $in: tradeIds } });

    const tagIds = componentInfo.tags || [];
    const tagsInfo = await ctx.model.Tag._find({ id: { $in: tagIds } });

    const returnInfo = {
      id: componentInfo.id,
      name: componentInfo.name,
      isLib: componentInfo.isLib,
      projects: (componentInfo.projects || []).map(project => {
        const curProject = (projectsInfo || []).find(projectInfo => projectInfo.id === project) || {};
        return {
          id: curProject.id || '',
          name: curProject.name || '',
        };
      }),
      trades: (tradesInfo || []).map(trade => {
        return {
          id: trade.id || '',
          name: trade.name || '',
        };
      }),
      tags: (componentInfo.tags || []).map(tag => {
        const curTag = (tagsInfo || []).find(tagInfo => tagInfo.id === tag) || {};
        return {
          id: curTag.id || '',
          name: curTag.name || '',
        };
      }),
      versions: _.orderBy((componentInfo.versions || []).map(version => {
        return {
          no: version.no,
          desc: version.desc || '无',
          status: version.status,
          cover: version.cover,
          time: version.time && version.time.getTime(),
        };
      }), [ 'time' ], [ 'desc' ]),
      desc: componentInfo.desc,
      dataConfig: componentInfo.dataConfig || {},
      creatorInfo: {
        id: userInfo.id,
        username: userInfo.username,
      },
      developStatus: componentInfo.developStatus,
    };

    return returnInfo || {};
  }

  async addComponent(createComponentInfo) {
    const { ctx, config } = this;
    const { pathConfig: { staticDir, componentsPath, initComponentVersion, defaultComponentCoverPath } } = config;

    const userInfo = ctx.userInfo;
    const returnData = { msg: 'ok', data: {} };

    const existsComponents = await ctx.model.Component._findOne({ name: createComponentInfo.name, status: Enum.COMMON_STATUS.VALID });
    if (!_.isEmpty(existsComponents)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    const tagInfo = await this.getTagData(createComponentInfo);

    const createInfo = {
      name: createComponentInfo.name,
      category: createComponentInfo.category,
      subCategory: createComponentInfo.subCategory,
      type: createComponentInfo.type,
      projects: createComponentInfo.type === Enum.COMPONENT_TYPE.COMMON ? [] : createComponentInfo.projects,
      tags: tagInfo.tags || [],
      desc: createComponentInfo.desc || '无',
      versions: [],
      cover: defaultComponentCoverPath,
      creator: userInfo.userId,
      updater: userInfo.userId,
    };

    const result = await ctx.model.Component._create(createInfo);

    const componentId = result.id;
    returnData.data.id = componentId;

    try {
      await this.initDevWorkspace(componentId, createComponentInfo.name);
    } catch (error) {
      returnData.msg = 'Init Workplace Fail';
      returnData.data.error = error.message || error.stack;
      return returnData;
    }

    try {
      const componentPath = `${staticDir}/${componentsPath}/${componentId}`;
      const componentDevPath = `${componentPath}/${initComponentVersion}`;
      await exec(`cd ${componentDevPath} && npm run build-dev`);
    } catch (error) {
      returnData.msg = 'Build Workplace Fail';
      returnData.data.error = error.message || error.stack;
      return returnData;
    }

    return returnData;
  }

  async getTagData(params) {
    const { ctx } = this;

    const newTagNames = (params.tags || []).filter(item => !item.id);
    const existTags = await ctx.model.Tag._find({ name: { $in: newTagNames.map(item => item.name) }, status: Enum.COMMON_STATUS.VALID, type: Enum.TAG_TYPE.COMPONENT });
    const needInsertTags = newTagNames.filter(item => !existTags.some(tag => tag.name === item.name));

    let insertedTags = [];
    if (!_.isEmpty(needInsertTags)) {
      const insertData = needInsertTags.map(item => ({ type: Enum.TAG_TYPE.COMPONENT, name: item.name }));
      insertedTags = await ctx.model.Tag._create(insertData);
    }

    return {
      tags: [
        ...(params.tags || []).filter(item => item.id).map(item => item.id), // 前端传进来的带id的
        ...existTags.map(item => item.id), // 前端传进来无id的，但库里已存在的
        ...insertedTags.map(item => item.id) ], // 前端传进来无id的，新创建的
    };
  }


  async updateInfo(id, requestData) {
    const { ctx } = this;

    const { name, status, type, projects, category, subCategory, isLib, desc, dataConfig, tags } = requestData;
    const returnData = { msg: 'ok', data: {} };

    const updateData = {};
    if (name) {
      const existsComponents = await ctx.model.Component._findOne({ id: { $ne: id }, name, status: Enum.COMMON_STATUS.VALID });
      if (!_.isEmpty(existsComponents)) {
        returnData.msg = 'Exists Already';
        return returnData;
      }
      updateData.name = name;
    }

    if (status) updateData.status = status;
    if (_.isBoolean(isLib)) updateData.isLib = isLib;
    if (projects) updateData.projects = projects;
    if (category) updateData.category = category;
    if (subCategory) updateData.subCategory = subCategory;
    if (!_.isNil(desc)) updateData.desc = desc;
    if (!_.isEmpty(dataConfig)) updateData.dataConfig = dataConfig;
    if (type) {
      if (type === Enum.COMPONENT_TYPE.COMMON) updateData.projects = [];
      updateData.type = type;
    }

    if (_.isArray(tags)) {
      const tagData = await this.getTagData(requestData);
      updateData.tags = tagData.tags;
    }

    await ctx.model.Component._updateOne({ id }, updateData);

    return returnData;
  }

  async toLib(id, requestData) {
    const { ctx } = this;

    const { toLib } = requestData;
    await ctx.model.Component._updateOne({ id }, { isLib: toLib });
  }

  async delete(id) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };

    const existsComponent = await ctx.model.Component._findOne({ id });
    if (!_.isEmpty(existsComponent.applications)) {
      returnData.msg = 'Exists Already';
      returnData.data.error = existsComponent.applications;
      return returnData;
    }

    const updateData = {
      status: Enum.COMMON_STATUS.INVALID,
    };
    await ctx.model.Component._updateOne({ id }, updateData);

    return returnData;
  }

  async copyComponent(id, componentInfo) {
    const { ctx, config } = this;
    const { pathConfig: { staticDir, componentsPath, initComponentVersion, defaultComponentCoverPath } } = config;

    const userInfo = ctx.userInfo;
    const returnData = { msg: 'ok', data: {} };
    // TODO: 复制组件文件时，不要复制.git文件夹！！！！

    const copyComponent = await ctx.model.Component._findOne({ id });
    if (_.isEmpty(copyComponent)) {
      returnData.msg = 'No Exists';
      return returnData;
    }

    const existsComponents = await ctx.model.Component._findOne({ name: componentInfo.name, status: Enum.COMMON_STATUS.VALID });
    if (!_.isEmpty(existsComponents)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    const createInfo = {
      name: componentInfo.name,
      category: copyComponent.category,
      subCategory: copyComponent.subCategory,
      type: copyComponent.type,
      projects: copyComponent.projects,
      tags: copyComponent.tags || [],
      desc: copyComponent.desc || '无',
      cover: defaultComponentCoverPath,
      creator: userInfo.userId,
      updater: userInfo.userId,
      versions: [],
    };

    const result = await ctx.model.Component._create(createInfo);

    const componentId = result.id;
    returnData.data.id = componentId;

    const src = `${staticDir}/${componentsPath}/${id}/${initComponentVersion}`;
    const dest = `${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}`;

    try {
      await ctx.helper.copyAndReplace(src, dest, [ 'node_modules', '.git', 'components', 'release', 'package-lock.json' ], { from: id, to: componentId });
    } catch (error) {
      returnData.msg = 'Init Workplace Fail';
      returnData.data.error = error;
      return returnData;
    }

    // 初始化git仓库
    if (config.env === 'prod') await this.initGit(componentId);

    return returnData;
  }

  async compileComponent(id) {
    const { ctx, config } = this;
    const { pathConfig: { staticDir, componentsPath, initComponentVersion } } = config;

    const returnData = { msg: 'ok', data: { error: '' } };
    const existsComponent = await ctx.model.Component._findOne({ id });
    if (_.isEmpty(existsComponent)) {
      returnData.msg = 'No Exists Db';
      return returnData;
    }

    const componentPath = `${staticDir}/${componentsPath}/${id}`;
    const componentDevPath = `${componentPath}/${initComponentVersion}`;
    if (!fs.existsSync(componentDevPath)) {
      returnData.msg = 'No Exists Dir';
      return returnData;
    }

    const componentDevPackageJsonPath = `${componentPath}/${initComponentVersion}/package.json`;
    const componentDevNodeModulesPath = `${componentPath}/${initComponentVersion}/node_modules`;
    const packageJson = JSON.parse(fs.readFileSync(componentDevPackageJsonPath).toString());

    if ((!_.isEmpty(packageJson.dependencies) || !_.isEmpty(packageJson.devDependencies)) && !fs.existsSync(componentDevNodeModulesPath)) {
      returnData.msg = 'No Install Depend';
      return returnData;
    }

    try {
      await exec(`cd ${componentDevPath} && npm run build-dev`);
    } catch (error) {
      returnData.msg = 'Compile Fail';
      returnData.data.error = error.message || error.stack;
      return returnData;
    }

    // note: async screenshot component cover, no wait!!!!!
    const savePath = `${componentDevPath}/components/cover.jpeg`;
    this.genCoverImage(id, savePath);

    // 用于git push
    if (config.env === 'prod') {
      const git = simpleGit(componentDevPath);
      const status = await git.status();
      if (!status.isClean()) {
        await ctx.model.Component._updateOne({ id }, { needPushGit: true, lastChangeTime: Date.now(), updater: ctx.userInfo.userId });
      }
    }

    return returnData;
  }

  async genCoverImage(id, savePath) {
    const { ctx, logger, config } = this;
    const { pathConfig: { componentsPath } } = config;

    try {
      const [ version, buildPath, coverFileName ] = savePath.split('/').slice(-3);

      const url = `http://${config.cluster.listen.hostname}:${config.cluster.listen.port}/${componentsPath}/${id}/${version}/index.html`;
      const result = await ctx.helper.screenshot(url, savePath);
      if (result === 'success') {
        await ctx.model.Component._updateOne({ id }, { cover: `/${componentsPath}/${id}/${version}/${buildPath}/${coverFileName}` });
      }
      logger.info(`${id} gen cover success!`);
    } catch (error) {
      logger.error(`${id} gen cover error: ${error || error.stack}`);
    }
  }

  async installComponentDepend(id) {
    const { ctx, config } = this;
    const { pathConfig: { staticDir, componentsPath, initComponentVersion } } = config;

    const returnData = { msg: 'ok', data: { error: '' } };
    const existsComponent = await ctx.model.Component._findOne({ id });
    if (_.isEmpty(existsComponent)) {
      returnData.msg = 'No Exists Db';
      return returnData;
    }

    const componentPath = `${staticDir}/${componentsPath}/${id}`;
    const componentDevPath = `${componentPath}/${initComponentVersion}`;
    if (!fs.existsSync(componentDevPath)) {
      returnData.msg = 'No Exists Dir';
      return returnData;
    }

    try {
      await exec(`cd ${componentDevPath} && NODE_ENV=sit npm i`);
    } catch (error) {
      returnData.msg = 'Install Fail';
      returnData.data.error = error.message || error.stack;
      return returnData;
    }

    return returnData;
  }


  async releaseComponent(componentId, releaseComponentInfo) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };
    const { no, compatible, desc } = releaseComponentInfo;
    const componentInfo = await ctx.model.Component._findOne({ id: componentId });

    if (!compatible) {
      const existsVersion = (componentInfo.versions || []).find(version => version.no === no);

      if (!_.isEmpty(existsVersion)) {
        returnData.msg = 'Exists Already';
        return returnData;
      }
    }

    const newVersion = compatible ? _.get(componentInfo, [ 'versions', (componentInfo.versions || []).length - 1, 'no' ], no || 'v1') : no;
    const createResult = await this.initReleaseWorkspace(componentId, newVersion, desc);

    if (createResult.msg !== 'Success') {
      returnData.msg = createResult.msg;
      returnData.data = createResult.data;
      return returnData;
    }

    return returnData;
  }

  async initReleaseWorkspace(componentId, releaseVersion, desc) {
    const { ctx, config, logger } = this;
    const { pathConfig: { staticDir, componentsPath, initComponentVersion } } = config;

    const returnInfo = { msg: 'Success', data: {} };

    const componentPath = `${staticDir}/${componentsPath}/${componentId}`;
    const componentDevPath = `${componentPath}/${initComponentVersion}`;
    const componentReleasePath = `${componentPath}/${releaseVersion}`;

    const componentDevPackageJsonPath = `${componentDevPath}/components/main.js`;

    if (!fs.existsSync(componentDevPackageJsonPath)) {
      returnInfo.msg = 'Please Compile Component';
      return returnInfo;
    }

    try {
      await ctx.helper.copyAndReplace(`${componentDevPath}/components`, `${componentReleasePath}/release`, [], { from: initComponentVersion, to: releaseVersion });
    } catch (error) {
      returnInfo.msg = 'Init Workplace Fail';
      returnInfo.data.error = error || error.stack;

      logger.error(`${componentId} Init Workplace Fail: ${JSON.stringify(error || error.stack)}`);
      return returnInfo;
    }

    await ctx.model.Component._updateOne({ id: componentId }, {
      developStatus: Enum.COMPONENT_DEVELOP_STATUS.ONLINE,
      $push: {
        versions: {
          desc,
          no: releaseVersion,
          status: Enum.COMMON_STATUS.VALID, time: Date.now(),
        },
      },
    });

    return returnInfo;
  }

  // 初始化开发组件空间
  async initDevWorkspace(componentId, componentName) {
    const { config } = this;
    const { pathConfig: { staticDir, commonDirPath, componentsPath, componentsTplPath, initComponentVersion } } = config;

    const componentPath = `${staticDir}/${componentsPath}/${componentId}`;
    const componentDevPath = `${componentPath}/${initComponentVersion}`;
    fs.mkdirSync(`${componentPath}`);
    fs.mkdirSync(componentDevPath);

    const srcPath = `${componentDevPath}/src`;
    const srcTplPath = `${staticDir}/${componentsTplPath}/src`;

    fs.mkdirSync(srcPath);
    fs.writeFileSync(`${srcPath}/main.js`, require(`${srcTplPath}/mainJs.js`)(componentId, initComponentVersion));
    fs.writeFileSync(`${srcPath}/Component.js`, require(`${srcTplPath}/ComponentJs.js`)());
    fs.writeFileSync(`${srcPath}/setting.js`, require(`${srcTplPath}/setting.js`)(componentId, initComponentVersion));

    const settingPath = `${srcPath}/settings`;
    fs.mkdirSync(settingPath);
    fs.writeFileSync(`${settingPath}/options.js`, require(`${srcTplPath}/options.js`)(componentId));
    fs.writeFileSync(`${settingPath}/data.js`, require(`${srcTplPath}/data.js`)(componentId));

    const buildPath = `${componentDevPath}/build`;
    const buildTplPath = `${staticDir}/${componentsTplPath}/build`;
    fs.mkdirSync(buildPath);
    fs.writeFileSync(`${buildPath}/webpack.config.dev.js`, require(`${buildTplPath}/webpack.config.dev.js`)(componentId));
    fs.writeFileSync(`${buildPath}/webpack.config.production.js`, require(`${buildTplPath}/webpack.config.production.js`)(componentId));

    const htmlCommonDirPath = commonDirPath ? `/${commonDirPath}` : commonDirPath;
    fs.writeFileSync(`${componentDevPath}/editor.html`, require(`${staticDir}/${componentsTplPath}/editor.html.js`)(componentId, initComponentVersion, htmlCommonDirPath));
    fs.writeFileSync(`${componentDevPath}/index.html`, require(`${staticDir}/${componentsTplPath}/index.html.js`)(componentId, initComponentVersion, htmlCommonDirPath));
    fs.writeFileSync(`${componentDevPath}/env.js`, require(`${staticDir}/${componentsTplPath}/env.js`)(htmlCommonDirPath));
    fs.writeFileSync(`${componentDevPath}/options.json`, require(`${staticDir}/${componentsTplPath}/options.json.js`)(componentId, componentName));
    fs.writeFileSync(`${componentDevPath}/package.json`, require(`${staticDir}/${componentsTplPath}/package.json.js`)(componentId));
    await fsExtra.copy(`${staticDir}/${componentsTplPath}/.gitignore`, `${componentDevPath}/.gitignore`);

    if (config.env === 'prod') await this.initGit(componentId);
  }

  async initGit(componentId) {
    const { ctx, config: { pathConfig: { staticDir, componentsPath, initComponentVersion }, componentGit }, logger } = this;
    const componentDevPath = `${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}`;
    const userInfo = ctx.userInfo;
    try {
      const git = simpleGit(componentDevPath);

      const reqBody = {
        name: componentId,
        path: componentId,
        namespace_id: componentGit.namespaceId,
      };
      const newRepo = await ctx.http.post(`https://git.cloudwise.com/api/v4/projects?private_token=${componentGit.privateToken}`, reqBody);
      const { id: newRepoId, ssh_url_to_repo: newRepoUrl } = newRepo;

      await git
        .init()
        .add('.')
        .commit(`Update #LOWCODE-581 commit by ${userInfo.username}`)
        .addRemote('origin', newRepoUrl)
        .push([ '-u', '--set-upstream', 'origin', 'master' ]);

      await ctx.model.Component._updateOne({ id: componentId }, { gitLabProjectId: newRepoId, needPushGit: false, lastChangeTime: Date.now() });
    } catch (e) {
      logger.error('git init error: ', e || e.stack);
    }
  }

  async getComponentHistory(options) {
    const { config: { pathConfig: { staticDir, componentsPath, initComponentVersion } } } = this;
    const { id, curPage, pageSize } = options;

    const componentDevPath = `${staticDir}/${componentsPath}/${id}/${initComponentVersion}`;
    const gitExist = fs.existsSync(`${componentDevPath}/.git`);
    if (!gitExist) return { total: 0, list: [] };

    const git = simpleGit(componentDevPath);
    const { all: totalLogs } = await git.log();
    const total = totalLogs.length;
    const selectedLogs = totalLogs.slice(curPage * pageSize, (curPage + 1) * pageSize);

    return {
      total,
      list: selectedLogs.map(log => {
        return {
          hash: log.hash,
          message: log.message,
          time: new Date(log.date).getTime(),
        };
      }),
    };
  }

  async getCommitInfo(options) {
    const { config: { pathConfig: { staticDir, componentsPath, initComponentVersion } } } = this;
    const { id, hash } = options;

    const componentDevPath = `${staticDir}/${componentsPath}/${id}/${initComponentVersion}`;

    const git = simpleGit(componentDevPath);
    const diffStr = await git.show(hash);
    const diffJson = Diff2html.parse(diffStr);
    const diffHtml = Diff2html.html(diffJson, { drawFileList: true });
    const compressHtml = minify(diffHtml, {
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      conservativeCollapse: true,
    });
    return compressHtml;
  }
}

module.exports = ComponentService;
