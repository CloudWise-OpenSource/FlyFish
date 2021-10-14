// 区分： 这个为公共设置
import React from 'react';
import {
  Form,
  FormItem,
  RadioBooleanGroup
} from "datavi-editor/templates";
import AxisPointerSetting from './AxisPointer';

import PropTypes from 'prop-types';

import { noop } from '../../utils';

class AxisPointerGlobalSetting extends React.Component {
  static propTypes = {
    /**
     * @description 受控组件值
     */
    option: PropTypes.object,
    /**
     * @description 值变动
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: noop,
    options: {},
  }

  constructor(props) {
    super(props);
  }

  handleAxisPointerChange = (key, value, parent) => {
    let options = {
      [key]: value
    }
    if (parent) {
      options = {
        [parent]: options
      }
    }
    this.props.updateOptions({
      options: {
        axisPointer: options
      }
    })
  }

  render() {
    const {
      options: {
        options: {
          axisPointer = {}
        } = {}
      } = {},
    } = this.props;

    const {
      show = false,
      ...option
    } = axisPointer;
    return (
      <Form>
        <FormItem label="show" extra="是否展示">
          <RadioBooleanGroup
            value={show}
            onChange={(event) => this.handleAxisPointerChange('show', event.target.value)}
          />
        </FormItem>
        <AxisPointerSetting
          title=" "
          option={option || {}}
          needKey={false}
          onChange={this.handleAxisPointerChange}
        />
      </Form>
    )
  }


}

export default AxisPointerGlobalSetting;