const MESSAGE_TYPE_PREFIX = 'DATA_SEARCH_SCREEN_COMPONENT_MESSAGE';

export const MESSAGE_TYPES = {
  loaded: `${MESSAGE_TYPE_PREFIX}_LOADED`,
  update: `${MESSAGE_TYPE_PREFIX}_UPDATE`,
};

export const getScreenHTML = (component, data, config, fields) => {
  return `
      <head>
        <meta charset="UTF-8" />
        <title>云智慧</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="renderer" content="webkit" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type="text/css" href="${
          window.FLYFISH_CONFIG.wwwAddress
        }/common/editor.css" />
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
          .ant4-form-item .ant4-form-item-label {
            width: 100%;
            padding-bottom: 0px;
          }
          .ant4-form-item {
            margin-bottom: 5px;
          }
          .ant4-form-item .ant4-form-item-label:after {
            content: ":";
          }
        </style>
      </head>
      <body>
        <div id="container"></div>

        <script type="text/javascript" src="${
          window.FLYFISH_CONFIG.wwwAddress
        }/web/screen/config/env.js"></script>
        <script type="text/javascript" src="${
          window.FLYFISH_CONFIG.wwwAddress
        }/common/data-vi.js"></script>
        <script type="text/javascript" src="${
          window.FLYFISH_CONFIG.wwwAddress
        }/common/editor.js"></script>
        <script type="text/javascript" src="${
          window.FLYFISH_CONFIG.wwwAddress
        }/components/${component.id}/${
    component.version
  }/release/setting.js"></script>
        <script type="text/javascript">
            window.onload = function () {
              require(["datavi-editor/adapter","datavi-editor/antd"], function (
                adapter,
                antd
              ) {
                    window.parent.postMessage(JSON.stringify({
                        type: "${MESSAGE_TYPES.loaded}",
                        data: null
                    }));
                    let ConfigComponentSetting = adapter.getComponentDataSetting("${
                      component.id
                    }", "${component.version}");

                    if (ConfigComponentSetting) {
                        function ConfigComponent(props) {
                            const [config, setConfig] = React.useState(props.config);
                            return React.createElement(
                              antd.ConfigProvider,
                              { prefixCls: 'ant4' },
                              React.createElement(ConfigComponentSetting, {
                                config: config,
                                data: props.data,
                                fields: props.fields,
                                update: function(newConfig) {
                                    setConfig(newConfig);
                                    console.log(window)
                                    window.parent.postMessage(JSON.stringify({
                                        type: "${MESSAGE_TYPES.update}",
                                        data: newConfig
                                    }));
                                },
                              })
                            );
                        }
                        ReactDom.render(
                            React.createElement(ConfigComponent, {
                                config: ${JSON.stringify(config || {})},
                                data: ${JSON.stringify(data || {})},
                                fields: ${JSON.stringify(fields)},
                            }),
                            document.getElementById("container")
                        );
                    } else {
                        ReactDom.render(
                            React.createElement("div", {
                                style: {
                                    marginTop: "15px",
                                    textAlign: "center"
                                }
                            },  "${component.name}组件暂不支持设置"),
                            document.getElementById("container")
                        );
                    }
              });
            };
        </script>
      </body>
  `;
};
