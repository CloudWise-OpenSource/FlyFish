/**
 * Created by chencheng on 16-10-11.
 */
var tplStr = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="author" content="数据可视化,Smart View">

        <title>天机数据 - 中国领先的大数据解决方案提供商</title>
        <link rel="icon" href="/favicon.ico">
        <meta name="description" content="中国领先的大数据解决方案提供商，成熟的大数据基础平台，顶级的技术研发团队，快速的实施交付能力。集大数据采集、数据分析和数据可视化为一体，提供高效可靠的一站式大数据平台。">
        <meta name="keyword" content="天机数据，大数据，大数据采集，大数据分析，大数据可视化，一站式大数据平台，天机，数据，大数据解决方案">

        <link href="{$publicVendorCSS}" rel="stylesheet">
    </head>

    <body>

        <div id="wrapper"></div>

        <script src="{$EnvConfJS}"></script>
        <script src="{$runtime}"></script>
        <script src="{$publicVendorJS}"></script>
        <script src="{$publicAppJS}"></script>

    </body>

</html>
`;

module.exports = tplStr;
