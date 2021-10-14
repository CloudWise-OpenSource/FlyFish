import React from "react";
import {
  Form,
  FormItem,
  Select,
} from "datavi-editor/templates";
const { Option } = Select;

import { BATCHAXIS } from '../../constant/batchAxis';

export default class EchartBatchAxis extends React.Component {
  constructor(props) {
    super(props);
  }

  updateOptions(...args) {
    this.props.updateOptions && this.props.updateOptions(...args);
  }

  computedInitPosition = (position) => {
    return Object.keys(BATCHAXIS).find(v => v.toLocaleLowerCase() === Object.values(position).join(''));
  }

  render() {
    const {
      options
    } = this.props;

    return (
      <Form>
        <FormItem label="position" extra={<p>位置这里我们做了联合处理, 按照从左到右<code>x - y</code>即可识别最终position</p>}>
          <Select
            value={this.computedInitPosition(options.position)}
            onSelect={(val) =>
              this.updateOptions({
                position: BATCHAXIS[val],
              })
            }
          >
            {
              Object.keys(BATCHAXIS).map(value => (
                <Option value={value} key={value}>{value}</Option>
              ))
            }
          </Select>
        </FormItem>
      </Form>
    );
  }
}