'use strict';

const path = require('path');

module.exports.rgPath = path.join(__dirname, `../bin/rg${process.platform === 'win32' ? '.exe' : ''}`);