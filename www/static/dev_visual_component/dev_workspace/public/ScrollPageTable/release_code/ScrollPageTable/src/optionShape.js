import PropTypes from 'prop-types';

const shapeOfEmpty = {
  message: PropTypes.string,
  icon: PropTypes.string
}

export {
  shapeOfEmpty
}

const event = {
  /**
   * @description 点击行
   */
  onRow: PropTypes.func,
  /**
   * @description 点击单元格
   */
  onCell: PropTypes.func,
  /**
   * @description 滚动事件
   */
  onScroll: PropTypes.func,
  /**
   * @description 获取当前滚动元素
   */
  getContainer: PropTypes.func,
}

export {
  event
}

const pagination = {
  /**
   * @description 每页个数
   */
  pageSize: PropTypes.number,
  /**
   * @description 页数更改函数
   */
  onChange: PropTypes.func,
  /**
   * @description 总条数
   */
  total: PropTypes.number,
}

export {
  pagination
}

const shapeOfColumn = {
  /**
   * @description 设置列的对齐方式
   */
  align: PropTypes.oneOf(['left', 'right', 'center']),
  /**
   * @description 超过宽度将自动省略
   */
  ellipsis: PropTypes.bool,
  /**
   * @description 列样式类名
   */
  className: PropTypes.string,
  /**
   * @description 列数据在数据项中对应的 key
   */
  dataIndex: PropTypes.string.isRequired,
  /**
   * @description 列头显示文字
   */
  title: PropTypes.string.isRequired,
  /**
   * @description 列宽度
   */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export {
  shapeOfColumn
}

const shapeOfData = PropTypes.shape({
  current: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  data: PropTypes.shape({
    columns: PropTypes.arrayOf(shapeOfColumn),
    dataSource: PropTypes.arrayOf(PropTypes.object)
  })
});

export {
  shapeOfData
}

const shapeOfOption = {
  /**
   * @description 表格标题
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * @description 表格尾部
   */
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * @description 表格标题类名
   */
  titleWrapperClassname: PropTypes.string,
  /**
   * @description 表格尾部类名
   */
  footerWrapperClassname: PropTypes.string,
  /**
   * @description 表格container类名
   */
  containerWrapperClassname: PropTypes.string,
  /**
   * @description 是否展示外边框和列边框
   */
  bordered: PropTypes.bool,
  /**
   * @description 是否显示表头
   */
  showHeader: PropTypes.bool,
  /**
   * @description 表格无数据配置
   */
  empty: PropTypes.shape(shapeOfEmpty),
  /**
   * @description 表格行 key 的取值
   */
  rowKey: PropTypes.string.isRequired,
  /**
   * @description 是否自动滑动
   */
  autoplay: PropTypes.bool,
  /**
   * @description 鼠标事件是否会暂停滚动
   */
  stopWhenMouseEvent: PropTypes.bool,
  /**
   * @description 滑动间隔
   */
  interval: PropTypes.number,
  /**
   * @description 翻页器配置
   */
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape(pagination)]),
  /**
   * @description 数据
   */
  data: shapeOfData,
  sort: PropTypes.func,
  /* event */
  ...event
}

export default shapeOfOption;