import React from "react";
import {
  Form,
  FormItem,
  Input,
  InputNumber,
  RadioBooleanGroup,
  Select,
} from "datavi-editor/templates";
import TextSetting from './TextSetting';
import AxisLineSetting from "./AxisLineSetting";
const { Option } = Select;

import {
  BATCHAXIS,
  AXISTYPE,
  AXISNAMELOCATIONTYPE,
} from '../../constant/batchAxis';

export default class EchartXAxis extends React.Component {
  constructor(props) {
    super(props);
  }

  updateOptions(...args) {
    this.props.updateOptions && this.props.updateOptions(...args);
  }

  computedInitPosition = (position) => {
    return Object.keys(BATCHAXIS).find(v => v.toLocaleLowerCase() === Object.values(position).join(''));
  }

  handleTextSettingChange = (key, value) => {
    const { type } = this.props;
    // 单独处理 name 和 nameLocation
    const options = {};
    if (['name', 'nameLocation', 'nameGap', 'nameRotate'].includes(key)) {
      options[type] = {
        [key]: value
      }
    } else {
      options[type] = {
        nameTextStyle: {
          [key]: value
        }
      }
    }
    this.updateOptions({
      options
    })
  }

  handleAxisLineSettingChange = (key, value) => {
    const { type } = this.props;
    const options = {};
    // show 单独处理
    if (key === 'show') {
      options[type] = {
        axisLine: {
          show: value
        }
      }
    } else {
      options[type] = {
        axisLine: {
          lineStyle: {
            [key]: value
          }
        }
      }
    }
    this.updateOptions({
      options
    })
  }

  render() {
    const {
      options,
      type
    } = this.props;
    const {
      [type]: {
        show = true,
        realtimeSort = false,
        sortSeriesIndex = 0,
        gridIndex = 0,
        offset = 0,
        splitNumber = 5,
        minInterval = 0,
        maxInterval = null,
        interval = null,
        logBase = 10,
        name = '',
        nameLocation = AXISNAMELOCATIONTYPE.end,
        nameGap = 15,
        nameRotate = null,
        z = 0,
        zLevel = 0,
        axisLine = {},
        nameTextStyle = {}
      } = {},
    } = options.options;
    const textOption = {
      name,
      nameLocation,
      ...nameTextStyle
    }
    const axisLineOption = {
      ...axisLine
    }

    return (
      <Form>
        <FormItem label="show" extra="是否显示轴。">
          <RadioBooleanGroup
            value={show}
            onChange={(event) =>
              this.updateOptions({
                options: {
                  [type]: {
                    show: event.target.value
                  }
                },
              })
            }
          />
        </FormItem>
        <FormItem label="type" extra="坐标轴类型">
          <Select
            value={options.type[type]}
            onSelect={(val) =>
              this.updateOptions({
                type: {
                  [type]: AXISTYPE[val]
                },
              })
            }
          >
            {
              Object.keys(AXISTYPE).map(value => (
                <Option value={value} key={value}>{value}</Option>
              ))
            }
          </Select>
        </FormItem>

        <TextSetting
          onChange={(key, value) => this.handleTextSettingChange(key, value)}
          option={textOption}
          extraPrefix="坐标轴"
          addOnSlot={[
            <FormItem label="name" extra="坐标轴名称" key="name">
              <Input
                placeholder="请输入坐标轴名称"
                value={name}
                onChange={(event) => this.handleTextSettingChange('name', event.target.value)}
              />
            </FormItem>,
            <FormItem label="nameLocation" extra="坐标轴名称显示位置" key="nameLocation">
              <Select
                value={nameLocation}
                onSelect={(val) => this.handleTextSettingChange('nameLocation', AXISNAMELOCATIONTYPE[val])}
              >
                {
                  Object.keys(AXISNAMELOCATIONTYPE).map(value => (
                    <Option value={value} key={value}>{value}</Option>
                  ))
                }
              </Select>
            </FormItem>
          ]}
          addAfterSlot={[
            <FormItem label="nameGap" extra="坐标轴名称与轴线之间的距离" key="nameGap">
              <InputNumber
                value={nameGap}
                onChange={val => this.handleTextSettingChange('nameGap', val)}
              />
            </FormItem>,
            <FormItem label="nameRotate" extra="坐标轴名字旋转，角度值" key="nameRotate">
              <InputNumber
                value={nameRotate}
                onChange={val => this.handleTextSettingChange('nameRotate', val)}
              />
            </FormItem>
          ]}
        />

        <AxisLineSetting
          title="axisLine"
          option={axisLineOption}
          onChange={(key, value) => this.handleAxisLineSettingChange(key, value)}
        />

        <FormItem label="gridIndex" extra="轴所在的 grid 的索引">
          <InputNumber
            value={gridIndex}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  gridIndex: val
                }
              },
            })}
          />
        </FormItem>
        <FormItem label="offset" extra="轴相对于默认位置的偏移，在相同的 position 上有多个对应轴的时候有用">
          <InputNumber
            value={offset}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  offset: val
                }
              },
            })}
          />
        </FormItem>
        <FormItem label="splitNumber" extra="坐标轴的分割段数，需要注意的是这个分割段数只是个预估值">
          <InputNumber
            value={splitNumber}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  splitNumber: val
                }
              },
            })}
          />
        </FormItem>
        <FormItem label="interval" extra="强制设置坐标轴分割间隔。">
          <InputNumber
            value={interval}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  interval: val
                }
              },
            })}
          />
        </FormItem>
        <FormItem label="minInterval" extra="自动计算的坐标轴最小间隔大小,只在数值轴或时间轴中（type: 'value' 或 'time'）有效。">
          <InputNumber
            value={minInterval}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  minInterval: val
                }
              },
            })}
          />
        </FormItem>
        <FormItem label="maxInterval" extra="自动计算的坐标轴最小间隔大小,只在数值轴或时间轴中（type: 'value' 或 'time'）有效。">
          <InputNumber
            value={maxInterval}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  maxInterval: val
                }
              },
            })}
          />
        </FormItem>

        <FormItem label="logBase" extra="对数轴的底数，只在对数轴中（type: 'log'）有效">
          <InputNumber
            value={logBase}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  logBase: val
                }
              },
            })}
          />
        </FormItem>

        <FormItem label="zLevel" extra="轴所有图形的 zlevel 值。zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面">
          <InputNumber
            value={zLevel}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  zLevel: val
                }
              },
            })}
          />
        </FormItem>
        <FormItem label="z" extra="轴组件的所有图形的z值。控制图形的前后顺序。z值小的图形会被z值大的图形覆盖">
          <InputNumber
            value={z}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  z: val
                }
              },
            })}
          />
        </FormItem>

        <FormItem label="realtimeSort" extra="用于制作动态排序柱状图">
          <RadioBooleanGroup
            value={realtimeSort}
            onChange={(event) =>
              this.updateOptions({
                options: {
                  [type]: {
                    realtimeSort: event.target.value
                  }
                },
              })
            }
          />
        </FormItem>
        <FormItem label="sortSeriesIndex" extra="动态排序柱状图用于排序的系列 id。目前只支持一个系列的柱状图排序效果，所以这个值只能取 0。仅当轴 realtimeSort 为 true 并且 type 是 'value' 时有效。">
          <InputNumber
            value={sortSeriesIndex}
            onChange={val => this.updateOptions({
              options: {
                [type]: {
                  sortSeriesIndex: val
                }
              },
            })}
          />
        </FormItem>
      </Form>
    );
  }
}