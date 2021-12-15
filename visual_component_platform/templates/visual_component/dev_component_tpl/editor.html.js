/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-04 10:27:43
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-07-27 11:39:20
 */
module.exports = (webCommonPath, webDevWorkspacePath, org_mark, component_mark) =>`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Data-VI 数据可视化</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="${webCommonPath}/common/asserts/public/editor.css" />
</head>
<body>
<div id="container"></div>
<script type="text/javascript" src="${webDevWorkspacePath}/${org_mark}/${component_mark}/env.js"></script>
<script type="text/javascript" src="${webCommonPath}/common/asserts/public/data-vi.js"></script>
<script type="text/javascript" src="${webCommonPath}/common/asserts/public/editor.js"></script>
<script type="text/javascript">
    window.onload = function () {

        require(['json!./options.json','data-vi/helpers', 'datavi-editor/adapter'], function (settings,_, adapter) {

            var id = _.getUrlParam('id');

            if (id) {
                adapter.initEditorById(id);
            } else {
                adapter.initEditor(settings);
            }

        });
    };
</script>
</body>
</html>
`;


