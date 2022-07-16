'use strict';
const Service = require('egg').Service;

const util = require('util');
const axios = require('axios');
const _ = require('lodash');
const exec = util.promisify(require('child_process').exec);

let relunachCount = 0;
const MaxRelunachCount = 3;

class ChromeService extends Service {
  async getBrowserConfig() {
    const { logger, config: { services: { chrome } } } = this;
    let browerConfig = {};
    if (relunachCount > MaxRelunachCount) {
      logger.info(`[broswer-debug] getBrowserConfig relunach limit overflow: ${relunachCount}`);
      return browerConfig;
    }

    try {
      browerConfig = await axios.get(`http://${chrome.host}:${chrome.port}/json/version`, { json: true });
    } catch (error) {
      logger.info(`[broswer-debug] get browser error: ${error}`);
      await this.lunachChrome();
    } finally {
      await this.clearCoreDump();
    }

    return browerConfig;
  }

  async lunachChrome() {
    const { logger, app: { baseDir }, config: { services: { chrome }, pathConfig: { dataDir, logsDir } } } = this;
    if (relunachCount > MaxRelunachCount) {
      logger.info(`[broswer-debug] lunachChrome relunach limit overflow: ${relunachCount}`);
      return;
    }

    try {
      await exec(`${baseDir}/lib/chrome-linux/chrome --user-data-dir=${dataDir} --remote-debugging-port=${chrome.port} --headless --no-sandbox --enable-banchmarking --enable-net-benchmarking  --disable-software-rasterizer --disable-gpu >> ${logsDir}/chrome.log 2>&1 &`);
      logger.info('[broswer-debug] chrome lunach success');
    } catch (error) {
      logger.info(`[broswer-debug] chrome lunach error: ${error}`);
    } finally {
      if (relunachCount) logger.info('[broswer-debug] relunachCount:', relunachCount);
      relunachCount++;
      await this.clearCoreDump();
    }
  }

  async clearCoreDump() {
    const { logger, app: { baseDir } } = this;
    try {
      await exec(`cd ${baseDir} && rm -rf core.*`);
    } catch (error) {
      logger.info(`clear dump file error: ${error}`);
    }
  }
}

module.exports = ChromeService;
