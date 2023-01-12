const MESSAGE_TYPE_PREFIX = 'DATA_SEARCH_SCREEN_COMPONENT_MESSAGE';

export const MESSAGE_TYPES = {
  loaded: `${MESSAGE_TYPE_PREFIX}_LOADED`,
};

export const getDefaultScreenJson = (
  screenSetting,
  component,
  componentSetting,
  data,
  dataConfig
) => {
  if (screenSetting == null) {
    screenSetting = {};
  }
  if (component == null) {
    component = {};
  }
  if (componentSetting == null) {
    componentSetting = {};
  }
  if (dataConfig == null) {
    dataConfig = {};
  }
  return [
    {
      id: '8F3P-7KQ1-FULM-VSPM-RD5I-S8DL',
      options: {
        name: '数据可视化大屏幕',
        width: 1920,
        height: 1080,
        scaleMode: 'origin',
        css: '',
        backgroundColor: '#0B1427',
        backgroundImage: '',
        backgroundRepeat: false,
        componentApiDomain: '',
        ENVGlobalOptions: {},
        faviconIocImage: '',
        ...screenSetting,
      },
      components: [
        {
          type: component.id,
          id: 'AVPD-QN91-FULN-05M3-RSDT-38M8',
          config: {
            name: '',
            left: 30,
            top: 30,
            width: 450,
            height: 280,
            visible: true,
            ...componentSetting,
          },
          options: {},
          connects: {},
          version: component.version,
          dataSource: {
            type: 'json',
            options: {
              json: JSON.stringify(data || {}),
            },
            config: {
              ...dataConfig,
            },
          },
        },
      ],
      dataSources: [],
      events: [],
      functions: [],
    },
  ];
};

export const getScreenHTML = (settings) => {
  return `
      <head>
        <meta charset="UTF-8" />
        <title>云智慧</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="renderer" content="webkit" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" title="Favicon" />
        <style type="text/css">
          html,
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
          }

          #container {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            position: absolute;
          }
        </style>
      </head>
      <body>
        <div id="container"></div>

        <script type="text/javascript" src="${window.FLYFISH_CONFIG.wwwAddress}/web/screen/config/env.js"></script>
        <script type="text/javascript">
          window.DATAVI_ENV.componentsDir = "${window.FLYFISH_CONFIG.wwwAddress}/components"
        </script>
        <script type="text/javascript" src="${window.FLYFISH_CONFIG.wwwAddress}/common/data-vi.js"></script>
        <script type="text/javascript">
          window.onload = function () {
              require(["data-vi/start"], function (
                start
              ) {
                window.parent.postMessage(JSON.stringify({
                    type: "${MESSAGE_TYPES.loaded}",
                    data: null
                }));
                var setting = ${settings};
                start.initializeBySetting(
                  document.getElementById("container"),
                  setting
                );
              });
            };
        </script>
      </body>
  `;
};
