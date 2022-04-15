'use strict';
const simpleGit = require('simple-git');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const moment = require('moment');

(async () => {
  try {
    const git = simpleGit('./');
    const { all: totalLogs } = await git.log();

    const hash = totalLogs[0].hash;
    const projectDir = 'lcapCodeServer';
    const tarLib = `lcapCodeServer-1.2.0-${moment().format('YYYYMMDDHHmmss')}-${hash.slice(0, 7)}.tar.gz`;

    await exec(`cd target && rm -rf ${projectDir}* && cd ../../ && tar -zcvf ${tarLib} --exclude=.scannerwork --exclude=.git --exclude=macos ${projectDir} && mv ${tarLib} ${projectDir}/target`, { maxBuffer: 1024 * 1024 * 1024 });
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    process.exit(0);
  }
})();
