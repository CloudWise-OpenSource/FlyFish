'use strict';

module.exports = (component_mark, version) => `
'use strict';

/**
 * @description 注册${component_mark}组件到大屏中
 */

import { registerComponent } from "data-vi/components";

import Component from "./Component";

registerComponent("${component_mark}", "${version}", Component);
`;
