import React from 'react';
import {
  InputNumber
} from 'datavi-editor/templates';
import PropTypes from 'prop-types';

import { noop } from '../../utils'

class InputArrayNumber extends React.Component {
  static propTypes = {
    /**
     * @description 数组长度
     * @default 4
     */
    length: PropTypes.number.isRequired,
    /**
     * @description 值
     * @default []
     */
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    /**
     * @description 值更改事件
     * @default noop
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    length: 4,
    value: [],
    onChange: noop
  }

  onInputChange = (val, index) => {
    const { value, onChange, length } = this.props;
    let changeValue = [...value];
    if (value.length < length) {
      // 用0补位
      changeValue = changeValue.concat(new Array(length - value.length).fill(0));
    }
    changeValue.splice(index, 1, val);
    onChange(changeValue)
  }

  render() {
    const { length, value } = this.props;

    return (
      <div>
        {
          new Array(length).fill(0).map((item, index) => <InputNumber min={0} key={index} value={value[index] || item} onChange={val => this.onInputChange(val, index)} />)
        }
      </div>
    )
  }
};

export default InputArrayNumber;