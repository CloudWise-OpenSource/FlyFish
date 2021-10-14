import React from 'react';
import {
  Form,
  FormItem,
  RadioBooleanGroup,
  Input,
} from "datavi-editor/templates";
import SymbolSetting from './Symbol';
import AxisLineSetting from './AxisLineSetting';
import AreaSetting from './Area';

class SeriesSetting extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSeriesChange = (key, value, parent) => {
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
        series: options
      }
    })
  }

  render() {
    const {
      options: {
        options: {
          series = {}
        } = {}
      }
    } = this.props;
    const {
      smooth = false,
      clip = true,
      showSymbol = true,
      step = false,
      name,
      lineStyle = {},
      areaStyle = {}
    } = series;

    return (
      <Form>
        <FormItem label="name" extra="系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列">
          <Input
            value={name}
            onChange={event => this.handleSeriesChange('name', event.target.value)}
          />
        </FormItem>
        <FormItem label="smooth" extra="是否开启平滑处理">
          <RadioBooleanGroup
            value={smooth}
            onChange={(event) => this.handleSeriesChange('smooth', event.target.value)}
          />
        </FormItem>
        <FormItem label="showSymbol" extra="是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示">
          <RadioBooleanGroup
            value={showSymbol}
            onChange={(event) => this.handleSeriesChange('showSymbol', event.target.value)}
          />
        </FormItem>
        <FormItem label="clip" extra="是否裁剪超出坐标系部分的图形">
          <RadioBooleanGroup
            value={clip}
            onChange={(event) => this.handleSeriesChange('clip', event.target.value)}
          />
        </FormItem>
        <FormItem label="step" extra="是否是阶梯线图">
          <RadioBooleanGroup
            value={step}
            onChange={(event) => this.handleSeriesChange('step', event.target.value)}
          />
        </FormItem>
        <AreaSetting
          option={areaStyle}
          onChange={(key, value) => this.handleSeriesChange(key, value, 'areaStyle')}
        />
        <SymbolSetting
          value={series.symbol}
          onChange={(value) => this.handleSeriesChange('symbol', value)}
        />
        <AxisLineSetting
          title="lineStyle"
          option={{ lineStyle, show: lineStyle.show }}
          onChange={(key, value) => this.handleSeriesChange(key, value, 'lineStyle')}
        />
      </Form>
    )
  }
}

export default SeriesSetting;