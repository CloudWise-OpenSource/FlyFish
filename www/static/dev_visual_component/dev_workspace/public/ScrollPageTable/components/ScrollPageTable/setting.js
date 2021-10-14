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

/***/ "./src/assets/empty.svg":
/*!******************************!*\
  !*** ./src/assets/empty.svg ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA2NCA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ij48L2VsbGlwc2U+PGcgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiNEOUQ5RDkiPjxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiPjwvcGF0aD48cGF0aCBkPSJNNDEuNjEzIDE1LjkzMWMwLTEuNjA1Ljk5NC0yLjkzIDIuMjI3LTIuOTMxSDU1djE4LjEzN0M1NSAzMy4yNiA1My42OCAzNSA1Mi4wNSAzNWgtNDAuMUMxMC4zMiAzNSA5IDMzLjI1OSA5IDMxLjEzN1YxM2gxMS4xNmMxLjIzMyAwIDIuMjI3IDEuMzIzIDIuMjI3IDIuOTI4di4wMjJjMCAxLjYwNSAxLjAwNSAyLjkwMSAyLjIzNyAyLjkwMWgxNC43NTJjMS4yMzIgMCAyLjIzNy0xLjMwOCAyLjIzNy0yLjkxM3YtLjAwN3oiIGZpbGw9IiNGQUZBRkEiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg=="

/***/ }),

/***/ "./src/constant.js":
/*!*************************!*\
  !*** ./src/constant.js ***!
  \*************************/
/*! exports provided: EMPTY, MINCONTAINERHEIGHT, TABLEHEADERHEIGHT, BORDERWIDTH, EVENTPREFIX, INTERVAL, PAGESIZE, MAXDISPAYPAGE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EMPTY", function() { return EMPTY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MINCONTAINERHEIGHT", function() { return MINCONTAINERHEIGHT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TABLEHEADERHEIGHT", function() { return TABLEHEADERHEIGHT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BORDERWIDTH", function() { return BORDERWIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVENTPREFIX", function() { return EVENTPREFIX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INTERVAL", function() { return INTERVAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PAGESIZE", function() { return PAGESIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAXDISPAYPAGE", function() { return MAXDISPAYPAGE; });
/* harmony import */ var _assets_empty_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/empty.svg */ "./src/assets/empty.svg");
/* harmony import */ var _assets_empty_svg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_empty_svg__WEBPACK_IMPORTED_MODULE_0__);


var EMPTY = {
  message: '暂无数据',
  icon: _assets_empty_svg__WEBPACK_IMPORTED_MODULE_0___default.a
};

var MINCONTAINERHEIGHT = 165;

var TABLEHEADERHEIGHT = 55;

var BORDERWIDTH = 1;

var EVENTPREFIX = 'scroll-page-table';

var INTERVAL = 1000;

var PAGESIZE = 15;

var MAXDISPAYPAGE = 10;

/***/ }),

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
/* harmony import */ var _settings_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings/options */ "./src/settings/options.js");
/* harmony import */ var _settings_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./settings/data */ "./src/settings/data.js");
/**
 * @description 注册组件的设置面板
 */





Object(datavi_editor_adapter__WEBPACK_IMPORTED_MODULE_0__["registerComponentOptionsSetting"])('ScrollPageTable', _settings_options__WEBPACK_IMPORTED_MODULE_1__["default"]);
Object(datavi_editor_adapter__WEBPACK_IMPORTED_MODULE_0__["registerComponentDataSetting"])('ScrollPageTable', _settings_data__WEBPACK_IMPORTED_MODULE_2__["default"]);

/***/ }),

/***/ "./src/settings/Extend.jsx":
/*!*********************************!*\
  !*** ./src/settings/Extend.jsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var datavi_editor_templates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! datavi-editor/templates */ "datavi-editor/templates");
/* harmony import */ var datavi_editor_templates__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var data_vi_modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! data-vi/modal */ "data-vi/components");
/* harmony import */ var data_vi_modal__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(data_vi_modal__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @description 扩展配置
 */








// 暂时datavi不能用hook, 先这样写

var Extend = function (_React$Component) {
  _inherits(Extend, _React$Component);

  function Extend() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Extend);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Extend.__proto__ || Object.getPrototypeOf(Extend)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      visible: false

      // emmm~ 不知为何放在state里弹框会闪
    }, _this.validateState = true, _this.toggleEditor = function () {
      _this.setState({
        visible: !_this.state.visible
      });
    }, _this.formatInitialValues = function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          sort = _ref2.sort;

      return {
        sort: _this.stringfiyFunction(sort)
      };
    }, _this.handleValidate = function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 1),
          status = _ref4[0];

      var validateState = true;
      if (status && status.type === 'error') {
        validateState = false;
      }
      _this.validateState = validateState;
    }, _this.handleContentChange = function (value) {
      var key = _this.state.key;

      console.log(value);
      if (!_this.validateState) {
        Object(data_vi_modal__WEBPACK_IMPORTED_MODULE_3__["showMsg"])('您输入的函数存在错误, 请检查');
      } else {
        var functionBody = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["matchFunctionBody"])(value);
        var transferData = null;
        try {
          // 暂时保留这种写法, 会丢掉对应的方法名
          transferData = new Function('data', functionBody);
          // 这里运行一下: 避免方法中存在错误导致组件崩溃
          eval(transferData([]));
        } catch (e) {
          console.warn(e);
          transferData = null;
          Object(data_vi_modal__WEBPACK_IMPORTED_MODULE_3__["showMsg"])('您输入的函数存在错误, 请检查');
        }
        if (transferData) {
          _this.toggleEditor();
          _this.props.onChange({ sort: transferData });
        }
      }
    }, _this.stringfiyFunction = function (value) {
      var func = '';
      try {
        func = String(value);
      } catch (e) {
        console.warn(e);
      }
      return func;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Extend, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          initialValues = _props.initialValues,
          onChange = _props.onChange;

      var formatValues = this.formatInitialValues(initialValues);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,
        null,
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          datavi_editor_templates__WEBPACK_IMPORTED_MODULE_2__["FormItem"],
          {
            name: 'options',
            label: '\u6392\u5E8F\u51FD\u6570',
            extra: '\u6CE8\u610F: \u70B9\u51FB\u8FDB\u884C\u7F16\u8F91\u3002\u786E\u4FDD\u8FD4\u56DE\u7684\u662F\u4E00\u4E2A\u6570\u7EC4\u3002\u5426\u5219\u4E0D\u4F1A\u4EA7\u751F\u4EFB\u4F55\u53D8\u5316',
            onClick: function onClick() {
              return _this2.toggleEditor();
            }
          },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_2__["Input"].TextArea, { name: 'options', value: formatValues.sort, style: { height: '30vh' }, placeholder: '\u8BF7\u70B9\u51FB\u8BBE\u7F6E\u6392\u5E8F\u51FD\u6570', disabled: true })
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_2__["EditorModal"], {
          title: '\u81EA\u5B9A\u4E49\u914D\u7F6E',
          mode: 'javascript',
          visible: this.state.visible,
          value: formatValues.sort,
          editorProps: {
            tabSize: 2,
            onValidate: this.handleValidate
          },
          onSave: this.handleContentChange,
          onCancel: function onCancel() {
            return _this2.toggleEditor();
          }
        })
      );
    }
  }]);

  return Extend;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

Extend.defaultProps = {
  initialValues: {},
  onChange: function onChange() {}
};

Extend.propTypes = {
  initialValues: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired
};

/* harmony default export */ __webpack_exports__["default"] = (Extend);

/***/ }),

/***/ "./src/settings/Form/constant.js":
/*!***************************************!*\
  !*** ./src/settings/Form/constant.js ***!
  \***************************************/
/*! exports provided: ESCAPEELEMENTTYPE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ESCAPEELEMENTTYPE", function() { return ESCAPEELEMENTTYPE; });
var ESCAPEELEMENTTYPE = ['Button'];

/***/ }),

/***/ "./src/settings/Form/index.jsx":
/*!*************************************!*\
  !*** ./src/settings/Form/index.jsx ***!
  \*************************************/
/*! exports provided: default, FormItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormItem", function() { return FormItem; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! datavi-editor/templates */ "datavi-editor/templates");
/* harmony import */ var datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/settings/Form/utils.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constant */ "./src/settings/Form/constant.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }







var Form = function (_React$Component) {
  _inherits(Form, _React$Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _initialiseProps.call(_this);

    _this.create(props);
    return _this;
  }

  _createClass(Form, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      // 阻止rerender
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          name = _props.name,
          initialValues = _props.initialValues,
          _props$onFieldsChange = _props.onFieldsChange,
          onFieldsChange = _props$onFieldsChange === undefined ? _utils__WEBPACK_IMPORTED_MODULE_2__["noop"] : _props$onFieldsChange,
          _props$onFinish = _props.onFinish,
          onFinish = _props$onFinish === undefined ? _utils__WEBPACK_IMPORTED_MODULE_2__["noop"] : _props$onFinish,
          _props$onFinishFailed = _props.onFinishFailed,
          onFinishFailed = _props$onFinishFailed === undefined ? _utils__WEBPACK_IMPORTED_MODULE_2__["noop"] : _props$onFinishFailed,
          _props$onValuesChange = _props.onValuesChange,
          onValuesChange = _props$onValuesChange === undefined ? _utils__WEBPACK_IMPORTED_MODULE_2__["noop"] : _props$onValuesChange,
          validateMessages = _props.validateMessages,
          _props$forwardForm = _props.forwardForm,
          forwardForm = _props$forwardForm === undefined ? _utils__WEBPACK_IMPORTED_MODULE_2__["noop"] : _props$forwardForm,
          restProps = _objectWithoutProperties(_props, ['name', 'initialValues', 'onFieldsChange', 'onFinish', 'onFinishFailed', 'onValuesChange', 'validateMessages', 'forwardForm']);

      return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](this.FormInstance, restProps);
    }
  }]);

  return Form;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.FormInstance = null;

  this.create = function (props) {
    var name = props.name,
        initialValues = props.initialValues,
        _props$onFieldsChange2 = props.onFieldsChange,
        onFieldsChange = _props$onFieldsChange2 === undefined ? _utils__WEBPACK_IMPORTED_MODULE_2__["noop"] : _props$onFieldsChange2,
        _props$onValuesChange2 = props.onValuesChange,
        onValuesChange = _props$onValuesChange2 === undefined ? _utils__WEBPACK_IMPORTED_MODULE_2__["noop"] : _props$onValuesChange2,
        _props$forwardForm2 = props.forwardForm,
        forwardForm = _props$forwardForm2 === undefined ? _utils__WEBPACK_IMPORTED_MODULE_2__["noop"] : _props$forwardForm2,
        restProps = _objectWithoutProperties(props, ['name', 'initialValues', 'onFieldsChange', 'onValuesChange', 'forwardForm']);

    _this2.FormInstance = datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Form"].create({
      name: name,
      onValuesChange: onValuesChange,
      onFieldsChange: onFieldsChange,
      mapPropsToFields: function mapPropsToFields() {
        if (initialValues) {
          return Object.fromEntries(Object.entries(initialValues).map(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
                key = _ref5[0],
                value = _ref5[1];

            return [key, datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Form"].createFormField({
              value: value
            })];
          }));
        }
        return {};
      }
    })(function (_ref6) {
      var children = _ref6.children,
          decoratorForm = _ref6.form,
          props = _objectWithoutProperties(_ref6, ['children', 'form']);

      forwardForm(decoratorForm);
      return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](
        datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Form"],
        _extends({}, props, restProps),
        children && react__WEBPACK_IMPORTED_MODULE_0__["Children"].count(children) >= 1 ? _this2.decoratorChild(decoratorForm, children) : children
      );
    });
  };

  this.decoratorChild = function (decoratorForm, children, parentIndex) {
    return [children].flat().map(function (container, index) {
      var key = parentIndex ? [parentIndex, index].join('-') : index;
      if (container && container.type && container.type.displayName === 'ShareFormItem') {
        return react__WEBPACK_IMPORTED_MODULE_0__["cloneElement"](container, {
          key: key,
          getFieldDecorator: decoratorForm.getFieldDecorator
        });
      } else if (container && container.props) {
        var groupChildren = container.props.children;
        var renderChildren = _this2.decoratorChild(decoratorForm, groupChildren, key);
        return react__WEBPACK_IMPORTED_MODULE_0__["cloneElement"](container, {
          key: key
        }, renderChildren);
      }
      return container;
    });
  };
};

var FormItem = function FormItem(_ref) {
  var children = _ref.children,
      name = _ref.name,
      _ref$rules = _ref.rules,
      rules = _ref$rules === undefined ? [] : _ref$rules,
      getValueFromEvent = _ref.getValueFromEvent,
      initialValue = _ref.initialValue,
      normalize = _ref.normalize,
      preserve = _ref.preserve,
      trigger = _ref.trigger,
      validateFirst = _ref.validateFirst,
      validateTrigger = _ref.validateTrigger,
      valuePropName = _ref.valuePropName,
      _ref$getFieldDecorato = _ref.getFieldDecorator,
      getFieldDecorator = _ref$getFieldDecorato === undefined ? function (name, options) {
    return function (element) {
      return element;
    };
  } : _ref$getFieldDecorato,
      restProps = _objectWithoutProperties(_ref, ['children', 'name', 'rules', 'getValueFromEvent', 'initialValue', 'normalize', 'preserve', 'trigger', 'validateFirst', 'validateTrigger', 'valuePropName', 'getFieldDecorator']);

  if (children && react__WEBPACK_IMPORTED_MODULE_0__["Children"].count(children) === 1 && shouldWrapper(children.type)) {
    var options = Object.fromEntries(Object.entries({
      rules: rules,
      getValueFromEvent: getValueFromEvent,
      initialValue: initialValue,
      normalize: normalize,
      preserve: preserve,
      trigger: trigger,
      validateFirst: validateFirst,
      validateTrigger: validateTrigger,
      valuePropName: valuePropName
    }).filter(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          value = _ref3[1];

      return value;
    }));
    return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](
      datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItem"],
      restProps,
      getFieldDecorator(name, options)(children)
    );
  }
  return children;
};

FormItem.displayName = 'ShareFormItem';

Form.Item = FormItem;

/* harmony default export */ __webpack_exports__["default"] = (Form);



/**
 * 是否需要包裹双向绑定函数
 * @param {string} elementType 
 * @returns 
 */
function shouldWrapper(elementType) {
  return !_constant__WEBPACK_IMPORTED_MODULE_3__["ESCAPEELEMENTTYPE"].includes(elementType) && Object(_utils__WEBPACK_IMPORTED_MODULE_2__["validElementType"])(elementType);
}

/***/ }),

/***/ "./src/settings/Form/utils.js":
/*!************************************!*\
  !*** ./src/settings/Form/utils.js ***!
  \************************************/
/*! exports provided: validElementType, noop */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validElementType", function() { return validElementType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "noop", function() { return noop; });
/**
 * 校验是否为react组件
 * @param {string} elementType 
 * @returns 
 */
var validElementType = function validElementType(elementType) {
  var reg = /^([A-Z]{1})/;
  return typeof elementType === 'function' || reg.test(elementType);
};

var noop = function noop() {};

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
    key: 'render',
    value: function render() {
      var _props = this.props,
          fields = _props.fields,
          config = _props.config;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('div', null);
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
/* harmony import */ var _Extend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Extend */ "./src/settings/Extend.jsx");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constant */ "./src/constant.js");
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Form */ "./src/settings/Form/index.jsx");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }








var OptionsSetting = function (_ComponentOptionsSett) {
  _inherits(OptionsSetting, _ComponentOptionsSett);

  function OptionsSetting(props) {
    _classCallCheck(this, OptionsSetting);

    var _this = _possibleConstructorReturn(this, (OptionsSetting.__proto__ || Object.getPrototypeOf(OptionsSetting)).call(this, props));

    _this.handleConfigChange = function (form, value) {
      if (value.columnsConfig) {
        value.columnsConfig = _this.transferConfig(value.columnsConfig);
      }
      _this.updateOptions(value);
    };

    _this.transferConfig = function (value) {
      var formatValues = [];
      try {
        formatValues = JSON.parse(value);
      } catch (e) {
        formatValues = [];
      }
      return formatValues;
    };

    _this.stringify = function (value) {
      var formatValues = '';
      try {
        formatValues = JSON.stringify(value);
      } catch (e) {
        formatValues = '';
      }
      return formatValues;
    };

    return _this;
  }

  _createClass(OptionsSetting, [{
    key: 'getTabs',
    value: function getTabs() {
      var _this2 = this;

      return {
        title: {
          label: '配置',
          content: function content() {
            return _this2.renderConfig();
          }
        }
      };
    }
  }, {
    key: 'renderConfig',
    value: function renderConfig() {
      var _this3 = this;

      var _props$options = this.props.options;
      _props$options = _props$options === undefined ? {
        autoplay: true,
        bordered: false,
        showHeader: true,
        stopWhenMouseEvent: false,
        title: title,
        footer: footer,
        titleWrapperClassname: titleWrapperClassname,
        footerWrapperClassname: footerWrapperClassname,
        containerWrapperClassname: containerWrapperClassname,
        interval: _constant__WEBPACK_IMPORTED_MODULE_3__["INTERVAL"],
        pagination: true,
        rowKey: rowKey
      } : _props$options;

      var _props$options$empty = _props$options.empty,
          empty = _props$options$empty === undefined ? {} : _props$options$empty,
          sort = _props$options.sort,
          _props$options$column = _props$options.columnsConfig,
          columnsConfig = _props$options$column === undefined ? [] : _props$options$column,
          initialValues = _objectWithoutProperties(_props$options, ['empty', 'sort', 'columnsConfig']);

      console.log(this.props.options);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,
        null,
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          _Form__WEBPACK_IMPORTED_MODULE_4__["default"],
          { initialValues: _extends({}, initialValues, { columnsConfig: this.stringify(columnsConfig) }), onValuesChange: this.handleConfigChange },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItemGroup"],
            { title: '\u57FA\u7840\u914D\u7F6E' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'autoplay', label: '\u81EA\u52A8\u6EDA\u52A8' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["RadioBooleanGroup"], null)
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'rowKey', label: '\u8868\u683C\u884C key ' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"], { maxLength: 30, placeholder: '\u8BF7\u8F93\u5165\u8868\u683C\u884C key ' })
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'interval', label: '\u65F6\u95F4\u95F4\u9694' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["InputNumber"], { min: _constant__WEBPACK_IMPORTED_MODULE_3__["INTERVAL"] })
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'bordered', label: '\u8FB9\u6846' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["RadioBooleanGroup"], null)
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'showHeader', label: '\u663E\u793A\u8868\u5934' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["RadioBooleanGroup"], null)
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'pagination', label: '\u663E\u793A\u7FFB\u9875\u5668' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["RadioBooleanGroup"], null)
            )
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItemGroup"],
            { title: '\u8868\u5934\u8868\u5C3E\u914D\u7F6E' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'columnsConfig', label: '\u8868\u5934\u914D\u7F6E' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["TextArea"], { placeholder: '\u8BF7\u8F93\u5165\u6570\u7EC4\u683C\u5F0F\u8868\u5934\u914D\u7F6E' })
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'title', label: '\u8868\u683C\u6807\u9898' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"], { placeholder: '\u8BF7\u8F93\u5165\u8868\u683C\u6807\u9898' })
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'footer', label: '\u8868\u683C\u5C3E\u90E8' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"], { placeholder: '\u8BF7\u8F93\u5165\u8868\u683C\u5C3E\u90E8' })
            )
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItemGroup"],
            { title: '\u6837\u5F0F\u914D\u7F6E' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'titleWrapperClassname', label: '\u6807\u9898\u7C7B\u540D' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"], { placeholder: '\u8BF7\u8F93\u5165\u8868\u683C\u6807\u9898\u7C7B\u540D' })
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'footerWrapperClassname', label: '\u5C3E\u90E8\u7C7B\u540D' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"], { placeholder: '\u8BF7\u8F93\u5165\u8868\u683C\u5C3E\u90E8\u7C7B\u540D' })
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
              { name: 'containerWrapperClassname', label: '\u6EDA\u52A8\u533A\u7C7B\u540D' },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"], { placeholder: '\u8BF7\u8F93\u5165\u8868\u683C\u6EDA\u52A8\u533A\u7C7B\u540D' })
            )
          ),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["FormItemGroup"],
            { title: '\u7F3A\u7701\u914D\u7F6E', onValuesChange: function onValuesChange(form, changeValues) {
                return _this3.updateOptions({ empty: changeValues });
              } },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Form__WEBPACK_IMPORTED_MODULE_4__["default"],
              { initialValues: empty },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
                { name: 'message', label: '\u7F3A\u7701\u6587\u5B57' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"], { placeholder: '\u8BF7\u8F93\u5165\u7F3A\u7701\u6587\u5B57' })
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _Form__WEBPACK_IMPORTED_MODULE_4__["FormItem"],
                { name: 'icon', label: '\u7F3A\u7701\u56FE\u7247' },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["Input"], { placeholder: '\u8BF7\u8F93\u5165\u7F3A\u7701\u56FE\u7247' })
              )
            )
          )
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Extend__WEBPACK_IMPORTED_MODULE_2__["default"], { initialValues: { sort: sort }, onChange: function onChange(option) {
            return _this3.updateOptions(option);
          } })
      );
    }
  }]);

  return OptionsSetting;
}(datavi_editor_templates__WEBPACK_IMPORTED_MODULE_1__["ComponentOptionsSetting"]);

/* harmony default export */ __webpack_exports__["default"] = (OptionsSetting);

/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/*! exports provided: noop, typeOf, replacePX, computedTableContentHeight, matchFunctionBody */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "noop", function() { return noop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeOf", function() { return typeOf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "replacePX", function() { return replacePX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "computedTableContentHeight", function() { return computedTableContentHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "matchFunctionBody", function() { return matchFunctionBody; });
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constant */ "./src/constant.js");

var noop = function noop() {};

var typeOf = function typeOf(target, type) {
  return [type].flat().some(function (v) {
    return Object.prototype.toString.call(target) === '[object ' + v + ']';
  });
};

var replacePX = function replacePX(pixel) {
  return pixel ? +String(pixel).replace('px', '') : 0;
};

var computedTableContentHeight = function computedTableContentHeight(headerRef, footerRef, stickyHeaderRef, paginationRef, showHeader, bordered, containerHeight) {
  // 不能小于最小高度(不然无法展示)
  if (containerHeight <= _constant__WEBPACK_IMPORTED_MODULE_0__["MINCONTAINERHEIGHT"]) {
    return _constant__WEBPACK_IMPORTED_MODULE_0__["MINCONTAINERHEIGHT"];
  }

  var _ref = headerRef ? window.getComputedStyle(headerRef) : {},
      _ref$height = _ref.height,
      headerHeight = _ref$height === undefined ? 0 : _ref$height;

  var _ref2 = footerRef ? window.getComputedStyle(footerRef) : {},
      _ref2$height = _ref2.height,
      footerHeight = _ref2$height === undefined ? 0 : _ref2$height;

  var _ref3 = stickyHeaderRef ? window.getComputedStyle(stickyHeaderRef) : {},
      _ref3$height = _ref3.height,
      stickyHeaderHeight = _ref3$height === undefined ? 0 : _ref3$height;

  var _ref4 = paginationRef ? window.getComputedStyle(paginationRef) : {},
      _ref4$height = _ref4.height,
      paginationHeight = _ref4$height === undefined ? 0 : _ref4$height;

  var borderHeight = [headerRef, footerRef].filter(function (v) {
    return v;
  }).length * _constant__WEBPACK_IMPORTED_MODULE_0__["BORDERWIDTH"];
  var tableContentHeight = containerHeight - replacePX(headerHeight) - replacePX(footerHeight) - (showHeader ? replacePX(stickyHeaderHeight) : 0) - (bordered ? borderHeight : 0) - replacePX(paginationHeight);
  return Math.max(tableContentHeight, _constant__WEBPACK_IMPORTED_MODULE_0__["MINCONTAINERHEIGHT"]);
};

/**
 * @description 匹配函数体
 * @param {string} value 
 * @returns 
 */
var matchFunctionBody = function matchFunctionBody() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  value = value.replace(/\n/g, '');
  var reg = /\{([\s\S]*)\}/;
  var markParam = /\(([\w]*)\)/;
  return [value.match(markParam)[1] || '', value.match(reg)[1] || ''];
};

/***/ }),

/***/ "data-vi/components":
/*!*****************************!*\
  !*** external "dv.adapter" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dv.adapter;

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

/***/ "prop-types":
/*!****************************!*\
  !*** external "PropTypes" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = PropTypes;

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