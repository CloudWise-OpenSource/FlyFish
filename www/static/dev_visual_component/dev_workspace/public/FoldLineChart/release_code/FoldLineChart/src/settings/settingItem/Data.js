import React from 'react';
import {
  Form,
  FormItem,
  TextArea,
} from "datavi-editor/templates";
import { noop, matchFunctionBody } from '../../utils'

class DataTransfer extends React.Component {
  static defaultProps = {
    options: {},
    updateOptions: noop
  }

  constructor(props) {
    super(props);
    const {
      options: {
        transferSeriesData,
        transferXAxisData
      }
    } = props;
    this.state = {
      transferSeriesData: this.stringfiyFunction(transferSeriesData),
      transferXAxisData: this.stringfiyFunction(transferXAxisData)
    }
  }

  handleOptionsChange = (type, value) => {
    const functionBody = matchFunctionBody(value);
    let transferData = null;
    try {
      // 暂时保留这种写法, 会丢掉对应的方法名
      transferData = new Function('data', functionBody)
      // 这里运行一下: 避免方法中存在错误导致组件崩溃
      eval(transferData([]));
    } catch (e) {
      console.warn(e)
      transferData = null;
    }

    this.setState({
      [type]: value
    }, () => {
      if (transferData) {
        this.props.updateOptions({
          [type]: transferData
        })
      }
    })
  }

  stringfiyFunction = (value) => {
    let func = '';
    try {
      func = String(value);
    } catch (e) {
      console.warn(e);
    }
    return func;
  }

  render() {
    const {
      transferSeriesData,
      transferXAxisData
    } = this.state;

    return (
      <Form>
        <FormItem label="xAxis" extra="xAxis数据转换方法">
          <TextArea
            placeholder="请输入数据转换函数"
            value={transferXAxisData}
            onChange={(event) => this.handleOptionsChange('transferXAxisData', event.target.value)}
          />
        </FormItem>
        <FormItem label="series" extra="注意: series数据格式会影响自动生成legend数据结构">
          <TextArea
            placeholder="请输入数据转换函数"
            value={transferSeriesData}
            onChange={(event) => this.handleOptionsChange('transferSeriesData', event.target.value)}
          />
        </FormItem>
      </Form>
    )
  }
}

export default DataTransfer;