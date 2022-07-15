/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-30 18:14:06
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-02-15 17:46:15
 */

'use strict';

module.exports = (componentId, componentName) => `{
    "options": {
        "width": 1920,
        "height": 1080,
        "name": "本地测试大屏",
        "scaleMode": "cover",
        "backgroundColor": "#162C51",
        "backgroundImage": "",
        "css": ""
    },
    "events": [
    ],
    "functions": [
        {
            "name": "sayHello",
            "body": "console.log('hello '+name)",
            "args": "name"
        }
    ],
    "components": [
        {
            "type": "${componentId}",
            "id": "UBKO-08U1-C9L4-6OJF-3OMB-3OFN",
            "config": {
                "left": 534,
                "top": 242,
                "width": 883,
                "height": 645,
                "index": 0,
                "name": "${componentName}",
                "visible": true,
                "class": ""
            }
        }
    ]
}
`;
