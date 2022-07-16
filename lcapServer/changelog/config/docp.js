'use strict';

module.exports = Object.assign(require('../../config/config.docp')({}), {
  douc: {
    url: 'mysql://${CW_MYSQL_USERNAME}:${CW_MYSQL_PASSWORD}@${CW_MYSQL_IP}:${CW_MYSQL_PORT}/cw_douc',
  },
});
