'use strict';

module.exports = Object.assign(require('../../config/config.development')({}), {
  mysql: {
    visual_component_uri: 'mysql://Rootmaster:Rootmaster@777@10.2.3.56:3306/visual_component_platform',
    solution_uri: 'mysql://Rootmaster:Rootmaster@777@10.2.3.56:3306/solution_platform',
  },
  old_vc_www: '/resources/flyFish/visual_component_platform_server/www',
  old_solution_www: '/resources/flyFish/solution-platform-server/www',
  rdep_yapi: {
    url: 'mongodb://10.2.3.174:27000/yapi',
  },
  dodb: {
    url: 'mysql://Rootmaster:Rootmaster@777@10.0.3.142:18103/cw_dodb',
  },
  douc: {
    url: 'mysql://Rootmaster:Rootmaster@777@10.2.2.253:18103/cw_douc',
  },
});
