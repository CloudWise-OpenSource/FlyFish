"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../common/util");
require("../register");
const options = util_1.getOptions();
const el = document.getElementById("base");
if (el) {
    el.value = options.base;
}
//# sourceMappingURL=login.js.map