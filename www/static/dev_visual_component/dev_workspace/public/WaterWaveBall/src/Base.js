import React from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';

class Echarts extends React.Component {
  constructor(props) {
    super(props);
    this.echartsAPI = null;
    this.echartContainerRef = React.createRef();
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    if (this.echartsAPI != null) {
      let {
        type,
        theme,
        initOpts
      } = this.props;

      let {
        type: oldType,
        theme: oldTheme,
        initOpts: oldInitOpts
      } = prevProps;
      if (type !== oldType || theme !== oldTheme || initOpts !== oldInitOpts) {
        this.draw();
      } else {
        this.setEchartOptions();
      }
    } else {
      this.draw();
    }
  }

  componentWillUnmount() {
    if (this.echartsAPI != null) {
      if (typeof this.echartsAPI.dispose === "function") {
        this.echartsAPI.dispose();
      }
      let onEchartDestroy = this.props.onEchartDestroy;
      onEchartDestroy && typeof onEchartDestroy === "function" && onEchartDestroy();
      this.echartsAPI = null;
    }
  }

  draw() {
    if (this.echartContainerRef && this.echartContainerRef.current) {
      if (this.echartsAPI) {
        this.echartsAPI.dispose();
        let onEchartDestroy = this.props.onEchartDestroy;
        onEchartDestroy && typeof onEchartDestroy === "function" && onEchartDestroy();
      }
      let {
        theme,
        onEchartCreated,
        initOpts
      } = this.props;
      this.echartsAPI = echarts.init(this.echartContainerRef.current, theme, initOpts || {});
      this.setEchartOptions();
      onEchartCreated && typeof onEchartCreated === "function" && onEchartCreated(this.echartsAPI);
    }
  }

  setEchartOptions() {
    if (this.echartsAPI) {
      let {
        options
      } = this.props;
      if (options && typeof options === "function") {
        this.echartsAPI.setOption(options());
      } else if (options && typeof options.then === "function") {
        options.then((resp) => {
          this.echartsAPI.setOption(resp);
        });
      } else {
        this.echartsAPI.setOption(options || {}, false, ['series']);
      }
    }
  }

  render() {
    let {
      width,
      height,
      classNames
    } = this.props;
    let innerStyles = {};
    if (width) {
      innerStyles.width = width;
    }
    if (height) {
      innerStyles.height = height;
    }
    return (
      <div ref={this.echartContainerRef} className={classNames} style={innerStyles}>
      </div>
    );
  }
}

Echarts.defaultProps = {
  type: '',
  theme: "",
  initOpts: {},
  options: {},
  classNames: "",
  width: "",
  height: "",
  onEchartCreated: null,
  onEchartDestroy: null
}

Echarts.propTypes = {
  /**
   * echarts图表类型 (当图表已经渲染，变更图表类型type、主题theme、创建实例附加参数initOpts，则会销毁掉当前实例，创建新的实例)
   */
  type: PropTypes.string.isRequired,
  /**
   * echarts主题 (当图表已经渲染，变更图表类型type、主题theme、创建实例附加参数initOpts，则会销毁掉当前实例，创建新的实例)
   */
  theme: PropTypes.string,
  /**
   * 创建实例附加参数initOpts (当图表已经渲染，变更图表类型type、主题theme、创建实例附加参数initOpts，则会销毁掉当前实例，创建新的实例)
   */
  initOpts: PropTypes.object,
  /**
   * echarts实例构建的options属性
   */
  options: PropTypes.object,
  /**
   * 当前组件Container的类名
   */
  classNames: PropTypes.string,
  /**
   * 当前组件Container的宽度
   */
  width: PropTypes.string,
  /**
   * 当前组件Container的高度
   */
  height: PropTypes.string,
  /**
   * echarts实例被创建时触发，参数为当前echarts实例对象
   */
  onEchartCreated: PropTypes.func,
  /**
   * echarts实例要被销毁时触发，旨在通知父组件通过onEchartCreated暂存的echarts实例对象，避免内存泄漏
   */
  onEchartDestroy: PropTypes.func
}

export default Echarts;