'use strict';
const Subscription = require('egg').Subscription;
const simpleGit = require('simple-git');
const _ = require('lodash');

const INTERVAL = 2 * 60 * 1000;

class PushComponent extends Subscription {
  static get schedule() {
    return {
      interval: INTERVAL, // 2 分钟间隔
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务
      env: [ 'prod' ],
      // disable: true,
    };
  }

  async subscribe() {
    const { ctx, logger, config: { pathConfig: { staticDir, componentsPath, initComponentVersion } } } = this;
    let successCount = 0;

    try {
      const query = {
        needPushGit: true,
        lastChangeTime: { $lte: Date.now() - INTERVAL },
      };
      const needPushComponents = await ctx.model.Component._find(query);
      if (needPushComponents.length === 0) return;
      logger.info(`${needPushComponents.length} 个组件等待被提交`);

      const updaters = new Set();
      needPushComponents.forEach(c => updaters.add(c.updater));
      const updaterInfos = await ctx.model.User._find({ id: { $in: [ ...updaters ] } });
      const updaterMap = _.keyBy(updaterInfos, 'id');

      await Promise.all(needPushComponents.map(async component => {
        const componentDevPath = `${staticDir}/${componentsPath}/${component.id}/${initComponentVersion}`;
        const updateUsername = updaterMap[component.updater] && updaterMap[component.updater].username || 'system';

        const git = simpleGit(componentDevPath);
        const status = await git.status();
        if (!status.isClean()) {
          await git
            .add('.')
            .commit(`Update #LOWCODE-581 commit by ${updateUsername}`)
            .push([ 'origin', 'master' ]);

          await ctx.model.Component._updateOne({ id: component.id }, { needPushGit: false, lastChangeTime: Date.now() });
          successCount++;
        }
      }));
    } catch (error) {
      logger.error(error.stack || error);
    } finally {
      console.log(`本次提交成功 ${successCount}个`);
    }
  }
}

module.exports = PushComponent;
