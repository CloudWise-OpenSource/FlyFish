const MESSAGE_TYPE_PREFIX = "COMPONENT_VIEW_DRAWER_SCREEN_COMPONENT_MESSAGE";

export const MESSAGE_TYPES = {
  loaded: `${MESSAGE_TYPE_PREFIX}_LOADED`,
};

export const getScreenHTML = (screenOffset, component) => {
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

        <script type="text/javascript" src="${window.LCAP_CONFIG.wwwAddress}/web/screen/config/env.js"></script>
        <script type="text/javascript">
          window.DATAVI_ENV.componentsDir = "${window.LCAP_CONFIG.wwwAddress}/components"
        </script>
        <script type="text/javascript" src="${window.LCAP_CONFIG.wwwAddress}/common/data-vi.js"></script>
        <script type="text/javascript">
          
          window.onload = function () {

              require(['json!${window.LCAP_CONFIG.wwwAddress}/components/${component.id}/v-current/options.json','data-vi/helpers', 'data-vi/start'], function (settings, _, start) {
                  try {
                    settings.options.width = ${screenOffset.width};
                    settings.options.height = ${screenOffset.height};
                    settings.components =  settings.components.map(component => {
                      component.config.height = ${screenOffset.height - 20 };
                      component.config.width = ${Math.ceil(screenOffset.width / 3 * 2)};
                      component.config.top = 10;
                      component.config.left = ${Math.ceil(screenOffset.width / 6)};
                      return component;
                    });
                    window.parent.postMessage(JSON.stringify({
                      type: "${MESSAGE_TYPES.loaded}",
                      data: null
                    }));
                    start.initializeBySetting(document.getElementById('container'), settings);
                  } catch(e) {
                    console.info(e);
                  }
              });
          };
        </script>
      </body>
  `;
};
