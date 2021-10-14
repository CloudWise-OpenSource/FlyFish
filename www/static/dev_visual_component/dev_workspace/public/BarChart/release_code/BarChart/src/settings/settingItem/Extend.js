import React from "react";
import {
  Form,
  FormItem,
  TextArea
} from "datavi-editor/templates";

export default class EchartExtend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customOptions: JSON.stringify(props.options.options)
    }
  }

  updateOptions(...args) {
    this.props.updateOptions && this.props.updateOptions(...args);
  }

  handleJSON = (event) => {
    const val = event.target.value;

    try {
      const options = JSON.parse(val);
      this.updateOptions({ options });
    } catch (e) {
      console.warn(e)
    }
    this.setState({
      customOptions: val
    })
  }

  render() {
    const { customOptions } = this.state;
    return (
      <Form>
        <FormItem label="自定义配置" extra="注意: 若使用自定义配置会覆盖我们提供的部分独立的配置">
          <TextArea
            value={customOptions}
            placeholder="echarts中所有配置均可使用"
            onChange={(event) => this.handleJSON(event)}
          />
        </FormItem>
      </Form>
    );
  }
}