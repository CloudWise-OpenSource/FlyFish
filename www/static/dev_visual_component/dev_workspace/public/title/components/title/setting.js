/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/screen/components/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/setting.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/setting.js":
/*!************************!*\
  !*** ./src/setting.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var datavi_editor_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! datavi-editor/adapter */ "datavi-editor/adapter");
/* harmony import */ var datavi_editor_adapter__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(datavi_editor_adapter__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _settings_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings/data */ "./src/settings/data.js");
/* harmony import */ var _settings_options__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./settings/options */ "./src/settings/options.js");

/**
 * @description 注册title组件的设置面板
 */





Object(datavi_editor_adapter__WEBPACK_IMPORTED_MODULE_0__["registerComponentOptionsSetting"])("title", _settings_options__WEBPACK_IMPORTED_MODULE_2__["default"]);
Object(datavi_editor_adapter__WEBPACK_IMPORTED_MODULE_0__["registerComponentDataSetting"])("title", _settings_data__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./src/settings/data.js":
/*!******************************!*\
  !*** ./src/settings/data.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! datavi-editor/templates */ "datavi-editor/templates");
/* harmony import */ var datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var DataSetting = function (_ComponentDataSetting) {
  _inherits(DataSetting, _ComponentDataSetting);

  function DataSetting() {
    _classCallCheck(this, DataSetting);

    return _possibleConstructorReturn(this, (DataSetting.__proto__ || Object.getPrototypeOf(DataSetting)).apply(this, arguments));
  }

  _createClass(DataSetting, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);
    }
  }]);

  return DataSetting;
}(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["ComponentDataSetting"]);

/* harmony default export */ __webpack_exports__["default"] = (DataSetting);

/***/ }),

/***/ "./src/settings/options.js":
/*!*********************************!*\
  !*** ./src/settings/options.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! datavi-editor/templates */ "datavi-editor/templates");
/* harmony import */ var datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var TextArea = datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"].TextArea;

var OptionsSetting = function (_ComponentOptionsSett) {
    _inherits(OptionsSetting, _ComponentOptionsSett);

    function OptionsSetting(props) {
        _classCallCheck(this, OptionsSetting);

        var _this = _possibleConstructorReturn(this, (OptionsSetting.__proto__ || Object.getPrototypeOf(OptionsSetting)).call(this, props));

        var _props$options = props.options,
            text = _props$options.text,
            isLink = _props$options.isLink,
            hrefUrl = _props$options.hrefUrl,
            isNewWindow = _props$options.isNewWindow,
            color = _props$options.color,
            fontSize = _props$options.fontSize,
            fontFamily = _props$options.fontFamily,
            fontWeight = _props$options.fontWeight,
            justifyContent = _props$options.justifyContent,
            alignItems = _props$options.alignItems;

        _this.state = {
            text: text,
            isLink: isLink,
            hrefUrl: hrefUrl,
            isNewWindow: isNewWindow,
            color: color,
            fontFamily: fontFamily,
            fontWeight: fontWeight,
            fontSize: fontSize,
            justifyContent: justifyContent,
            alignItems: alignItems
        };
        return _this;
    }

    /**
     * 获取Tabs项
     */


    _createClass(OptionsSetting, [{
        key: 'getTabs',
        value: function getTabs() {
            var _this2 = this;

            return {
                config: {
                    label: '配置',
                    content: function content() {
                        return _this2.renderTitle();
                    }
                }
            };
        }

        /**
         * 渲染标题
         */

    }, {
        key: 'renderTitle',
        value: function renderTitle() {
            var _this3 = this;

            var _props$options2 = this.props.options,
                options = _props$options2 === undefined ? {} : _props$options2;
            var _state = this.state,
                _state$text = _state.text,
                text = _state$text === undefined ? '' : _state$text,
                _state$hrefUrl = _state.hrefUrl,
                hrefUrl = _state$hrefUrl === undefined ? '' : _state$hrefUrl;

            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Form"],
                null,
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItemGroup"],
                    null,
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'div',
                        { style: { fontSize: 14, fontWeight: 700, padding: '10px 0' } },
                        '\u5185\u5BB9'
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                        null,
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TextArea, {
                            placeholder: '\u652F\u6301HTML\u6807\u7B7E\u5199\u6CD5',
                            value: text,
                            onChange: function onChange(event) {
                                return _this3.setState({ text: event.target.value });
                            },
                            rows: '6', autosize: { minRows: 4, maxRows: 10 },
                            onBlur: function onBlur() {
                                return _this3.updateOptions({ text: text });
                            }
                        })
                    )
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItemGroup"],
                    { title: '文字', labelCol: { span: 4 }, wrapperCol: { span: 20 } },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                        { label: '\u5B57\u4F53\u6837\u5F0F' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Select"],
                            {
                                placeholder: '\u8BF7\u9009\u62E9\u5B57\u4F53\u6837\u5F0F',
                                value: options.fontFamily,
                                onChange: function onChange(value) {
                                    return _this3.updateOptions({ fontFamily: value });
                                }
                            },
                            ['inherit', 'serif', 'sans-serif', 'cursive', 'fantasy', 'monospace'].map(function (item) {
                                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    Option,
                                    { key: item, value: item },
                                    item
                                );
                            })
                        )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                        { label: '\u5B57\u4F53\u5927\u5C0F' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["InputNumber"], {
                            value: parseInt(options.fontSize),
                            min: 12,
                            onChange: function onChange(value) {
                                return _this3.updateOptions({ fontSize: value });
                            }
                        })
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                        { label: '\u5B57\u4F53\u7C97\u7EC6' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Select"],
                            {
                                placeholder: '\u8BF7\u9009\u62E9\u5B57\u4F53\u6837\u5F0F',
                                value: options.fontWeight,
                                onChange: function onChange(value) {
                                    return _this3.updateOptions({ fontWeight: value });
                                }
                            },
                            [100, 200, 300, 400, 500, 600, 700, 800].map(function (item) {
                                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    Option,
                                    { key: item, value: item },
                                    item
                                );
                            })
                        )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                        { label: '\u5B57\u4F53\u989C\u8272' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["ColorPickerInput"], {
                            value: options.color,
                            onChange: function onChange(color) {
                                return _this3.updateOptions({ color: color });
                            }
                        })
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                        { label: '\u6C34\u5E73\u5BF9\u9F50' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            'div',
                            { style: { width: '115px' } },
                            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"].Group,
                                {
                                    onChange: function onChange(event) {
                                        return _this3.updateOptions({ justifyContent: event.target.value });
                                    },
                                    value: options.justifyContent },
                                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                                    { value: 'flex-start' },
                                    '\u5DE6'
                                ),
                                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                                    { value: 'center' },
                                    '\u4E2D'
                                ),
                                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                                    { value: 'flex-end' },
                                    '\u53F3'
                                )
                            )
                        )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                        { label: '\u5782\u76F4\u5BF9\u9F50' },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            'div',
                            { style: { width: '115px' } },
                            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"].Group,
                                {
                                    onChange: function onChange(event) {
                                        return _this3.updateOptions({ alignItems: event.target.value });
                                    },
                                    value: options.alignItems },
                                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                                    { value: 'flex-start' },
                                    '\u4E0A'
                                ),
                                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                                    { value: 'center' },
                                    '\u4E2D'
                                ),
                                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                                    { value: 'flex-end' },
                                    '\u4E0B'
                                )
                            )
                        )
                    )
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    'div',
                    { style: { fontSize: 14, fontWeight: 700, padding: '10px 0', borderTop: '1px solid #ccc' } },
                    '\u884C\u4E3A'
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                    { label: '\u662F\u5426\u5F00\u542F\u94FE\u63A5\u8DF3\u8F6C' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        'div',
                        { style: { width: '115px' } },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"].Group,
                            {
                                onChange: function onChange(event) {
                                    return _this3.updateOptions({ isLink: event.target.value });
                                },
                                value: options.isLink },
                            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                                { value: true },
                                '\u5F00\u542F'
                            ),
                            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                                datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                                { value: false },
                                '\u5173\u95ED'
                            )
                        )
                    )
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                    { label: '\u94FE\u63A5\u5730\u5740' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"], {
                        placeholder: '\u8BF7\u8F93\u5165\u70B9\u51FB\u8DF3\u8F6CUrl',
                        value: hrefUrl,
                        onChange: function onChange(event) {
                            return _this3.setState({ hrefUrl: event.target.value });
                        },
                        onBlur: function onBlur() {
                            return _this3.updateOptions({ hrefUrl: hrefUrl });
                        }
                    })
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
                    { label: '\u8D85\u94FE\u63A5\u6253\u5F00\u7A97\u53E3\u65B9\u5F0F' },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                        datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"].Group,
                        {
                            onChange: function onChange(event) {
                                return _this3.updateOptions({ isNewWindow: event.target.value });
                            },
                            value: options.isNewWindow },
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                            { value: true },
                            '\u65B0\u7A97\u53E3'
                        ),
                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                            datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Radio"],
                            { value: false },
                            '\u5F53\u524D\u7A97\u53E3'
                        )
                    )
                )
            );
        }
    }]);

    return OptionsSetting;
}(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["ComponentOptionsSetting"]);

/* harmony default export */ __webpack_exports__["default"] = (OptionsSetting);

/***/ }),

/***/ "datavi-editor/adapter":
/*!**********************************!*\
  !*** external "dvEditorAdapter" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dvEditorAdapter;

/***/ }),

/***/ "datavi-editor/templates":
/*!********************************************!*\
  !*** external "dvEditorAdapter.templates" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dvEditorAdapter.templates;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ })

/******/ });
//# sourceMappingURL=setting.js.map