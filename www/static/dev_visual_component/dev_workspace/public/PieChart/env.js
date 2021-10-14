
/**
 * @description 大屏配置
 */
window.DATAVI_ENV = (function () {
    var appPath = '/static/dev_visual_component/dev_workspace/public/PieChart';

    function formatEditorThumbSrc(imgName) {
        return 'asserts/img/components/' + imgName;
    }

    return {
        debug: true,
        apiDomain: 'http://10.0.1.154:9090',
        componentsDir: appPath.replace(/^\//, '') + '/components',

        // 大屏编辑器组件菜单枚举
        componentsMenuForEditor: [
            {
                name: '常用组件',
                icon: 'changyongzujian',
                components: [
                    {
                        type: 'PieChart',
                        name: '线图',
                        author: '天机数据',
                        description: '标准线图',
                        thumb: formatEditorThumbSrc('system-hchart-line.png')
                    }
                ]
            },
            {
                name: '辅助组件',
                icon: 'fuzhuzujian',
                components: []
            }
        ]

    }
})();
