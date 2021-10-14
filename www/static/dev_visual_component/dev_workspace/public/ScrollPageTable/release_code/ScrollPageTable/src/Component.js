import React, { PureComponent } from 'react';
import ReactComponent from "data-vi/ReactComponent";
import Panel from './tableComponent/Panel';
import StickyHeader from './tableComponent/StickyHeader';
import TableContent from './tableComponent/TableContent';
import Pagination from './tableComponent/Pagination';

import classnames from 'classnames';
import shapeOfOption from './optionShape';
import { EMPTY, EVENTPREFIX, PAGESIZE, INTERVAL } from './constant';

import { computedTableContentHeight, noop, replacePX, typeOf } from './utils';

import './index.less';

import defaultData from './data';

const prefix = 'ff-component-scroll-page-table';

class ScrollPageTable extends PureComponent {
  static propTypes = shapeOfOption;

  constructor(props) {
    super(props);
    this.addEventListener();
  }

  state = {
    page: 1,
    pageSize: PAGESIZE,
    total: 0,
    tableContentHeight: 'auto',
    data: [],
    columns: [], // 组合后
    dataColumns: [], // 组合前
  }

  headerRef = null;
  footerRef = null;
  stickyHeaderRef = null;
  tableContent = null;
  scrollContent = null;
  paginationRef = null;
  scrollTimer = 0;
  memoTimestamp = null;
  animationStatus = false;

  mounted = (eventBus, fire) => {
    eventBus[fire ? 'unbind' : 'bind']('render', fire ? undefined : () => {

    })
  }

  loaded = (eventBus, fire) => {
    eventBus[fire ? 'unbind' : 'bind']('loaded', fire ? undefined : (responese) => {
      this.serilizeData(responese);
    })
  }

  serilizeData = (responese, props = this.props) => {
    const { sort } = props;
    console.log('sort', sort);
    const {
      current = 1,
      pageSize = PAGESIZE,
      total,
      data: {
        dataSource = [],
        columns = []
      } = {}
    } = responese || {};
    const sortData = sort(dataSource);
    this.setState({
      data: [...(typeOf(sortData, 'Array') ? sortData : dataSource)],
      dataColumns: columns,
      page: current,
      pageSize,
      total
    })
  }

  resized = (eventBus, fire) => {
    eventBus[fire ? 'unbind' : 'bind']('resized', fire ? undefined : ({ width, height }) => {
      const tableContentHeight = this.generateTableContentHeight(this.props, height);
      !this.animationStatus && this.handleScrollPage(this.props, tableContentHeight);
    })
  }

  addEventListener = () => {
    const { parent: eventBus } = this.props;
    this.mounted(eventBus)
    this.loaded(eventBus);
    this.resized(eventBus)
  }

  removeEventListener = () => {
    const { parent: eventBus } = this.props;
    this.mounted(eventBus, true)
    this.loaded(eventBus, true);
    this.resized(eventBus, true)
  }

  transferTitleOrFooter = (titleOrFooter) => {
    const { page } = this.state;
    const isString = typeof titleOrFooter === 'string';
    return isString ? titleOrFooter : titleOrFooter(page);
  }

  generateTableContentHeight = (props, height) => {
    const {
      parent,
      showHeader,
      bordered
    } = props;
    const containerHeight = height || parent.height;

    const tableContentHeight = computedTableContentHeight(this.headerRef, this.footerRef, this.stickyHeaderRef, this.paginationRef, showHeader, bordered, containerHeight);
    this.setState({
      tableContentHeight
    })
    return tableContentHeight;
  }

  handleOnCell = (event, text, record, index) => {
    const {
      parent: eventBus,
      onCell
    } = this.props;
    eventBus.trigger(`${EVENTPREFIX}-cell-click`, {
      event, text, record, index
    });
    onCell(event, text, record, index)
  }

  handleOnRow = (event, record, index) => {
    const {
      parent: eventBus,
      onRow
    } = this.props;
    eventBus.trigger(`${EVENTPREFIX}-row-click`, {
      event, record, index
    })
    onRow(event, record, index)
  }

  handleGetContainer = (ref) => {
    const {
      getContainer
    } = this.props;
    this.tableContent = ref;
    getContainer(ref);
  }

  stopAnimation = (trigger = true) => {
    if (!this.scrollTimer) return;
    window.cancelAnimationFrame(this.scrollTimer);
    this.scrollTimer = 0;
    this.memoTimestamp = null;
    if (trigger) {
      this.animationStatus = false;
      this.props.parent.trigger(`${EVENTPREFIX}-animation-end`)
    }
  }

  animationScroll = (props, tableContentHeight, trigger = true, scrollPage) => {
    let {
      interval,
      parent,
    } = props;
    const { page } = this.state;
    // 首先判断当前滚动元素是否存在scrollHeight
    const { scrollHeight, scrollTop } = this.scrollContent;
    const { height: headerHeight = 0 } = this.stickyHeaderRef ? window.getComputedStyle(this.stickyHeaderRef) : {};
    // 若小于当前容器高度或当前剩余高度不足以滚动一屏则停止或不开启动画
    if (!scrollPage && (scrollHeight <= tableContentHeight || scrollHeight - replacePX(headerHeight) - scrollTop <= tableContentHeight)) {
      this.stopAnimation(true);
      return;
    }

    trigger && parent.trigger(`${EVENTPREFIX}-animation-start`)
    const animation = (timestamp) => {
      this.animationStatus = true;
      if (!this.memoTimestamp) {
        this.memoTimestamp = timestamp;
      }
      // 计算时间差
      const timestampGap = timestamp - this.memoTimestamp;
      // 计算此次滚动距离
      let scrollGap = timestampGap * (tableContentHeight / interval);
      // 计算当前指定页数的滚动最大距离
      const { offsetTop = 0 } = this.tableContent ? this.tableContent.querySelector(`tbody[data-index='${scrollPage || page}']`) || {} : {};
      // 确认朝向
      const direction = scrollPage ? (page < scrollPage ? 'down' : 'up') : 'down';
      // 若为指定页数需要更改每次滚动距离
      if (scrollPage) {
        scrollGap = timestampGap * (direction === 'up' ? (scrollTop - offsetTop) : (offsetTop - scrollTop)) / interval;
      }
      // 计算最新的scrollTop
      const latestScrollTop = direction === 'up' ? scrollTop - scrollGap : scrollTop + scrollGap;

      this.scrollContent.scrollTop = Math[direction === 'up' ? 'max' : 'min'](latestScrollTop, offsetTop);
      if (timestampGap < interval) {
        this.scrollTimer = window.requestAnimationFrame(animation)
      } else {
        const shouldUpdate = this.observePage(props, scrollPage);

        this.stopAnimation(scrollPage || !shouldUpdate);
        if (!scrollPage) {
          // 判断是否触底
          if (offsetTop + tableContentHeight > scrollHeight) {
            setTimeout(() => {
              this.scrollContent.scrollTop = 0;
              this.animationScroll(props, tableContentHeight, false, scrollPage)
            }, timestampGap)
          }

          this.animationScroll(props, tableContentHeight, false, scrollPage)
        }
      }
    }
    this.scrollTimer = window.requestAnimationFrame(animation)
  }

  handleScrollPage = (props, tableContentHeight) => {
    let {
      autoplay,
      interval,
    } = props;

    if (!this.scrollContent) return;
    // 最小滚动时间
    interval = Math.max(interval, INTERVAL);
    // 更改状态取消滚动
    if (!autoplay) {
      this.stopAnimation();
      return;
    }

    this.animationScroll(props, tableContentHeight);
  }

  observePage = (props, computedPage) => {
    let {
      pagination,
      parent
    } = props || this.props;
    const {
      page,
      data,
      pageSize
    } = this.state;
    const latestPage = computedPage || (page + 1);
    pagination = pagination || {};
    const totalPage = Math.ceil(data.length / pageSize);
    // 若为指定页码则不进行更新
    const shouldUpdate = computedPage ? page !== computedPage : latestPage <= totalPage;

    // 判断是否已经抵达最大页
    if (shouldUpdate && latestPage !== page) {
      this.setState({
        page: latestPage
      })
      parent.trigger(`${EVENTPREFIX}-page-change`, { page: latestPage });
      typeOf(pagination.onChange, 'Function') && pagination.onChange(latestPage, pagination.pageSize || PAGESIZE);
    }

    return shouldUpdate;
  }

  handleOnScroll = (event) => {
    // 若处于自动滚动期间不触发滚动计算
    if (!this.animationStatus) {
      // 滚动的时候要自动计算页数
      const {
        tableContentHeight,
        page,
        data,
        pageSize,
      } = this.state;
      const { scrollTop, scrollHeight } = this.scrollContent;
      const nextPage = Math.min(page + 1, Math.ceil(data.length / pageSize));

      // 计算当前指定页数的滚动最大距离
      const { offsetTop: nextOffsetTop } = this.tableContent.querySelector(`tbody[data-index='${nextPage}']`);
      const { offsetTop: currentOffsetTop } = this.tableContent.querySelector(`tbody[data-index='${page}']`);
      let computedPage = 1;
      if (scrollTop && scrollTop + tableContentHeight + 20 >= scrollHeight) {
        computedPage = Math.ceil(data.length / pageSize);
      } else if (scrollTop && scrollTop >= currentOffsetTop && scrollTop < nextOffsetTop) {
        computedPage = page;
      } else if (scrollTop && scrollTop >= nextOffsetTop) {
        computedPage = nextPage;
      }
      this.observePage(this.props, computedPage);
    }

    this.props.onScroll(event);
  }

  combineColumns = (columns = []) => {
    const {
      columnsConfig = []
    } = this.props;
    return columns.map(v => {
      const currentColumnsConfig = typeOf(columnsConfig, 'Array') ? columnsConfig.find(({ dataIndex }) => dataIndex === v.dataIndex) || {} : {};
      return {
        ...v,
        ...currentColumnsConfig
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    this.stopAnimation(false);
    const tableContentHeight = this.generateTableContentHeight(nextProps)
    this.handleScrollPage(nextProps, tableContentHeight);
    this.combineColumns(this.state.dataColumns);
    this.serilizeData(nextProps.data, nextProps)
  }

  componentWillUnmount() {
    this.removeEventListener();
  }

  render() {
    const {
      title,
      titleWrapperClassname,
      footer,
      footerWrapperClassname,
      bordered,
      containerWrapperClassname,
      empty,
      rowKey,
      showHeader,
      pagination,
    } = this.props;
    const {
      tableContentHeight,
      page,
      total,
      pageSize,
      data,
      dataColumns
    } = this.state;

    const renderColumns = this.combineColumns(dataColumns);

    const className = classnames(prefix, {
      [`${prefix}-bordered`]: bordered
    });

    return (
      <div className={className}>
        {title && <Panel forwardRef={ref => this.headerRef = ref} className={classnames(`${prefix}-title`, titleWrapperClassname)}>{this.transferTitleOrFooter(title)}</Panel>}
        <div className={classnames(`${prefix}-container`, containerWrapperClassname)}>
          {
            showHeader
            &&
            <StickyHeader
              prefix={prefix}
              columns={renderColumns}
              forwardRef={ref => this.stickyHeaderRef = ref}
            />
          }
          <div
            ref={ref => this.scrollContent = ref}
            className={`${prefix}-container-wrapper`}
            style={{ height: tableContentHeight }}
            onScroll={this.handleOnScroll}
            onWheel={() => this.stopAnimation()}
          >
            <TableContent
              prefix={prefix}
              columns={renderColumns}
              dataSource={data}
              empty={empty}
              rowKey={rowKey}
              onCell={this.handleOnCell}
              onRow={this.handleOnRow}
              getContainer={this.handleGetContainer}
              pageSize={pageSize}
            />
          </div>
        </div>
        {footer && <Panel forwardRef={ref => this.footerRef = ref} className={classnames(`${prefix}-footer`, footerWrapperClassname)}>{this.transferTitleOrFooter(footer)}</Panel>}
        {
          pagination && (
            <Pagination
              prefix={prefix}
              forwardRef={ref => this.paginationRef = ref}
              total={total}
              pageSize={pageSize}
              page={page}
              onChange={changePage => this.animationScroll(this.props, tableContentHeight, true, changePage)}
            />
          )
        }
      </div >
    )
  }
}

const sortFucntion = function (data) { return data };
export default class WrapperScrollPageTable extends ReactComponent {
  static defaultOptions = {
    bordered: false,
    showHeader: true,
    empty: EMPTY,
    onCell: noop,
    onRow: noop,
    onScroll: noop,
    getContainer: noop,
    stopWhenMouseEvent: false,
    autoplay: true,
    interval: INTERVAL,
    columnsConfig: [],
    pagination: {
      pageSize: PAGESIZE,
      onChange: noop
    },
    sort: sortFucntion
  }

  static enableLoadCssFile = true;

  getDefaultConfig() {
    return {
      "left": 60,
      "top": 60,
      "width": 1800,
      "height": 960,
      "visible": true
    }
  }

  getDefaultData() {
    return defaultData;
  }

  getReactComponent() {
    return ScrollPageTable;
  }
}
