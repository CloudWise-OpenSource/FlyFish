import React from "react";
import {
  Form,
  FormItem,
  Input,
  RadioBooleanGroup,
  Select,
} from "datavi-editor/templates";
import TextSetting from './TextSetting'
const { Option } = Select;

import { upperCaseIndentWord } from '../../utils';
import { TITLELINKTARGET } from '../../constant';
const specialIndent = ['align', 'verticalAlign', 'border', 'shadow', 'backgroundColor', 'padding', 'top', 'left', 'right', 'bottom'];

export default class EchartTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  updateOptions(...args) {
    this.props.updateOptions && this.props.updateOptions(...args);
  }

  handleTitleChange = (key, value) => {
    let options = {};
    if (specialIndent.find(v => key.startsWith(v))) {
      if (['align', 'verticalAlign'].includes(key)) {
        key = 'text' + upperCaseIndentWord(key);
      }
      options = {
        options: {
          title: {
            [key]: value
          }
        }
      };
    } else {
      options = {
        titleStyle: {
          [key]: value
        }
      }
    }
    this.updateOptions({
      ...options
    })
  }

  computedTitleOptions = () => {
    const {
      options: {
        titleStyle,
        options: {
          title = {}
        } = {}
      }
    } = this.props;
    const {
      textAlign: align,
      textVerticalAlign: verticalAlign
    } = title;
    return {
      ...titleStyle,
      ...title,
      align,
      verticalAlign
    }
  }

  render() {
    const { options } = this.props;
    const {
      options: {
        title: {
          top = 'auto',
          left = 'auto',
          right = 'auto',
          bottom = 'auto'
        } = {}
      }
    } = options;

    return (
      <Form>
        <FormItem label="显示">
          <RadioBooleanGroup
            value={options.showTitle}
            onChange={(event) =>
              this.updateOptions({
                showTitle: event.target.value,
              })
            }
          />
        </FormItem>
        <TextSetting
          addOnSlot={[
            <FormItem label="title" extra="标题文体" key="title">
              <Input
                placeholder="标题文体"
                value={options.title}
                onChange={(event) =>
                  this.updateOptions({
                    title: event.target.value,
                  })
                }
              />
            </FormItem>
          ]}
          option={this.computedTitleOptions()}
          onChange={(key, value) => this.handleTitleChange(key, value)}
          addAfterSlot={[
            <FormItem label="link" key="link" extra="标题文体超链接">
              <Input
                placeholder="标题文体超链接"
                value={options.titleLink}
                onChange={(event) => this.updateOptions({
                  titleLink: event.target.value,
                })}
              />
            </FormItem>,
            <FormItem label="target" key="target" extra="指定窗口打开主标题超链接">
              <Select
                value={options.titleLinkTarget}
                onSelect={(val) => this.updateOptions({
                  titleLinkTarget: TITLELINKTARGET[val],
                })}
              >
                {
                  Object.keys(TITLELINKTARGET).map(item => (
                    <Option value={item} key={item}>{TITLELINKTARGET[item]}</Option>
                  ))
                }
              </Select>
            </FormItem>
          ]}
        />
        <FormItem label="top" extra="容器上侧的距离">
          <Input
            value={top}
            onChange={(event) => this.handleTitleChange('top', event.target.value)}
          />
        </FormItem>
        <FormItem label="bottom" extra="容器下侧的距离">
          <Input
            value={bottom}
            onChange={(event) => this.handleTitleChange('bottom', event.target.value)}
          />
        </FormItem>
        <FormItem label="left" extra="容器左侧的距离">
          <Input
            value={left}
            onChange={(event) => this.handleTitleChange('left', event.target.value)}
          />
        </FormItem>
        <FormItem label="right" extra="容器右侧的距离">
          <Input
            value={right}
            onChange={(event) => this.handleTitleChange('right', event.target.value)}
          />
        </FormItem>
      </Form>
    );
  }
}