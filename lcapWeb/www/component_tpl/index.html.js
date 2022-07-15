/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2022-02-11 17:45:58
 * @LastEditors: tiger.wang
 * @LastEditTime: 2022-04-09 17:14:25
 */
'use strict';
module.exports = (componentId, version, urlPath) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Data-VI 数据可视化</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<div id="container" style="height:100%"></div>
<script type="text/javascript" src="${urlPath}/components/${componentId}/${version}/env.js"></script>
<script type="text/javascript" src="${urlPath}/common/data-vi.js"></script>
<script type="text/javascript">
    window.onload = function () {

        require(['json!./options.json','data-vi/helpers', 'data-vi/start'], function (settings, _, start) {
            var appSettings = {
              pages:settings
            }
            start.initializeBySetting(document.getElementById('container'), appSettings);
        });
    };
</script>
</body>
</html>
`;
