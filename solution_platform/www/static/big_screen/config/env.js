/**
 * @description 大屏配置
 */

window.DATAVI_ENV = (function() {
    function formatEditorThumbSrc(imgName){
        return '/static/big_screen/asserts/img/components/' + imgName;
    }
    var apiDomain = 'http://127.0.0.1:8362';

    function getComponentCover(component_mark, account_id) {
      return `${apiDomain}/static/public_visual_component/${account_id}/${component_mark}/cover.png`;
    }

    return {
        debug: true,
        apiDomain: apiDomain,
        getComponentCover,
        componentsDir: 'http://10.2.2.236:8362/static/public_visual_component/1',
        apiSuccessCode: 200,     // API接口响应成功的code

        screenAPI: {    // 大屏展示和编辑用到的API
            getScreenData: '/web/visualScreen/screenEditor/getScreenConf',            // 获取大屏数据
            saveScreenConf: '/web/visualScreen/screenEditor/saveScreenConf',          // 保存大屏配置
            uploadScreenImg: '/web/visualScreen/screenEditor/uploadScreenImg',        // 上传大屏所需图片
            deleteUploadScreenImg: '/web/visualScreen/screenEditor/deleteUploadScreenImg',        // 删除上传的大屏所需图片

            getModelList: '/web/visualScreen/screenEditor/getModelList',             // 获取模型列表
            getModelData: '/web/visualScreen/screenEditor/getModelData',             // 获取模型数据

            getScreenTag: '/web/tag/visualScreenTag/getDetailByScreenId',             // 获取标签
            getScreenComponentByTag: '/web/visualComponents/component/getComponentListByTagId'   // 获取对应标签组件
        },

        // 大屏编辑器组件菜单枚举
        componentsMenuForEditor: [
            {
                name: '常用组件',
                icon: 'changyongzujian',
                components: [
                    // {
                    //     type: 'system/hchart-line',
                    //     name: '线图',
                    //     author: '天机数据',
                    //     description: '标准线图',
                    //     thumb: formatEditorThumbSrc('system-hchart-line.png')
                    // },
                    // {
                    //     type: 'system/hchart-column',
                    //     name: '柱状图',
                    //     author: '天机数据',
                    //     description: '标准柱状图',
                    //     thumb: formatEditorThumbSrc('system-hchart-column.png')
                    // },
                    // {
                    //     type: 'system/hchart-2y',
                    //     name: '双Y轴',
                    //     author: '天机数据',
                    //     description: '双Y轴',
                    //     thumb: formatEditorThumbSrc('system-hchart-2y.png')
                    // },
                    // {
                    //     type: 'system/hchart-pie',
                    //     name: '饼图',
                    //     author: '天机数据',
                    //     description: '饼图',
                    //     thumb: formatEditorThumbSrc('system-hchart-pie.png')
                    // },
                    // {
                    //     type: 'system/map',
                    //     name: '区域地图',
                    //     author: '天机数据',
                    //     description: '区域地图',
                    //     thumb: formatEditorThumbSrc('system-map.png')
                    // },
                    //
                    // {
                    //     type: 'system/hchart-radar',
                    //     name: '雷达图',
                    //     author: '天机数据',
                    //     description: '雷达图',
                    //     thumb: formatEditorThumbSrc('system-hchart-radar.png')
                    // }
                ]
            },
            {
                name: '辅助组件',
                icon: 'fuzhuzujian',
                components: [
                    // {
                    //     type: 'system/image',
                    //     name: '背景图片',
                    //     author: '天机数据',
                    //     description: '背景图片',
                    //     thumb: formatEditorThumbSrc('system-image.png')
                    // },
                    //
                    // {
                    //     type: 'system/text',
                    //     name: '文本标题',
                    //     author: '天机数据',
                    //     description: '自定义文本组件',
                    //     thumb: formatEditorThumbSrc('system-text.png')
                    // },
                    // {
                    //     type: 'system/select',
                    //     name: '下拉菜单',
                    //     author: '天机数据',
                    //     description: '下拉菜单',
                    //     thumb: formatEditorThumbSrc('system-select.png')
                    // },
                    // {
                    //     type: 'system/clock',
                    //     name: '时钟',
                    //     author: '天机数据',
                    //     description: '时钟',
                    //     thumb: formatEditorThumbSrc('system-clock.png')
                    // }
                ]
            }
        ]

    }
})();

