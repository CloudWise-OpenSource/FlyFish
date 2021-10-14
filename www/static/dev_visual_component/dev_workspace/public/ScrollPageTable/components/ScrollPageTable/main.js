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

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./src/Component.js":
/*!**************************!*\
  !*** ./src/Component.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var data_vi_ReactComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! data-vi/ReactComponent */ "data-vi/ReactComponent");
/* harmony import */ var data_vi_ReactComponent__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(data_vi_ReactComponent__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tableComponent_Panel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tableComponent/Panel */ "./src/tableComponent/Panel.js");
/* harmony import */ var _tableComponent_StickyHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tableComponent/StickyHeader */ "./src/tableComponent/StickyHeader.js");
/* harmony import */ var _tableComponent_TableContent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tableComponent/TableContent */ "./src/tableComponent/TableContent.js");
/* harmony import */ var _tableComponent_Pagination__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tableComponent/Pagination */ "./src/tableComponent/Pagination.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _optionShape__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./optionShape */ "./src/optionShape.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./constant */ "./src/constant.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./index.less */ "./src/index.less");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_index_less__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./data */ "./src/data.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


















var prefix = 'ff-component-scroll-page-table';

var ScrollPageTable = function (_PureComponent) {
  _inherits(ScrollPageTable, _PureComponent);

  function ScrollPageTable(props) {
    _classCallCheck(this, ScrollPageTable);

    var _this = _possibleConstructorReturn(this, (ScrollPageTable.__proto__ || Object.getPrototypeOf(ScrollPageTable)).call(this, props));

    _initialiseProps.call(_this);

    _this.addEventListener();
    return _this;
  }

  _createClass(ScrollPageTable, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.stopAnimation(false);
      var tableContentHeight = this.generateTableContentHeight(nextProps);
      this.handleScrollPage(nextProps, tableContentHeight);
      this.combineColumns(this.state.dataColumns);
      this.serilizeData(nextProps.data, nextProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.removeEventListener();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          title = _props.title,
          titleWrapperClassname = _props.titleWrapperClassname,
          footer = _props.footer,
          footerWrapperClassname = _props.footerWrapperClassname,
          bordered = _props.bordered,
          containerWrapperClassname = _props.containerWrapperClassname,
          empty = _props.empty,
          rowKey = _props.rowKey,
          showHeader = _props.showHeader,
          pagination = _props.pagination;
      var _state = this.state,
          tableContentHeight = _state.tableContentHeight,
          page = _state.page,
          total = _state.total,
          pageSize = _state.pageSize,
          data = _state.data,
          dataColumns = _state.dataColumns;


      var renderColumns = this.combineColumns(dataColumns);

      var className = classnames__WEBPACK_IMPORTED_MODULE_6___default()(prefix, _defineProperty({}, prefix + '-bordered', bordered));

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'div',
        { className: className },
        title && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          _tableComponent_Panel__WEBPACK_IMPORTED_MODULE_2__["default"],
          { forwardRef: function forwardRef(ref) {
              return _this2.headerRef = ref;
            }, className: classnames__WEBPACK_IMPORTED_MODULE_6___default()(prefix + '-title', titleWrapperClassname) },
          this.transferTitleOrFooter(title)
        ),
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'div',
          { className: classnames__WEBPACK_IMPORTED_MODULE_6___default()(prefix + '-container', containerWrapperClassname) },
          showHeader && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableComponent_StickyHeader__WEBPACK_IMPORTED_MODULE_3__["default"], {
            prefix: prefix,
            columns: renderColumns,
            forwardRef: function forwardRef(ref) {
              return _this2.stickyHeaderRef = ref;
            }
          }),
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            {
              ref: function ref(_ref) {
                return _this2.scrollContent = _ref;
              },
              className: prefix + '-container-wrapper',
              style: { height: tableContentHeight },
              onScroll: this.handleOnScroll,
              onWheel: function onWheel() {
                return _this2.stopAnimation();
              }
            },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableComponent_TableContent__WEBPACK_IMPORTED_MODULE_4__["default"], {
              prefix: prefix,
              columns: renderColumns,
              dataSource: data,
              empty: empty,
              rowKey: rowKey,
              onCell: this.handleOnCell,
              onRow: this.handleOnRow,
              getContainer: this.handleGetContainer,
              pageSize: pageSize
            })
          )
        ),
        footer && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          _tableComponent_Panel__WEBPACK_IMPORTED_MODULE_2__["default"],
          { forwardRef: function forwardRef(ref) {
              return _this2.footerRef = ref;
            }, className: classnames__WEBPACK_IMPORTED_MODULE_6___default()(prefix + '-footer', footerWrapperClassname) },
          this.transferTitleOrFooter(footer)
        ),
        pagination && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableComponent_Pagination__WEBPACK_IMPORTED_MODULE_5__["default"], {
          prefix: prefix,
          forwardRef: function forwardRef(ref) {
            return _this2.paginationRef = ref;
          },
          total: total,
          pageSize: pageSize,
          page: page,
          onChange: function onChange(changePage) {
            return _this2.animationScroll(_this2.props, tableContentHeight, true, changePage);
          }
        })
      );
    }
  }]);

  return ScrollPageTable;
}(react__WEBPACK_IMPORTED_MODULE_0__["PureComponent"]);

ScrollPageTable.propTypes = _optionShape__WEBPACK_IMPORTED_MODULE_7__["default"];

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.state = {
    page: 1,
    pageSize: _constant__WEBPACK_IMPORTED_MODULE_8__["PAGESIZE"],
    total: 0,
    tableContentHeight: 'auto',
    data: [],
    columns: [], // 组合后
    dataColumns: [] // 组合前
  };
  this.headerRef = null;
  this.footerRef = null;
  this.stickyHeaderRef = null;
  this.tableContent = null;
  this.scrollContent = null;
  this.paginationRef = null;
  this.scrollTimer = 0;
  this.memoTimestamp = null;
  this.animationStatus = false;

  this.mounted = function (eventBus, fire) {
    eventBus[fire ? 'unbind' : 'bind']('render', fire ? undefined : function () {});
  };

  this.loaded = function (eventBus, fire) {
    eventBus[fire ? 'unbind' : 'bind']('loaded', fire ? undefined : function (responese) {
      _this4.serilizeData(responese);
    });
  };

  this.serilizeData = function (responese) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this4.props;
    var sort = props.sort;

    console.log('sort', sort);

    var _ref2 = responese || {},
        _ref2$current = _ref2.current,
        current = _ref2$current === undefined ? 1 : _ref2$current,
        _ref2$pageSize = _ref2.pageSize,
        pageSize = _ref2$pageSize === undefined ? _constant__WEBPACK_IMPORTED_MODULE_8__["PAGESIZE"] : _ref2$pageSize,
        total = _ref2.total,
        _ref2$data = _ref2.data;

    _ref2$data = _ref2$data === undefined ? {} : _ref2$data;
    var _ref2$data$dataSource = _ref2$data.dataSource,
        dataSource = _ref2$data$dataSource === undefined ? [] : _ref2$data$dataSource,
        _ref2$data$columns = _ref2$data.columns,
        columns = _ref2$data$columns === undefined ? [] : _ref2$data$columns;

    var sortData = sort(dataSource);
    _this4.setState({
      data: [].concat(_toConsumableArray(Object(_utils__WEBPACK_IMPORTED_MODULE_9__["typeOf"])(sortData, 'Array') ? sortData : dataSource)),
      dataColumns: columns,
      page: current,
      pageSize: pageSize,
      total: total
    });
  };

  this.resized = function (eventBus, fire) {
    eventBus[fire ? 'unbind' : 'bind']('resized', fire ? undefined : function (_ref3) {
      var width = _ref3.width,
          height = _ref3.height;

      var tableContentHeight = _this4.generateTableContentHeight(_this4.props, height);
      !_this4.animationStatus && _this4.handleScrollPage(_this4.props, tableContentHeight);
    });
  };

  this.addEventListener = function () {
    var eventBus = _this4.props.parent;

    _this4.mounted(eventBus);
    _this4.loaded(eventBus);
    _this4.resized(eventBus);
  };

  this.removeEventListener = function () {
    var eventBus = _this4.props.parent;

    _this4.mounted(eventBus, true);
    _this4.loaded(eventBus, true);
    _this4.resized(eventBus, true);
  };

  this.transferTitleOrFooter = function (titleOrFooter) {
    var page = _this4.state.page;

    var isString = typeof titleOrFooter === 'string';
    return isString ? titleOrFooter : titleOrFooter(page);
  };

  this.generateTableContentHeight = function (props, height) {
    var parent = props.parent,
        showHeader = props.showHeader,
        bordered = props.bordered;

    var containerHeight = height || parent.height;

    var tableContentHeight = Object(_utils__WEBPACK_IMPORTED_MODULE_9__["computedTableContentHeight"])(_this4.headerRef, _this4.footerRef, _this4.stickyHeaderRef, _this4.paginationRef, showHeader, bordered, containerHeight);
    _this4.setState({
      tableContentHeight: tableContentHeight
    });
    return tableContentHeight;
  };

  this.handleOnCell = function (event, text, record, index) {
    var _props2 = _this4.props,
        eventBus = _props2.parent,
        onCell = _props2.onCell;

    eventBus.trigger(_constant__WEBPACK_IMPORTED_MODULE_8__["EVENTPREFIX"] + '-cell-click', {
      event: event, text: text, record: record, index: index
    });
    onCell(event, text, record, index);
  };

  this.handleOnRow = function (event, record, index) {
    var _props3 = _this4.props,
        eventBus = _props3.parent,
        onRow = _props3.onRow;

    eventBus.trigger(_constant__WEBPACK_IMPORTED_MODULE_8__["EVENTPREFIX"] + '-row-click', {
      event: event, record: record, index: index
    });
    onRow(event, record, index);
  };

  this.handleGetContainer = function (ref) {
    var getContainer = _this4.props.getContainer;

    _this4.tableContent = ref;
    getContainer(ref);
  };

  this.stopAnimation = function () {
    var trigger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (!_this4.scrollTimer) return;
    window.cancelAnimationFrame(_this4.scrollTimer);
    _this4.scrollTimer = 0;
    _this4.memoTimestamp = null;
    if (trigger) {
      _this4.animationStatus = false;
      _this4.props.parent.trigger(_constant__WEBPACK_IMPORTED_MODULE_8__["EVENTPREFIX"] + '-animation-end');
    }
  };

  this.animationScroll = function (props, tableContentHeight) {
    var trigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var scrollPage = arguments[3];
    var interval = props.interval,
        parent = props.parent;
    var page = _this4.state.page;
    // 首先判断当前滚动元素是否存在scrollHeight

    var _scrollContent = _this4.scrollContent,
        scrollHeight = _scrollContent.scrollHeight,
        scrollTop = _scrollContent.scrollTop;

    var _ref4 = _this4.stickyHeaderRef ? window.getComputedStyle(_this4.stickyHeaderRef) : {},
        _ref4$height = _ref4.height,
        headerHeight = _ref4$height === undefined ? 0 : _ref4$height;
    // 若小于当前容器高度或当前剩余高度不足以滚动一屏则停止或不开启动画


    if (!scrollPage && (scrollHeight <= tableContentHeight || scrollHeight - Object(_utils__WEBPACK_IMPORTED_MODULE_9__["replacePX"])(headerHeight) - scrollTop <= tableContentHeight)) {
      _this4.stopAnimation(true);
      return;
    }

    trigger && parent.trigger(_constant__WEBPACK_IMPORTED_MODULE_8__["EVENTPREFIX"] + '-animation-start');
    var animation = function animation(timestamp) {
      _this4.animationStatus = true;
      if (!_this4.memoTimestamp) {
        _this4.memoTimestamp = timestamp;
      }
      // 计算时间差
      var timestampGap = timestamp - _this4.memoTimestamp;
      // 计算此次滚动距离
      var scrollGap = timestampGap * (tableContentHeight / interval);
      // 计算当前指定页数的滚动最大距离

      var _ref5 = _this4.tableContent ? _this4.tableContent.querySelector('tbody[data-index=\'' + (scrollPage || page) + '\']') || {} : {},
          _ref5$offsetTop = _ref5.offsetTop,
          offsetTop = _ref5$offsetTop === undefined ? 0 : _ref5$offsetTop;
      // 确认朝向


      var direction = scrollPage ? page < scrollPage ? 'down' : 'up' : 'down';
      // 若为指定页数需要更改每次滚动距离
      if (scrollPage) {
        scrollGap = timestampGap * (direction === 'up' ? scrollTop - offsetTop : offsetTop - scrollTop) / interval;
      }
      // 计算最新的scrollTop
      var latestScrollTop = direction === 'up' ? scrollTop - scrollGap : scrollTop + scrollGap;

      _this4.scrollContent.scrollTop = Math[direction === 'up' ? 'max' : 'min'](latestScrollTop, offsetTop);
      if (timestampGap < interval) {
        _this4.scrollTimer = window.requestAnimationFrame(animation);
      } else {
        var shouldUpdate = _this4.observePage(props, scrollPage);

        _this4.stopAnimation(scrollPage || !shouldUpdate);
        if (!scrollPage) {
          // 判断是否触底
          if (offsetTop + tableContentHeight > scrollHeight) {
            setTimeout(function () {
              _this4.scrollContent.scrollTop = 0;
              _this4.animationScroll(props, tableContentHeight, false, scrollPage);
            }, timestampGap);
          }

          _this4.animationScroll(props, tableContentHeight, false, scrollPage);
        }
      }
    };
    _this4.scrollTimer = window.requestAnimationFrame(animation);
  };

  this.handleScrollPage = function (props, tableContentHeight) {
    var autoplay = props.autoplay,
        interval = props.interval;


    if (!_this4.scrollContent) return;
    // 最小滚动时间
    interval = Math.max(interval, _constant__WEBPACK_IMPORTED_MODULE_8__["INTERVAL"]);
    // 更改状态取消滚动
    if (!autoplay) {
      _this4.stopAnimation();
      return;
    }

    _this4.animationScroll(props, tableContentHeight);
  };

  this.observePage = function (props, computedPage) {
    var _ref6 = props || _this4.props,
        pagination = _ref6.pagination,
        parent = _ref6.parent;

    var _state2 = _this4.state,
        page = _state2.page,
        data = _state2.data,
        pageSize = _state2.pageSize;

    var latestPage = computedPage || page + 1;
    pagination = pagination || {};
    var totalPage = Math.ceil(data.length / pageSize);
    // 若为指定页码则不进行更新
    var shouldUpdate = computedPage ? page !== computedPage : latestPage <= totalPage;

    // 判断是否已经抵达最大页
    if (shouldUpdate && latestPage !== page) {
      _this4.setState({
        page: latestPage
      });
      parent.trigger(_constant__WEBPACK_IMPORTED_MODULE_8__["EVENTPREFIX"] + '-page-change', { page: latestPage });
      Object(_utils__WEBPACK_IMPORTED_MODULE_9__["typeOf"])(pagination.onChange, 'Function') && pagination.onChange(latestPage, pagination.pageSize || _constant__WEBPACK_IMPORTED_MODULE_8__["PAGESIZE"]);
    }

    return shouldUpdate;
  };

  this.handleOnScroll = function (event) {
    // 若处于自动滚动期间不触发滚动计算
    if (!_this4.animationStatus) {
      // 滚动的时候要自动计算页数
      var _state3 = _this4.state,
          tableContentHeight = _state3.tableContentHeight,
          page = _state3.page,
          data = _state3.data,
          pageSize = _state3.pageSize;
      var _scrollContent2 = _this4.scrollContent,
          scrollTop = _scrollContent2.scrollTop,
          scrollHeight = _scrollContent2.scrollHeight;

      var nextPage = Math.min(page + 1, Math.ceil(data.length / pageSize));

      // 计算当前指定页数的滚动最大距离

      var _tableContent$querySe = _this4.tableContent.querySelector('tbody[data-index=\'' + nextPage + '\']'),
          nextOffsetTop = _tableContent$querySe.offsetTop;

      var _tableContent$querySe2 = _this4.tableContent.querySelector('tbody[data-index=\'' + page + '\']'),
          currentOffsetTop = _tableContent$querySe2.offsetTop;

      var computedPage = 1;
      if (scrollTop && scrollTop + tableContentHeight + 20 >= scrollHeight) {
        computedPage = Math.ceil(data.length / pageSize);
      } else if (scrollTop && scrollTop >= currentOffsetTop && scrollTop < nextOffsetTop) {
        computedPage = page;
      } else if (scrollTop && scrollTop >= nextOffsetTop) {
        computedPage = nextPage;
      }
      _this4.observePage(_this4.props, computedPage);
    }

    _this4.props.onScroll(event);
  };

  this.combineColumns = function () {
    var columns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var _props$columnsConfig = _this4.props.columnsConfig,
        columnsConfig = _props$columnsConfig === undefined ? [] : _props$columnsConfig;

    return columns.map(function (v) {
      var currentColumnsConfig = Object(_utils__WEBPACK_IMPORTED_MODULE_9__["typeOf"])(columnsConfig, 'Array') ? columnsConfig.find(function (_ref7) {
        var dataIndex = _ref7.dataIndex;
        return dataIndex === v.dataIndex;
      }) || {} : {};
      return _extends({}, v, currentColumnsConfig);
    });
  };
};

var sortFucntion = function sortFucntion(data) {
  return data;
};

var WrapperScrollPageTable = function (_ReactComponent) {
  _inherits(WrapperScrollPageTable, _ReactComponent);

  function WrapperScrollPageTable() {
    _classCallCheck(this, WrapperScrollPageTable);

    return _possibleConstructorReturn(this, (WrapperScrollPageTable.__proto__ || Object.getPrototypeOf(WrapperScrollPageTable)).apply(this, arguments));
  }

  _createClass(WrapperScrollPageTable, [{
    key: 'getDefaultConfig',
    value: function getDefaultConfig() {
      return {
        "left": 60,
        "top": 60,
        "width": 1800,
        "height": 960,
        "visible": true
      };
    }
  }, {
    key: 'getDefaultData',
    value: function getDefaultData() {
      return _data__WEBPACK_IMPORTED_MODULE_11__["default"];
    }
  }, {
    key: 'getReactComponent',
    value: function getReactComponent() {
      return ScrollPageTable;
    }
  }]);

  return WrapperScrollPageTable;
}(data_vi_ReactComponent__WEBPACK_IMPORTED_MODULE_1___default.a);

WrapperScrollPageTable.defaultOptions = {
  bordered: false,
  showHeader: true,
  empty: _constant__WEBPACK_IMPORTED_MODULE_8__["EMPTY"],
  onCell: _utils__WEBPACK_IMPORTED_MODULE_9__["noop"],
  onRow: _utils__WEBPACK_IMPORTED_MODULE_9__["noop"],
  onScroll: _utils__WEBPACK_IMPORTED_MODULE_9__["noop"],
  getContainer: _utils__WEBPACK_IMPORTED_MODULE_9__["noop"],
  stopWhenMouseEvent: false,
  autoplay: true,
  interval: _constant__WEBPACK_IMPORTED_MODULE_8__["INTERVAL"],
  columnsConfig: [],
  pagination: {
    pageSize: _constant__WEBPACK_IMPORTED_MODULE_8__["PAGESIZE"],
    onChange: _utils__WEBPACK_IMPORTED_MODULE_9__["noop"]
  },
  sort: sortFucntion
};
WrapperScrollPageTable.enableLoadCssFile = true;
/* harmony default export */ __webpack_exports__["default"] = (WrapperScrollPageTable);

/***/ }),

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

/***/ "./src/data.js":
/*!*********************!*\
  !*** ./src/data.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constant */ "./src/constant.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var columns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name'
}, {
  title: '年龄(可能是实岁也可能是虚岁)',
  dataIndex: 'age',
  key: 'age'
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address'
}];

var dataSource = new Array(11).fill({
  name: 'Edward King 0',
  age: '32',
  address: 'London, Park Lane no. 0.London, Park Lane no. 0.London, Park Lane no. 0.London, Park Lane no. 0'
}).map(function (v, i) {
  return _extends({ key: i }, v);
});

/* harmony default export */ __webpack_exports__["default"] = ({
  current: 1,
  pageSize: _constant__WEBPACK_IMPORTED_MODULE_0__["PAGESIZE"],
  total: 10,
  data: {
    columns: columns,
    dataSource: dataSource
  }
});

/***/ }),

/***/ "./src/index.less":
/*!************************!*\
  !*** ./src/index.less ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

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
 * @description 注册组件到大屏中
 */





Object(data_vi_components__WEBPACK_IMPORTED_MODULE_0__["registerComponent"])('ScrollPageTable', _Component__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./src/optionShape.js":
/*!****************************!*\
  !*** ./src/optionShape.js ***!
  \****************************/
/*! exports provided: shapeOfEmpty, event, pagination, shapeOfColumn, shapeOfData, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shapeOfEmpty", function() { return shapeOfEmpty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "event", function() { return event; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pagination", function() { return pagination; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shapeOfColumn", function() { return shapeOfColumn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shapeOfData", function() { return shapeOfData; });
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_0__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var shapeOfEmpty = {
  message: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string,
  icon: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string
};



var event = {
  /**
   * @description 点击行
   */
  onRow: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.func,
  /**
   * @description 点击单元格
   */
  onCell: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.func,
  /**
   * @description 滚动事件
   */
  onScroll: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.func,
  /**
   * @description 获取当前滚动元素
   */
  getContainer: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.func
};



var pagination = {
  /**
   * @description 每页个数
   */
  pageSize: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number,
  /**
   * @description 页数更改函数
   */
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.func,
  /**
   * @description 总条数
   */
  total: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number
};



var shapeOfColumn = {
  /**
   * @description 设置列的对齐方式
   */
  align: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOf(['left', 'right', 'center']),
  /**
   * @description 超过宽度将自动省略
   */
  ellipsis: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.bool,
  /**
   * @description 列样式类名
   */
  className: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string,
  /**
   * @description 列数据在数据项中对应的 key
   */
  dataIndex: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string.isRequired,
  /**
   * @description 列头显示文字
   */
  title: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string.isRequired,
  /**
   * @description 列宽度
   */
  width: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number])
};



var shapeOfData = prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.shape({
  current: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number,
  pageSize: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number,
  total: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number,
  data: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.shape({
    columns: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.arrayOf(shapeOfColumn),
    dataSource: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.object)
  })
});



var shapeOfOption = _extends({
  /**
   * @description 表格标题
   */
  title: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.func]),
  /**
   * @description 表格尾部
   */
  footer: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.func]),
  /**
   * @description 表格标题类名
   */
  titleWrapperClassname: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string,
  /**
   * @description 表格尾部类名
   */
  footerWrapperClassname: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string,
  /**
   * @description 表格container类名
   */
  containerWrapperClassname: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string,
  /**
   * @description 是否展示外边框和列边框
   */
  bordered: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.bool,
  /**
   * @description 是否显示表头
   */
  showHeader: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.bool,
  /**
   * @description 表格无数据配置
   */
  empty: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.shape(shapeOfEmpty),
  /**
   * @description 表格行 key 的取值
   */
  rowKey: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string.isRequired,
  /**
   * @description 是否自动滑动
   */
  autoplay: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.bool,
  /**
   * @description 鼠标事件是否会暂停滚动
   */
  stopWhenMouseEvent: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.bool,
  /**
   * @description 滑动间隔
   */
  interval: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number,
  /**
   * @description 翻页器配置
   */
  pagination: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.bool, prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.shape(pagination)]),
  /**
   * @description 数据
   */
  data: shapeOfData,
  sort: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.func
}, event);

/* harmony default export */ __webpack_exports__["default"] = (shapeOfOption);

/***/ }),

/***/ "./src/tableComponent/ColGroup.js":
/*!****************************************!*\
  !*** ./src/tableComponent/ColGroup.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _optionShape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../optionShape */ "./src/optionShape.js");




var ColGroup = function ColGroup(_ref) {
  var columns = _ref.columns;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'colgroup',
    null,
    columns.map(function (_ref2, index) {
      var width = _ref2.width;

      var style = {};
      if (width) {
        style.width = width;
      }
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('col', { key: index, style: style });
    })
  );
};

ColGroup.propTypes = {
  columns: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape(_optionShape__WEBPACK_IMPORTED_MODULE_2__["shapeOfColumn"])).isRequired
};

ColGroup.defaultProps = {
  columns: []
};

/* harmony default export */ __webpack_exports__["default"] = (ColGroup);

/***/ }),

/***/ "./src/tableComponent/Pagination.js":
/*!******************************************!*\
  !*** ./src/tableComponent/Pagination.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constant */ "./src/constant.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








var Pagination = function Pagination(_ref) {
  var forwardRef = _ref.forwardRef,
      total = _ref.total,
      pageSize = _ref.pageSize,
      onChange = _ref.onChange,
      prefix = _ref.prefix,
      page = _ref.page;

  var totalPage = total ? Math.ceil(total / pageSize) : 0;
  var paginationPrefix = prefix + '-pagination';
  var prevClassnames = classnames__WEBPACK_IMPORTED_MODULE_2___default()(paginationPrefix + '-item', _defineProperty({}, paginationPrefix + '-disable', page === 1));
  var nextClassnames = classnames__WEBPACK_IMPORTED_MODULE_2___default()(paginationPrefix + '-item', _defineProperty({}, paginationPrefix + '-disable', page === totalPage));
  var paginationItemClassnames = function paginationItemClassnames(index) {
    return classnames__WEBPACK_IMPORTED_MODULE_2___default()(paginationPrefix + '-item', _defineProperty({}, paginationPrefix + '-item-active', page === index + 1));
  };
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'ul',
    { ref: function ref(_ref2) {
        return forwardRef(_ref2);
      }, className: paginationPrefix },
    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      'li',
      { className: prevClassnames, onClick: function onClick(event) {
          return page !== 1 && onChange(page - 1, event);
        } },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'i',
        null,
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'svg',
          { viewBox: '64 64 896 896', focusable: 'false', className: '', 'data-icon': 'left', width: '1em', height: '1em', fill: 'currentColor', 'aria-hidden': 'true' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('path', { d: 'M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z' })
        )
      )
    ),
    new Array(totalPage).fill('').map(function (_, index) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'li',
        {
          key: index,
          className: paginationItemClassnames(index),
          onClick: function onClick() {
            return index + 1 !== page && onChange(index + 1);
          }
        },
        index + 1
      );
    }),
    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      'li',
      { className: nextClassnames, onClick: function onClick(event) {
          return page !== totalPage && onChange(page + 1, event);
        } },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'i',
        null,
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'svg',
          { viewBox: '64 64 896 896', focusable: 'false', className: '', 'data-icon': 'right', width: '1em', height: '1em', fill: 'currentColor', 'aria-hidden': 'true' },
          react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('path', { d: 'M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z' })
        )
      )
    )
  );
};

Pagination.propTypes = {
  forwardRef: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  total: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  pageSize: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  prefix: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  page: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number
};

Pagination.defaultProps = {
  forwardRef: _utils__WEBPACK_IMPORTED_MODULE_3__["noop"],
  onChange: _utils__WEBPACK_IMPORTED_MODULE_3__["noop"],
  total: 0,
  pageSize: _constant__WEBPACK_IMPORTED_MODULE_4__["PAGESIZE"],
  page: 1
};

/* harmony default export */ __webpack_exports__["default"] = (Pagination);

/***/ }),

/***/ "./src/tableComponent/Panel.js":
/*!*************************************!*\
  !*** ./src/tableComponent/Panel.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");



var Panel = function Panel(_ref) {
  var className = _ref.className,
      children = _ref.children,
      _ref$forwardRef = _ref.forwardRef,
      forwardRef = _ref$forwardRef === undefined ? _utils__WEBPACK_IMPORTED_MODULE_1__["noop"] : _ref$forwardRef;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    { ref: function ref(_ref2) {
        return forwardRef(_ref2);
      }, className: className },
    children
  );
};

/* harmony default export */ __webpack_exports__["default"] = (Panel);

/***/ }),

/***/ "./src/tableComponent/StickyHeader.js":
/*!********************************************!*\
  !*** ./src/tableComponent/StickyHeader.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ColGroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ColGroup */ "./src/tableComponent/ColGroup.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _optionShape__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../optionShape */ "./src/optionShape.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }









var StickyHeader = function StickyHeader(_ref) {
  var prefix = _ref.prefix,
      columns = _ref.columns,
      forwardRef = _ref.forwardRef;


  if (!columns || !columns.length) return null;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    { className: prefix + '-sticky-header', ref: function ref(_ref3) {
        return forwardRef(_ref3);
      } },
    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      'table',
      { className: prefix + '-sticky-header-table' },
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ColGroup__WEBPACK_IMPORTED_MODULE_1__["default"], { columns: columns }),
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'thead',
        null,
        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
          'tr',
          null,
          columns.map(function (_ref2) {
            var _classnames;

            var ellipsis = _ref2.ellipsis,
                align = _ref2.align,
                className = _ref2.className,
                dataIndex = _ref2.dataIndex,
                title = _ref2.title;
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              'td',
              {
                key: dataIndex,
                className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(className, (_classnames = {}, _defineProperty(_classnames, prefix + '-cell-ellipsis', ellipsis), _defineProperty(_classnames, prefix + '-cell-align-' + align, align), _classnames))
              },
              title
            );
          })
        )
      )
    )
  );
};

StickyHeader.propTypes = {
  prefix: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string,
  columns: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.shape(_optionShape__WEBPACK_IMPORTED_MODULE_4__["shapeOfColumn"])).isRequired,
  forwardRef: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.func
};

StickyHeader.defaultProps = {
  columns: [],
  forwardRef: _utils__WEBPACK_IMPORTED_MODULE_5__["noop"]
};

StickyHeader.displayName = 'StickyHeader';

/* harmony default export */ __webpack_exports__["default"] = (StickyHeader);

/***/ }),

/***/ "./src/tableComponent/TableContent.js":
/*!********************************************!*\
  !*** ./src/tableComponent/TableContent.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ColGroup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ColGroup */ "./src/tableComponent/ColGroup.js");
/* harmony import */ var _optionShape__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../optionShape */ "./src/optionShape.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
/* harmony import */ var data_vi_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! data-vi/helpers */ "data-vi/helpers");
/* harmony import */ var data_vi_helpers__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(data_vi_helpers__WEBPACK_IMPORTED_MODULE_6__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










var checkTypeForRender = function checkTypeForRender(content, record, index) {
  if (Object(_utils__WEBPACK_IMPORTED_MODULE_5__["typeOf"])(content, 'Function')) {
    return content(content, record, index);
  }
  return content;
};

var TableContent = function TableContent(_ref) {
  var columns = _ref.columns,
      dataSource = _ref.dataSource,
      prefix = _ref.prefix,
      _ref$empty = _ref.empty;
  _ref$empty = _ref$empty === undefined ? {} : _ref$empty;
  var _ref$empty$message = _ref$empty.message,
      message = _ref$empty$message === undefined ? '' : _ref$empty$message,
      _ref$empty$icon = _ref$empty.icon,
      icon = _ref$empty$icon === undefined ? '' : _ref$empty$icon,
      rowKey = _ref.rowKey,
      onRow = _ref.onRow,
      onCell = _ref.onCell,
      getContainer = _ref.getContainer,
      pageSize = _ref.pageSize;

  return dataSource.length ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'table',
    { ref: function ref(_ref3) {
        return getContainer(_ref3);
      } },
    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ColGroup__WEBPACK_IMPORTED_MODULE_3__["default"], { columns: columns }),
    Object(data_vi_helpers__WEBPACK_IMPORTED_MODULE_6__["chunk"])(dataSource, pageSize).map(function (chunkData, pageIndex) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
        'tbody',
        { key: pageIndex, 'data-index': pageIndex + 1 },
        chunkData.map(function (record, index) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'tr',
            { key: record[rowKey] || index, onClick: function onClick(event) {
                return onRow(event, record, index);
              } },
            columns.map(function (_ref2) {
              var _classnames;

              var dataIndex = _ref2.dataIndex,
                  ellipsis = _ref2.ellipsis,
                  align = _ref2.align,
                  className = _ref2.className;
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'td',
                {
                  className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(className, (_classnames = {}, _defineProperty(_classnames, prefix + '-cell-ellipsis', ellipsis), _defineProperty(_classnames, prefix + '-cell-align-' + align, align), _classnames)),
                  key: dataIndex,
                  onClick: function onClick(event) {
                    return onCell(event, record[dataIndex], record, index);
                  }
                },
                checkTypeForRender(record[dataIndex], record, index),
                '-page-',
                pageIndex + 1
              );
            })
          );
        })
      );
    })
  ) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    { className: prefix + '-container-empty' },
    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('img', { src: icon }),
    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
      'span',
      null,
      message
    )
  );
};

TableContent.propTypes = _extends({
  columns: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape(_optionShape__WEBPACK_IMPORTED_MODULE_4__["shapeOfColumn"])).isRequired,
  dataSource: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object).isRequired,
  prefix: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  empty: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape(_optionShape__WEBPACK_IMPORTED_MODULE_4__["shapeOfEmpty"]),
  rowKey: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  pageSize: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number
}, _optionShape__WEBPACK_IMPORTED_MODULE_4__["event"]);

TableContent.defaultProps = {
  columns: [],
  dataSource: [],
  rowKey: 'key',
  onCell: _utils__WEBPACK_IMPORTED_MODULE_5__["noop"],
  onRow: _utils__WEBPACK_IMPORTED_MODULE_5__["noop"],
  getContainer: _utils__WEBPACK_IMPORTED_MODULE_5__["noop"]
};

/* harmony default export */ __webpack_exports__["default"] = (TableContent);

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

/***/ "data-vi/ReactComponent":
/*!********************************************!*\
  !*** external "dv.adapter.ReactComponent" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dv.adapter.ReactComponent;

/***/ }),

/***/ "data-vi/components":
/*!*****************************!*\
  !*** external "dv.adapter" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dv.adapter;

/***/ }),

/***/ "data-vi/helpers":
/*!*******************************!*\
  !*** external "dv.adapter._" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dv.adapter._;

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
//# sourceMappingURL=main.js.map