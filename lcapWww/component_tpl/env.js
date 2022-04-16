/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-29 15:13:02
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-01-09 19:05:20
 */
'use strict';

module.exports = urlPath => `
/**
 * @description 大屏配置
 */
 'use strict';

window.DATAVI_ENV = (function() {
    return {
        debug: true,
        apiDomain: 'http://127.0.0.1:9090',
        componentsDir: '${urlPath ? urlPath + '/components' : 'components'}',
    }
})();
`;
