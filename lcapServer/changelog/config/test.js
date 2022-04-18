'use strict';

module.exports = Object.assign(require('../../config/config.test')({}), {
  mysql: {
    visual_component_uri: 'mysql://root:Admin@123@10.2.3.247:3306/visual_component_platform',
    solution_uri: 'mysql://root:Admin@123@10.2.3.247:3306/solution_platform',
  },
  old_vc_www: '/resources/flyFish/visual_component_platform_server/www',
  old_solution_www: '/resources/flyFish/solution-platform-server/www',
  rdep_yapi: {
    url: '',
  },
  dodb: {
    url: '',
  },
  douc: {
    url: '',
  },
});
