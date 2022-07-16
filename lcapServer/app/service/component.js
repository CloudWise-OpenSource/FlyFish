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
const path = require('path');
const AdmZip = require('adm-zip');
const moment = require('moment');

const Enum = require('../lib/enum');

class ComponentService extends Service {
  async updateCategoryInfo(updateInfo) {
    const { ctx, config: { specialId: { innerComponentCategoryIds } } } = this;
    const userInfo = ctx.userInfo;

    const filter = {};
    const existsCategory = await ctx.model.ComponentCategory._find(filter, null, { sort: '-create_time', limit: 1 }) || [];
    const existsCategoryIds = _.flatten(_.get(existsCategory, [0, 'categories'], []).map(category => (category.children || []).map(children => children.id + '')));
    const updateCategoryIds = _.flatten((updateInfo.categories || []).map(category => (category.children || []).filter(children => children.id).map(children => children.id + '')));
    const deleteCategoryIds = _.difference(existsCategoryIds, updateCategoryIds);

    const returnData = { msg: 'ok', data: {} };
    if (!_.isEmpty(deleteCategoryIds)) {
      for (const deleteCategoryId of deleteCategoryIds) {
        if (innerComponentCategoryIds.includes(deleteCategoryId)) {
          returnData.msg = 'No Auth';
          return returnData;
        }
      }

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
          returnData.msg = 'Exists Already SubCategory Name';
          return returnData;
        }
        names.push(subCategory.name);

        if (!subCategory.id) subCategory.id = `${Date.now()}${i}${j}`;
      }
    }

    updateInfo.creator = userInfo.userId;
    updateInfo.updater = userInfo.userId;
    await ctx.model.ComponentCategory._create(updateInfo);

    return returnData;
  }

  async getCategoryList(key) {
    const { ctx } = this;

    let returnList = [];
    const filter = {};
    const list = await ctx.model.ComponentCategory._find(filter, null, { sort: '-create_time', limit: 1 });
    const categories = _.get(list, [0, 'categories'], []);

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

    const orderField = 'updateTime';

    const queryProjects = [];
    const { key, name, tags, trades, projectId, developStatus, type, category, subCategory, curPage, pageSize } = requestData;
    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
    };

    const projectList = await ctx.model.Project._find();
    const tagList = await ctx.model.Tag._find();

    if (key) {
      queryCond.$or = [];
      queryCond.$or.push({ desc: { $regex: _.escapeRegExp(key) } });
      const matchTags = (tagList || []).filter(tag => tag.name.includes(key));
      const matchTagIds = matchTags.map(tag => tag.id);
      if (!_.isEmpty(matchTagIds)) queryCond.$or.push({ tags: { $in: matchTagIds } });
    }

    if (name) queryCond.name = { $regex: _.escapeRegExp(name) };
    if (category) queryCond.category = category;
    if (subCategory) queryCond.subCategory = subCategory;
    if (developStatus) queryCond.developStatus = developStatus;
    if (type) queryCond.type = type;
    if (projectId) queryProjects.push(projectId);
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
        queryProjects.push(...tradeProjectIds);
      } else {
        return { total: 0, data: [] };
      }
    }
    if (!_.isEmpty(queryProjects)) queryCond.projects = { $in: queryProjects };
    const componentList = await ctx.model.Component._find(queryCond);

    const total = componentList.length || 0;
    const creatorUserIds = _.uniq(componentList.map(component => component.creator).filter(userid => userid));
    const users = await ctx.model.User._find({ id: { $in: creatorUserIds } });

    const data = _.orderBy(componentList, [orderField], ['desc']).splice(curPage * pageSize, pageSize).map(component => {
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
        automaticCover: component.automaticCover,
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
        version: _.get(component, ['versions', (component.versions || []).length - 1, 'no'], '暂未上线'),
        creator: curUser.username,
        cover: component.cover,
        desc: component.desc,
        from: component.from,
        allowDataSearch: component.allowDataSearch || 0,

        updateTime: component.updateTime,
        createTime: component.createTime,
      };
    });

    return { total, data };
  }

  /**
   * 导入组件源码
   * @param componentId
   * @param file
   */
  async importSource(componentId, file) {
    const { ctx, config: { replaceTpl, pathConfig: { staticDir, commonDirPath, componentsPath, initComponentVersion } } } = this;
    const returnData = { msg: 'ok', data: {} };

    const existsComponent = await ctx.model.Component._findOne({ id: componentId });
    if (Object.values(Enum.DATA_FROM).includes(existsComponent.from)) {
      returnData.msg = 'No Auth';
      return returnData;
    }

    const filename = path.basename(file.filename, '.zip');
    const uploadDir = `${staticDir}/${componentsPath}/${componentId}/${filename}_${Date.now()}`;
    const currentPath = `${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}`;
    try {
      await exec(`cd ${currentPath} && rm -rf ./*`);

      await fsExtra.copy(file.filepath, `${uploadDir}/${file.filename}`);
      const zip = new AdmZip(`${uploadDir}/${file.filename}`);
      zip.extractAllTo(uploadDir, true);
      const extractDir = fsExtra.existsSync(`${uploadDir}/${filename}`);
      if (extractDir) {
        await fsExtra.copy(`${uploadDir}/${filename}`, currentPath);
      } else {
        await fsExtra.remove(`${uploadDir}/${file.filename}`);
        await fsExtra.copy(uploadDir, currentPath);
      }

      await exec(`sed -i -e 's#\\${replaceTpl.componentIdTpl}#${componentId}#g' ${currentPath}/src/main.js`);
      await exec(`sed -i -e 's#\\${replaceTpl.componentIdTpl}#${componentId}#g' ${currentPath}/src/setting.js`);
      await exec(`sed -i -e 's#\\${replaceTpl.componentIdTpl}#${componentId}#g' ${currentPath}/options.json`);

      const finalCommonDirPath = commonDirPath ? `/${commonDirPath}` : commonDirPath;
      await exec(`sed -i -e 's#\\${replaceTpl.editorCssTpl}#${finalCommonDirPath}/common/editor.css#g' ${currentPath}/editor.html`);
      await exec(`sed -i -e 's#\\${replaceTpl.editorEnvTpl}#${finalCommonDirPath}/components/${componentId}/${initComponentVersion}/env.js#g' ${currentPath}/editor.html`);
      await exec(`sed -i -e 's#\\${replaceTpl.editorDataViTpl}#${finalCommonDirPath}/common/data-vi.js#g' ${currentPath}/editor.html`);
      await exec(`sed -i -e 's#\\${replaceTpl.editorJsTpl}#${finalCommonDirPath}/common/editor.js#g' ${currentPath}/editor.html`);
      await exec(`sed -i -e 's#\\${replaceTpl.indexEnvTpl}#${finalCommonDirPath}/components/${componentId}/${initComponentVersion}/env.js#g' ${currentPath}/index.html`);
      await exec(`sed -i -e 's#\\${replaceTpl.indexDataViTpl}#${finalCommonDirPath}/common/data-vi.js#g' ${currentPath}/index.html`);

      const finalComponentDirPath = commonDirPath ? commonDirPath + '/components' : 'components';
      await exec(`sed -i -e 's#\\${replaceTpl.envComponentDirTpl}#${finalComponentDirPath}#g' ${currentPath}/env.js`);

      const buildDevPath = `${currentPath}/components`;
      if (fsExtra.pathExistsSync(buildDevPath)) {
        await exec(`sed -i -e 's#\\${replaceTpl.componentIdTpl}#${componentId}#g' ${currentPath}/components/main.js`);
        await exec(`sed -i -e 's#\\${replaceTpl.componentIdTpl}#${componentId}#g' ${currentPath}/components/main.js.map`);
        await exec(`sed -i -e 's#\\${replaceTpl.componentIdTpl}#${componentId}#g' ${currentPath}/components/setting.js`);
        await exec(`sed -i -e 's#\\${replaceTpl.componentIdTpl}#${componentId}#g' ${currentPath}/components/setting.js.map`);
      }
    } catch (error) {
      returnData.msg = 'Import Fail';
      returnData.data.error = error.message || error.stack;
    } finally {
      await fsExtra.remove(file.filepath);
      await fsExtra.remove(uploadDir);
    }

    return returnData;
  }

  /**
   * 导出组件源码
   * @param componentId
   */
  async exportSource(componentId) {
    const { ctx, logger, config: { replaceTpl, pathConfig: { staticDir, tmpPath, componentsPath, initComponentVersion } } } = this;

    const componentInfo = await ctx.model.Component._findOne({ id: componentId });
    const sourceFolder = `${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}`;
    const tmpFolder = `${staticDir}/${tmpPath}/${componentId}`;
    const destZip = `${staticDir}/${tmpPath}/${componentId}/${componentInfo.name}.zip`;
    const returnData = { msg: 'ok', data: {} };

    if (!fs.existsSync(`${sourceFolder}/src`)) {
      logger.error('Export Fail: No Source Code');
      returnData.msg = 'No Source Code';
      returnData.data.error = 'Export Fail: no source code';
      return returnData;
    }

    try {
      await fsExtra.copy(sourceFolder, tmpFolder, { filter: src => !(src.includes('node_modules') || src.includes('.git')) });

      await exec(`sed -i -e 's#${componentId}#${replaceTpl.componentIdTpl}#g' ${tmpFolder}/src/main.js`);
      await exec(`sed -i -e 's#${componentId}#${replaceTpl.componentIdTpl}#g' ${tmpFolder}/src/setting.js`);
      await exec(`sed -i -e 's#${componentId}#${replaceTpl.componentIdTpl}#g' ${tmpFolder}/options.json`);

      await exec(`sed -i -e 's#href=".*/editor.css"#href="${replaceTpl.editorCssTpl}"#g' ${tmpFolder}/editor.html`);
      await exec(`sed -i -e 's#src=".*/env.js"#src="${replaceTpl.editorEnvTpl}"#g' ${tmpFolder}/editor.html`);
      await exec(`sed -i -e 's#src=".*/data-vi.js"#src="${replaceTpl.editorDataViTpl}"#g' ${tmpFolder}/editor.html`);
      await exec(`sed -i -e 's#src=".*/editor.js"#src="${replaceTpl.editorJsTpl}"#g' ${tmpFolder}/editor.html`);
      await exec(`sed -i -e 's#src=".*/env.js"#src="${replaceTpl.indexEnvTpl}"#g' ${tmpFolder}/index.html`);
      await exec(`sed -i -e 's#src=".*/data-vi.js"#src="${replaceTpl.indexDataViTpl}"#g' ${tmpFolder}/index.html`);
      await exec(`sed -i -e 's#componentsDir.*#componentsDir: "${replaceTpl.envComponentDirTpl}"#g' ${tmpFolder}/env.js`);

      const buildDevPath = `${tmpFolder}/components`;
      if (fsExtra.pathExistsSync(buildDevPath)) {
        await exec(`sed -i -e 's#${componentId}#${replaceTpl.componentIdTpl}#g' ${buildDevPath}/main.js`);
        await exec(`sed -i -e 's#${componentId}#${replaceTpl.componentIdTpl}#g' ${buildDevPath}/main.js.map`);
        await exec(`sed -i -e 's#${componentId}#${replaceTpl.componentIdTpl}#g' ${buildDevPath}/setting.js`);
        await exec(`sed -i -e 's#${componentId}#${replaceTpl.componentIdTpl}#g' ${buildDevPath}/setting.js.map`);
      }
      const zip = new AdmZip();
      zip.addLocalFolder(tmpFolder);
      zip.writeZip(destZip);

      const data = await fsExtra.stat(destZip);
      ctx.set('Content-Disposition', `attachment;filename=${encodeURIComponent(componentInfo.name + '.zip')}`);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.set('Content-Length', data.size);
      ctx.body = fsExtra.createReadStream(destZip);
    } catch (error) {
      logger.error(`Export Fail: ${error.message || error.stack}`);
      returnData.msg = 'Export Fail';
      returnData.data.error = error.message || error.stack;
    } finally {
      await fsExtra.remove(tmpFolder);
    }

    return returnData;
  }

  async getComponentInfo(id) {
    const { ctx } = this;

    const componentInfo = await ctx.model.Component._findOne({ id });

    let userInfo = {};
    if (componentInfo.creator) userInfo = await ctx.model.User._findOne({ id: componentInfo.creator });
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
      }), ['time'], ['desc']),
      desc: componentInfo.desc,
      dataConfig: componentInfo.dataConfig || {},
      creatorInfo: {
        id: userInfo.id,
        username: userInfo.username || '-',
      },
      developStatus: componentInfo.developStatus,
    };

    return returnInfo || {};
  }

  async addComponent(createComponentInfo) {
    const { ctx, config } = this;
    const { pathConfig: { staticDir, componentsPath, initComponentVersion, defaultComponentCoverPath, commonDirPath } } = config;

    const userInfo = ctx.userInfo;
    const returnData = { msg: 'ok', data: {} };

    const filter = {
      name: createComponentInfo.name,
      status: Enum.COMMON_STATUS.VALID,
    };
    const existsComponents = await ctx.model.Component._findOne(filter);
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
      automaticCover: createComponentInfo.automaticCover,

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

    try {
      const customImgPath = `${staticDir}/${createComponentInfo.componentCover}`;
      const imgUrl = `/${componentsPath}/${componentId}/${initComponentVersion}/components/cover.jpeg`;

      if (createInfo.automaticCover === Enum.SNAPSHOT_TYPE.CUSTOM && fs.existsSync(customImgPath)) {
        await fsExtra.copy(customImgPath, `${staticDir}${imgUrl}`);
        await fsExtra.remove(customImgPath);

        await ctx.model.Component._updateOne({ id: componentId }, { cover: imgUrl });
      } else if (createInfo.automaticCover === Enum.SNAPSHOT_TYPE.AUTO) {
        await ctx.model.Component._updateOne({ id: componentId }, { cover: `/${commonDirPath}/component_tpl/public/cover.jpeg` });
        await this.genCoverImage(componentId, initComponentVersion);
      }
    } catch (error) {
      returnData.msg = 'Picture failed';
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
        ...insertedTags.map(item => item.id)], // 前端传进来无id的，新创建的
    };
  }


  async updateInfo(id, requestData) {
    const { ctx, config } = this;
    const { pathConfig: { staticDir, componentsPath, commonDirPath, initComponentVersion } } = config;
    const { name, status, type, projects, category, subCategory, desc, dataConfig, tags, automaticCover, componentCover } = requestData;
    const userInfo = ctx.userInfo;

    const returnData = { msg: 'ok', data: {} };

    const checkAuthComponent = await ctx.model.Component._findOne({ id });
    if (Object.values(Enum.DATA_FROM).includes(checkAuthComponent.from)) {
      returnData.msg = 'No Auth';
      return returnData;
    }

    const updateData = {};
    if (name) {
      const filter = {
        id: { $ne: id },
        name,
        status: Enum.COMMON_STATUS.VALID,
      };
      const existsComponents = await ctx.model.Component._findOne(filter);
      if (!_.isEmpty(existsComponents)) {
        returnData.msg = 'Exists Already';
        return returnData;
      }
      updateData.name = name;
    }

    if (status) updateData.status = status;
    if (projects) updateData.projects = projects;
    if (category) updateData.category = category;
    if (subCategory) updateData.subCategory = subCategory;
    if (!_.isNil(desc)) updateData.desc = desc;
    if (!_.isEmpty(dataConfig)) updateData.dataConfig = dataConfig;
    if (type) {
      if (type === Enum.COMPONENT_TYPE.COMMON) updateData.projects = [];
      updateData.type = type;
    }
    if (automaticCover) updateData.automaticCover = automaticCover;

    if (_.isArray(tags)) {
      const tagData = await this.getTagData(requestData);
      updateData.tags = tagData.tags;
    }

    try {
      const imgUrl = `/${componentsPath}/${id}/${initComponentVersion}/components/cover.jpeg`;
      const result = await ctx.model.Component._findOne({ id });
      if (automaticCover === Enum.SNAPSHOT_TYPE.CUSTOM) {
        if (componentCover && fs.existsSync(`${staticDir}/${componentCover}`)) {
          await fsExtra.copy(`${staticDir}/${componentCover}`, `${staticDir}${imgUrl}`);
          await fsExtra.remove(`${staticDir}/${componentCover}`);
          updateData.cover = imgUrl;
        }
      } else if (automaticCover === Enum.SNAPSHOT_TYPE.AUTO) {
        if (result.automaticCover !== automaticCover) {
          updateData.cover = `/${commonDirPath}/component_tpl/public/cover.jpeg`;
          await this.genCoverImage(id, initComponentVersion);
        }
      }
    } catch (error) {
      returnData.msg = 'Picture failed';
      returnData.data.error = error.message || error.stack;
      return returnData;
    }

    updateData.updater = userInfo.userId;
    await ctx.model.Component._updateOne({ id }, updateData);

    return returnData;
  }

  async delete(id) {
    const { ctx } = this;
    const userInfo = ctx.userInfo;

    const returnData = { msg: 'ok', data: {} };

    const existsComponent = await ctx.model.Component._findOne({ id });
    if (Object.values(Enum.DATA_FROM).includes(existsComponent.from)) {
      returnData.msg = 'No Auth';
      return returnData;
    }
    if (!_.isEmpty(existsComponent.applications)) {
      returnData.msg = 'Exists Already';
      returnData.data.error = existsComponent.applications;
      return returnData;
    }

    const updateData = {
      status: Enum.COMMON_STATUS.INVALID,
      updater: userInfo.userId,
    };
    await ctx.model.Component._updateOne({ id }, updateData);

    return returnData;
  }

  async copyComponent(id, componentInfo) {
    const { ctx, config } = this;
    const { pathConfig: { staticDir, componentsPath, initComponentVersion, defaultComponentCoverPath, commonDirPath } } = config;

    const userInfo = ctx.userInfo;
    const returnData = { msg: 'ok', data: {} };
    // TODO: 复制组件文件时，不要复制.git文件夹！！！！

    const copyComponent = await ctx.model.Component._findOne({ id });
    if (_.isEmpty(copyComponent)) {
      returnData.msg = 'No Exists';
      return returnData;
    }

    const filter = {
      name: componentInfo.name,
      status: Enum.COMMON_STATUS.VALID,
    };
    const existsComponents = await ctx.model.Component._findOne(filter);
    if (!_.isEmpty(existsComponents)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    const tagInfo = await this.getTagData(componentInfo);
    const createInfo = {
      name: componentInfo.name,
      category: componentInfo.category,
      subCategory: componentInfo.subCategory,
      type: componentInfo.type,
      projects: componentInfo.projects,
      tags: tagInfo.tags || [],
      desc: componentInfo.desc || '无',
      cover: defaultComponentCoverPath,
      automaticCover: componentInfo.automaticCover,

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
      await ctx.helper.copyAndReplace(src, dest, ['node_modules', '.git', 'release', 'package-lock.json'], { from: id, to: componentId });
    } catch (error) {
      returnData.msg = 'Init Workplace Fail';
      returnData.data.error = error;
      return returnData;
    }

    try {
      const imgUrl = `/${componentsPath}/${componentId}/${initComponentVersion}/components/cover.jpeg`;
      if (createInfo.automaticCover === Enum.SNAPSHOT_TYPE.CUSTOM) {
        if (componentInfo.componentCover && fs.existsSync(`${staticDir}/${componentInfo.componentCover}`)) {
          await fsExtra.copy(`${staticDir}/${componentInfo.componentCover}`, `${staticDir}${imgUrl}`);
          if (copyComponent.cover !== componentInfo.componentCover) {
            await fsExtra.remove(`${staticDir}/${componentInfo.componentCover}`);
          }
        }
        await ctx.model.Component._updateOne({ id: componentId }, { cover: imgUrl });
      } else if (createInfo.automaticCover === Enum.SNAPSHOT_TYPE.AUTO) {
        await ctx.model.Component._updateOne({ id: componentId }, { cover: `/${commonDirPath}/component_tpl/public/cover.jpeg` });
        await this.genCoverImage(componentId, initComponentVersion);
      }
    } catch (error) {
      returnData.msg = 'Picture failed';
      returnData.data.error = error.message || error.stack;
      return returnData;
    }

    // 初始化git仓库
    if (config.env === 'docp') await this.initGit(componentId);

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

    if (Object.values(Enum.DATA_FROM).includes(existsComponent.from)) {
      returnData.msg = 'No Auth';
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

    if (existsComponent.automaticCover === Enum.SNAPSHOT_TYPE.AUTO) {
      await this.genCoverImage(id, initComponentVersion);
    }

    // 用于git push
    if (config.env === 'docp') {
      const git = simpleGit(componentDevPath);
      const status = await git.status();
      if (!status.isClean()) {
        await git
          .add('.')
          .commit(`Update commit at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
      }
    }

    return returnData;
  }

  async genCoverImage(id, version) {
    const { ctx } = this;

    const insertRenderData = {
      type: Enum.RESOURCE_TYPE.COMPONENT,
      renderStage: Enum.RENDER_STAGE.UNDONE,
      reRenderCount: 0,
      version,
    };
    await ctx.model.ResourceRenderRecords._updateOne(
      { id },
      { $set: insertRenderData, $setOnInsert: { _id: id, createTime: new Date() } },
      { upsert: true }
    );
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

    if (Object.values(Enum.DATA_FROM).includes(existsComponent.from)) {
      returnData.msg = 'No Auth';
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
    if (Object.values(Enum.DATA_FROM).includes(componentInfo.from)) {
      returnData.msg = 'No Auth';
      return returnData;
    }

    if (!compatible) {
      const existsVersion = (componentInfo.versions || []).find(version => version.no === no);

      if (!_.isEmpty(existsVersion)) {
        returnData.msg = 'Exists Already';
        return returnData;
      }
    }

    const newVersion = compatible ? _.get(componentInfo, ['versions', (componentInfo.versions || []).length - 1, 'no'], no || 'v1') : no;
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

    if (config.env === 'docp') await this.initGit(componentId);
  }

  async initGit(componentId) {
    const { config: { pathConfig: { staticDir, componentsPath, initComponentVersion } }, logger } = this;
    const componentDevPath = `${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}`;
    try {
      const git = simpleGit(componentDevPath);
      await git
        .init()
        .addConfig('user.email', 'lcap@cloudwise.com')
        .addConfig('user.name', 'lcap-commit')
        .add('.')
        .commit(`Update commit at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
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
