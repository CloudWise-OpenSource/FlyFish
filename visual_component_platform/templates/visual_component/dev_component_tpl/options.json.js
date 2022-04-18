module.exports = (component_mark) => `{
    "options": {
        "width": 1920,
        "height": 1080,
        "name": "本地测试大屏",
        "scaleMode": "origin",
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
            "type": "${component_mark}",
            "id": "UBKO-08U1-C9L4-6OJF-3OMB-3OFN",
            "config": {
                "left": 534,
                "top": 242,
                "width": 883,
                "height": 645,
                "index": 0,
                "name": "${component_mark}",
                "visible": true,
                "class": ""
            }
        }
    ]
}
`;