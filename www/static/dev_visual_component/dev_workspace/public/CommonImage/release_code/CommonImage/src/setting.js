
/**
 * @description 注册CommonImage组件的设置面板
 */
import {
  registerComponentOptionsSetting,
} from "datavi-editor/adapter";

import OptionsSetting from "./settings/options";

registerComponentOptionsSetting("CommonImage", OptionsSetting);
