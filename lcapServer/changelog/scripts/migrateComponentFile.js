'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const mongoUrl = config.get('mongoose.clients.flyfish.url');
const staticDir = config.get('pathConfig.staticDir');
const oldVCWww = config.get('old_vc_www');
const oldSolutionWww = config.get('old_solution_www');

let mongoClient,
  db;
const errList = [];
let success = 0;

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  db = mongoClient.db('flyfish');
}

(async () => {
  try {
    await init();
    const componentDir = path.resolve(staticDir, 'components');
    const components = await db.collection('components').find({ migrated: { $exists: false } }).toArray();
    console.log(`待迁移: ${components.length}个`);

    for (const component of components) {
      try {
        const componentId = component._id.toString();
        const componentMark = component.old_component_mark;

        const source = path.resolve(oldVCWww, 'static/dev_visual_component/dev_workspace', component.old_org_mark, component.old_component_mark);
        const target = path.resolve(componentDir, component._id.toString(), 'v-current');

        const sourceExist = fs.existsSync(source);
        if (sourceExist) {
          await copyAndIgnore(source, target, [ 'node_modules', '.git', 'components', 'package-lock.json' ]);
          // 加版本号
          await replaceFiles(target, 'v-current', componentId, componentMark);
        }

        if (component.develop_status === 'online') {
          const versionTarget = path.resolve(componentDir, component._id.toString(), 'v1.0.0');
          if (sourceExist) {
            await copyAndIgnore(source, versionTarget, [ 'node_modules', '.git', 'components', 'package-lock.json' ]);
            // 加版本号
            await replaceFiles(versionTarget, 'v1.0.0', componentId, componentMark);
          }

          const releaseSource = path.resolve(oldSolutionWww, 'static/public_visual_component/1', component.old_component_mark);
          const releaseTarget = path.resolve(versionTarget, 'release');
          await fs.copy(releaseSource, releaseTarget);

          const releaseMainPath = path.resolve(versionTarget, 'release/main.js');
          const releaseMainOrigin = await fs.readFile(releaseMainPath, { encoding: 'utf8' });
          const releaseMainReplacement = releaseMainOrigin.replace(/registerComponent\)\((\"|\')(.+?)(\"|\')\,(.+?)\)/g, `registerComponent)(\'${componentId}\',\'v1.0.0\',$4)`);
          await fs.writeFile(releaseMainPath, releaseMainReplacement);

          const releaseSettingPath = path.resolve(versionTarget, 'release/setting.js');
          const releaseSettingOrigin = await fs.readFile(releaseSettingPath, { encoding: 'utf8' });
          const releaseSettingReplacement = releaseSettingOrigin.replace(/registerComponentOptionsSetting\)\((\"|\')(.+?)(\"|\')\,(.+?)\)/g, `registerComponentOptionsSetting)(\'${componentId}\',\'v1.0.0\',$4\)`)
            .replace(/registerComponentDataSetting\)\((\"|\')(.+?)(\"|\')\,(.+?)\)/g, `registerComponentDataSetting)(\'${componentId}\',\'v1.0.0\',$4\)`);
          await fs.writeFile(releaseSettingPath, releaseSettingReplacement);
        }
        await db.collection('components').updateOne({ _id: component._id }, { $set: { migrated: true } });
        success++;
        console.log(`迁移成功：${component._id.toString()}`);
      } catch (error) {
        errList.push(component._id.toString());
        console.error(`失败：${component._id.toString()}  =====`, JSON.stringify(error.stack || error));
      }
    }

  } catch (error) {
    console.log(error.stack || error);
  } finally {
    console.log(`成功: ${success}个`);
    console.log(`失败: ${errList.length}个 ====> `, JSON.stringify(errList));
    mongoClient.close();
    process.exit(0);
  }
})();

async function replaceFiles(target, version, componentId, componentMark) {
  const mainJsPath = path.resolve(target, 'src/main.js');
  const mainJsOrigin = await fs.readFile(mainJsPath, { encoding: 'utf8' });
  const mainJsReplacement = mainJsOrigin.replace(/registerComponent\((\S+)\,\sComponent\);/, `registerComponent(\'${componentId}\', \'${version}\', Component);`);
  await fs.writeFile(mainJsPath, mainJsReplacement);

  const settingJsPath = path.resolve(target, 'src/setting.js');
  const settingJsOrigin = await fs.readFile(settingJsPath, { encoding: 'utf8' });
  const settingJsReplacement = settingJsOrigin.replace(/registerComponentOptionsSetting\((\S+)\,\sOptionsSetting\);/, `registerComponentOptionsSetting(\'${componentId}\', \'${version}\', OptionsSetting);`)
    .replace(/registerComponentDataSetting\((\S+)\,\sDataSetting\);/, `registerComponentDataSetting(\'${componentId}\', \'${version}\', DataSetting);`);
  await fs.writeFile(settingJsPath, settingJsReplacement);

  // 替换editor.html
  const editorPath = path.resolve(target, 'editor.html');
  const newEditorStr = require(path.resolve(staticDir, 'component_tpl/editor.html.js'))(componentId, version);
  await fs.writeFile(editorPath, newEditorStr);

  // 新增index.html
  const indexPath = path.resolve(target, 'index.html');
  const indexStr = require(path.resolve(staticDir, 'component_tpl/index.html.js'))(componentId, version);
  await fs.writeFile(indexPath, indexStr);

  // 替换env.js
  const envPath = path.resolve(target, 'env.js');
  const envJsOrigin = await fs.readFile(envPath, { encoding: 'utf8' });
  const envReplacement = envJsOrigin.replace(/componentsDir\:(.*)\n/, 'componentsDir: \'components\',');
  await fs.writeFile(envPath, envReplacement);

  // 替换build文件
  const buildMainReg = new RegExp(componentMark + '/main');
  const buildSettingReg = new RegExp(componentMark + '/setting');

  const buildDevPath = path.resolve(target, 'build/webpack.config.dev.js');
  const buildDevJsOrigin = await fs.readFile(buildDevPath, { encoding: 'utf8' });
  const buildDevJsReplacement = buildDevJsOrigin.replace(buildMainReg, '\./main').replace(buildSettingReg, '\./setting');
  await fs.writeFile(buildDevPath, buildDevJsReplacement);

  const buildProdPath = path.resolve(target, 'build/webpack.config.production.js');
  const buildProdJsOrigin = await fs.readFile(buildProdPath, { encoding: 'utf8' });
  const buildProdJsReplacement = buildProdJsOrigin.replace(buildMainReg, '\./main').replace(buildSettingReg, '\./setting');
  await fs.writeFile(buildProdPath, buildProdJsReplacement);

  // 替换options.json
  const optionsPath = path.resolve(target, 'options.json');
  const optionsObj = await fs.readJson(optionsPath);
  optionsObj.components[0].type = componentId;
  optionsObj.options.scaleMode = 'width';
  await fs.writeJson(optionsPath, optionsObj);
}


async function copyAndIgnore(src, dest, ignores) {
  await fs.copy(src, dest, { filter: src => {
    const basename = path.basename(src);
    return !ignores.some(item => basename === item);
  } });
}

