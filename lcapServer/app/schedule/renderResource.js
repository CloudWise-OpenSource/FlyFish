'use strict';
const Subscription = require('egg').Subscription;
const _ = require('lodash');
const fs = require('fs');
const Enums = require('../lib/enum.js');
const puppeteer = require('puppeteer-core');

const INTERVAL = 10 * 60 * 1000;
const PARALLEL_NUM = 10;
const MAX_RERENDER_COUNT = 2;
class RenderResource extends Subscription {
  static get schedule() {
    return {
      interval: INTERVAL,
      type: 'worker',
      env: [ 'prod' ],
      disable: false,
    };
  }

  /**
   * 如果success, 更新资源cover地址
   */
  async subscribe() {
    const { ctx, logger, config: { apiKey, services: { docp: { baseURL } }, pathConfig: { staticDir, webPath, componentsPath, applicationPath } } } = this;
    let browser;

    const prxfix = '[render-schedule]';
    try {
      const browerConfig = await ctx.service.chrome.getBrowserConfig();
      if (_.isEmpty(browerConfig.webSocketDebuggerUrl)) {
        logger.info(`${prxfix} no webSocketDebuggerUrl config`);
        return;
      }
      browser = await puppeteer.connect({ browserWSEndpoint: browerConfig.webSocketDebuggerUrl });

      const query = {
        $or: [
          { renderStage: Enums.RENDER_STAGE.UNDONE },
          { renderStatus: Enums.RENDER_STATUS.FAIL },
        ],
        reRenderCount: { $lt: MAX_RERENDER_COUNT },
      };
      const undoneResources = await ctx.model.ResourceRenderRecords._find(query);
      if (undoneResources.length === 0) return;
      logger.info(`${prxfix} ${undoneResources.length} waitting to render`);

      const chunkedUndoneResources = _.chunk(undoneResources, PARALLEL_NUM);
      for (const chunk of chunkedUndoneResources) {
        // eslint-disable-next-line no-loop-func
        await Promise.all((chunk || []).map(async record => {
          const { id, type, version, width, height } = record;
          if (!id || !type) {
            logger.info(`${prxfix} ${id} no id | type`);
            return;
          }

          let page,
            coll,
            url,
            savePath,
            imgPath;

          switch (type) {
            case Enums.RESOURCE_TYPE.APPLICATION:
              coll = 'Application';
              url = `${baseURL}/${webPath}/screen/index.html?id=${id}`;
              savePath = `${staticDir}/${applicationPath}/${id}/cover.jpeg`;
              imgPath = `/${applicationPath}/${id}/cover.jpeg`;
              if (!fs.existsSync(`${staticDir}/${applicationPath}/${id}`)) fs.mkdirSync(`${staticDir}/${applicationPath}/${id}`);
              break;
            case Enums.RESOURCE_TYPE.COMPONENT:
              coll = 'Component';
              url = `${baseURL}/${componentsPath}/${id}/${version}/index.html`;
              savePath = `${staticDir}/${componentsPath}/${id}/${version}/components/cover.jpeg`;
              imgPath = `/${componentsPath}/${id}/${version}/components/cover.jpeg`;
              break;
            default:
              break;
          }
          if (!url || !savePath) {
            logger.info(`${prxfix} ${id} no url | savePath config`);
            return;
          }

          try {
            await ctx.model.ResourceRenderRecords._updateOne({ id }, { renderStage: Enums.RENDER_STAGE.DOING });

            page = await browser.newPage();
            await page.setViewport({ width: +width || 1920, height: +height || 1080 });
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

            const fullPagePng = await page.screenshot({ type: 'jpeg', quality: 40, fullPage: true });
            fs.writeFileSync(savePath, fullPagePng);

            await ctx.model[coll]._updateOne({ id }, { cover: imgPath });
            await ctx.model.ResourceRenderRecords._updateOne({ id }, { renderStage: Enums.RENDER_STAGE.DONE, renderStatus: Enums.RENDER_STATUS.SUCCESS });
            logger.info(`${prxfix} ${id} render success`);
          } catch (error) {
            await ctx.model.ResourceRenderRecords._updateOne({ id }, { $inc: { reRenderCount: 1 }, renderStage: Enums.RENDER_STAGE.DONE, renderStatus: Enums.RENDER_STATUS.FAIL });
            logger.info(`${prxfix} ${id} render fail: ${error.stack || error}`);
          } finally {
            if (page) await page.close();
            page = null;
          }
        }));
      }
    } catch (error) {
      logger.error(`${prxfix} render fail: ${error.stack || error}`);
    } finally {
      logger.info(`${prxfix} render done`);
    }
  }
}

module.exports = RenderResource;
