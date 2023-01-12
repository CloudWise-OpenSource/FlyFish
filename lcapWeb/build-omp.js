/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-03-11 10:16:06
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-06-30 19:00:29
 */
'use strict';
const simpleGit = require('simple-git');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const moment = require('moment');
const fs = require('fs');
const filePath = './lcapWeb/serviceVersion.json';
const lcapWebVersion = '1.5.0';
const productVersion = 'v5.7.0';

(async () => {
  try {
    const git = simpleGit('./');
    const { all: totalLogs } = await git.log();

    const hash = totalLogs[0].hash;
    const projectDir = "lcapWeb";
    const tarLib = `lcapWeb-${lcapWebVersion}-${moment().format('YYYYMMDDHHmmss')}-${hash.slice(0, 7)}.tar.gz`;
    fs.writeFileSync(filePath, JSON.stringify({ serverName: projectDir, lcapWebVersion: `v${lcapWebVersion}`, hash: hash.slice(0, 7),productVersion }));

    await exec(`cd ./lcapWeb && rm -rf target && mkdir target && cd ../ && tar -zcvf ${tarLib} ${projectDir} && mv ${tarLib} ${projectDir}/target`, { maxBuffer: 1024 * 1024 * 1024 });
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    process.exit(0);
  }
})();