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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Component.js":
/*!**************************!*\
  !*** ./src/Component.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var data_vi_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! data-vi/Component */ "data-vi/Component");
/* harmony import */ var data_vi_Component__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(data_vi_Component__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var data_vi_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! data-vi/helpers */ "data-vi/helpers");
/* harmony import */ var data_vi_helpers__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(data_vi_helpers__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var data_vi_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! data-vi/config */ "data-vi/config");
/* harmony import */ var data_vi_config__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(data_vi_config__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _thumb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./thumb */ "./src/thumb.js");
/* harmony import */ var data_vi_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! data-vi/api */ "data-vi/components");
/* harmony import */ var data_vi_api__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(data_vi_api__WEBPACK_IMPORTED_MODULE_4__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @description 图片组件类
 * @author Cary
 */






var ImageComponent = function (_Component) {
    _inherits(ImageComponent, _Component);

    function ImageComponent() {
        _classCallCheck(this, ImageComponent);

        return _possibleConstructorReturn(this, (ImageComponent.__proto__ || Object.getPrototypeOf(ImageComponent)).apply(this, arguments));
    }

    _createClass(ImageComponent, [{
        key: '_render',


        /**
         * 渲染选项
         *
         * @returns {ImageComponent}
         * @private
         */


        // 默认选项
        value: function _render() {
            var _getOptions = this.getOptions(),
                image = _getOptions.image,
                type = _getOptions.type;

            var style = {
                backgroundImage: image ? 'url(' + Object(data_vi_helpers__WEBPACK_IMPORTED_MODULE_1__["transformImageUrl"])(image) + ')' : 'url(' + _thumb__WEBPACK_IMPORTED_MODULE_3__["default"] + ')'
            };

            switch (type) {
                case 'full':
                    style.backgroundRepeat = 'no-repeat';
                    style.backgroundSize = '100% 100%';
                    break;
                case 'contain':
                    style.backgroundRepeat = 'no-repeat';
                    style.backgroundSize = 'contain';
                    style.backgroundPosition = 'center';
                    break;
                case 'repeat':
                    style.backgroundRepeat = 'repeat';
                    style.backgroundSize = 'auto';
                    style.backgroundPosition = 'left top';
                    break;

            }

            this.getContainer().css(style);

            return this;
        }

        // 默认设置

    }, {
        key: '_componentWillRemove',
        value: function _componentWillRemove() {
            var needDeleteServerImgage = true;

            var _getOptions2 = this.getOptions(),
                image = _getOptions2.image;

            if (!image) {
                return;
            }
            if (this.screen && typeof this.screen.getComponents === "function") {
                var components = this.screen.getComponents();
                var type = this.getType();
                var id = this.getId();
                needDeleteServerImgage = components.every(function (component) {
                    if (component.getType() === type && component.getId() !== id) {
                        var _component$getOptions = component.getOptions(),
                            otherImageComponentImage = _component$getOptions.otherImageComponentImage;

                        if (image === otherImageComponentImage) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            if (needDeleteServerImgage) {
                var imageSplitArr = image.split('/');
                Object(data_vi_api__WEBPACK_IMPORTED_MODULE_4__["apiRequest"])({
                    url: data_vi_config__WEBPACK_IMPORTED_MODULE_2___default.a.screenAPI.deleteUploadScreenImg,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        imgName: imageSplitArr[imageSplitArr.length - 1],
                        screen_id: Object(data_vi_helpers__WEBPACK_IMPORTED_MODULE_1__["getUrlParam"])('id')
                    })
                });
            }
        }
    }]);

    return ImageComponent;
}(data_vi_Component__WEBPACK_IMPORTED_MODULE_0___default.a);

ImageComponent.defaultOptions = {
    // 图片地址
    image: '',
    // 显示方式, full(铺满),contain(自适应),repeat(填充),
    type: 'full'
};
ImageComponent.defaultConfig = {
    // 默认宽
    width: 153,
    // 默认高
    height: 102
};
/* harmony default export */ __webpack_exports__["default"] = (ImageComponent);

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var data_vi_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! data-vi/components */ "data-vi/components");
/* harmony import */ var data_vi_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(data_vi_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Component */ "./src/Component.js");

/**
 * @description 注册CommonImage组件到大屏中
 */





Object(data_vi_components__WEBPACK_IMPORTED_MODULE_0__["registerComponent"])("CommonImage", _Component__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./src/thumb.js":
/*!**********************!*\
  !*** ./src/thumb.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @description
 * @author Cary
 */
/* harmony default export */ __webpack_exports__["default"] = ('data:image/png;base64,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');

/***/ }),

/***/ "data-vi/Component":
/*!***************************************!*\
  !*** external "dv.adapter.Component" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dv.adapter.Component;

/***/ }),

/***/ "data-vi/components":
/*!*****************************!*\
  !*** external "dv.adapter" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dv.adapter;

/***/ }),

/***/ "data-vi/config":
/*!************************************!*\
  !*** external "dv.adapter.config" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dv.adapter.config;

/***/ }),

/***/ "data-vi/helpers":
/*!*******************************!*\
  !*** external "dv.adapter._" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dv.adapter._;

/***/ })

/******/ });
//# sourceMappingURL=main.js.map