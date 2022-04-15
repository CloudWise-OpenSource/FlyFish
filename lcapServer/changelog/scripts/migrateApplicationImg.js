'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const mongoUrl = config.get('mongoose.clients.flyfish.url');
const staticDir = config.get('pathConfig.staticDir');
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
    const appDir = path.resolve(staticDir, 'applications');
    const apps = await db.collection('applications').find({ migrated: { $exists: false } }).toArray();
    console.log(`待迁移: ${apps.length}个`);

    for (const app of apps) {
      try {
        const page = app.pages[0];
        if (!page.options) continue;

        if (page.options.backgroundImage) {
          const bgImgSource = path.resolve(oldSolutionWww, page.options.backgroundImage);
          const gbImgBasename = path.basename(page.options.backgroundImage);
          const bgImgTarget = path.resolve(appDir, app._id.toString(), gbImgBasename);
          const bgImgSourceExist = fs.existsSync(bgImgSource);
          if (bgImgSourceExist) {
            await fs.copy(bgImgSource, bgImgTarget);
            page.options._backgroundImage = page.options.backgroundImage;
            page.options.backgroundImage = path.join('applications', app._id.toString(), gbImgBasename);
          }
        }

        for (const component of page.components) {
          if (component.options.image) {
            const componentImgSource = path.resolve(oldSolutionWww, component.options.image);
            const componentImgBasename = path.basename(component.options.image);
            const componentImgTarget = path.resolve(appDir, app._id.toString(), componentImgBasename);

            const componentImgSourceExist = fs.existsSync(componentImgSource);
            if (componentImgSourceExist) {
              await fs.copy(componentImgSource, componentImgTarget);
              component.options._image = component.options.image;
              component.options.image = path.join('applications', app._id.toString(), componentImgBasename);
            }
          }
        }

        // 迁移封面
        app.cover = '/application_tpl/public/cover.jpeg';// 默认封面
        if (app._cover) {
          const coverSource = path.resolve(oldSolutionWww, 'upload/screen/cover', app._cover);
          const coverTarget = path.resolve(appDir, app._id.toString(), 'cover.jpeg');
          const coverSourceExist = fs.existsSync(coverSource);
          if (coverSourceExist) {
            await fs.copy(coverSource, coverTarget);
            app.cover = `/applications/${app._id.toString()}/cover.jpeg`;
          }
        }

        await db.collection('applications').updateOne({ _id: app._id }, { $set: { pages: app.pages, cover: app.cover, migrated: true } });
        success++;
        console.log(`迁移成功：${app._id.toString()}`);
      } catch (error) {
        errList.push(app._id.toString());
        console.error(`失败：${app._id.toString()}  =====`, JSON.stringify(error.stack || error));
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

