import React from 'react';
import {
  FormItem,
  Input,
  Radio,
  Select,
  TextArea
} from "datavi-editor/templates";

import PropTypes from 'prop-types';

import { noop, matchFunctionBody } from '../../utils';
import { SERIESSYMBOL, SERIESSYMBOLURLPREFIX } from '../../constant';

const style = {
  display: 'block',
  marginBottom: 0
}

const initValue = {
  1: SERIESSYMBOL.emptyCircle,
  2: [SERIESSYMBOLURLPREFIX.image, ''],
  3: function (value, params) { return '' }
}

class SymbolSetting extends React.Component {
  static propTypes = {
    /**
     * @description 受控组件值
     */
    value: PropTypes.string,
    /**
     * @description 值变动
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: noop
  }

  constructor(props) {
    super(props);
    this.state = this.computedRadioType(props.value)
  }

  computedRadioType = (value) => {
    const reg = /^(image|path):\/\//;
    let currentFunction = null;
    let radioType = 3;
    if (reg.test(value)) {
      radioType = 2;
    } else if (!value || SERIESSYMBOL[value]) {
      radioType = 1;
    }
    const computedValue = {
      ...initValue
    }
    computedValue[radioType] = value || initValue[radioType];
    if (radioType === 3) {
      currentFunction = computedValue[radioType];
      computedValue[radioType] = currentFunction.toString();
    }
    return {
      radioType,
      value: computedValue,
      function: currentFunction
    };
  }

  handleSymbolMethodChange = (e) => {
    const radioType = e.target.value;
    this.setState({
      radioType
    }, () => {
      this.props.onChange(this.handleValue(radioType));
    });
  }

  handleSymbolValueChange = (chooseValue, type, changeValue) => {
    const { radioType, value } = this.state;
    this.setState({
      value: {
        ...value,
        [type]: chooseValue
      }
    }, () => {
      if (type === radioType) {
        this.props.onChange(this.handleValue(radioType, changeValue));
      }
    })
  }

  handleValue = (radioType, changeValue) => {
    const { value, function: formatFunction } = this.state;
    let currentValue = changeValue || value[radioType];
    if (Array.isArray(currentValue)) {
      currentValue = currentValue.join('');
    } else if (radioType === 3 && !currentValue) {
      currentValue = formatFunction;
    }
    return currentValue;
  }

  inputPrefix = () => {
    const { value } = this.state;
    const prefixValue = value[2]
    const options = Object.values(SERIESSYMBOLURLPREFIX)
    return (
      <Select
        value={prefixValue[0]}
        onChange={(value) => {
          this.handleSymbolValueChange([value, prefixValue[1]], 2)
        }}
      >
        {
          options.map((value) => (
            <Select.Option value={value} key={value}>{value}</Select.Option>
          ))
        }
      </Select>
    )
  }

  handleSymbolFunction = (value) => {
    const functionBody = matchFunctionBody(value);
    let formatFunction = null;
    try {
      formatFunction = new Function('value', 'params', functionBody);
    } catch (e) {
      console.warn(e);
      formatFunction = null;
    }
    if (formatFunction) {
      this.setState({
        function: formatFunction
      })
    }
    this.handleSymbolValueChange(value, 3, formatFunction)
  }


  render() {
    const { radioType, value } = this.state;
    return (
      <Radio.Group value={radioType} style={style} onChange={this.handleSymbolMethodChange}>
        <p>symbol</p>
        <Radio style={style} value={1}>
          <FormItem style={style} label="symbol-select" extra="普适选项">
            <Select value={value[1]} onChange={(value) => this.handleSymbolValueChange(value, 1)}>
              {
                Object.keys(SERIESSYMBOL).map(value => (
                  <Select.Option value={value} key={value}>{value}</Select.Option>
                ))
              }
            </Select>
          </FormItem>
        </Radio>
        <Radio style={style} value={2}>
          <FormItem style={style} label="symbol-url" extra="扩展配置">
            <Input
              value={value[2][1]}
              onChange={(event) => this.handleSymbolValueChange([value[2][0], event.target.value], 2)}
              addonBefore={this.inputPrefix()}
              placeholder="请输入对应的url"
            />
          </FormItem>
        </Radio>
        <Radio style={style} value={3}>
          <FormItem style={style} label="symbol-function" extra="自定义函数配置">
            <TextArea
              value={value[3]}
              onChange={(event) => this.handleSymbolFunction(event.target.value)}
            />
          </FormItem>
        </Radio>
      </Radio.Group>
    )
  }


}

export default SymbolSetting;