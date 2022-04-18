/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-06-04 10:27:43
 * @LastEditors: tiger.wang
 * @LastEditTime: 2022-04-09 17:13:21
 */
'use strict';
module.exports = (componentId, version, urlPath) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Data-VI 数据可视化</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="${urlPath}/common/editor.css" />
</head>
<body>
<div id="container" style="height: 100%;"></div>
<script type="text/javascript" src="${urlPath}/components/${componentId}/${version}/env.js"></script>
<script type="text/javascript" src="${urlPath}/common/data-vi.js"></script>
<script type="text/javascript" src="${urlPath}/common/editor.js"></script>
<script type="text/javascript">
    window.onload = function () {

        require(['json!./options.json','data-vi/helpers', 'datavi-editor/adapter'], function (settings,_, adapter) {
            adapter.initComponentEditor(settings);
        });
    };
    const compileListener = function(event){
      if (event && event.data) {
        if ("vscode_compile" ===event.data) {
          window.location.reload(true)
        }
      }
    }
    window.addEventListener('message',compileListener)
</script>
</body>
</html>
`;

