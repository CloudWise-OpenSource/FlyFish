'use strict';
const simpleGit = require('simple-git');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const moment = require('moment');
const fs = require('fs');
const filePath = '../serviceVersion.json';
const version = '1.3.0';

(async () => {
  try {
    const git = simpleGit('./');
    const { all: totalLogs } = await git.log();

    const hash = totalLogs[0].hash;
    const jobName = process.argv[2];
    const projectDir = 'lcapServer';
    const tarLib = `lcapServer-${version}-${moment().format('YYYYMMDDHHmmss')}-${hash.slice(0, 7)}.tar.gz`;
    await exec('cd ../target && rm -rf ./*');
    const tarCommand = `tar -zcvf ${tarLib} --exclude=.scannerwork --exclude=.git ${projectDir} && mv ${tarLib} ${jobName}/target/`;

    if (jobName) {
      if (jobName === projectDir) {
        await exec(`cd ../../ && ${tarCommand}`, { maxBuffer: 1024 * 1024 * 1024 });
      } else {
        await exec(`cd ../../ && rm -rf ${projectDir} && cp -rf ${jobName} ${projectDir} && ${tarCommand}`, { maxBuffer: 1024 * 1024 * 1024 });
      }
    } else {
      console.log('no match');
    }

    fs.writeFileSync(filePath, JSON.stringify({ serverName: projectDir, version: `v${version}`, hash: hash.slice(0, 7) }));
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    process.exit(0);
  }
})();
