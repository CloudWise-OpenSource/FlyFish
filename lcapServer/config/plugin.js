'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  http: {
    enable: true,
    package: 'egg-axios',
  },
  joi: {
    enable: true,
    package: 'egg-joi',
  },
  httpProxy: {
    enable: true,
    package: 'egg-http-proxy',
  },
};
