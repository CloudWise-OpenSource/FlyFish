import React from 'react';
import {
  ComponentOptionsSetting,
  RadioBooleanGroup,
  FormItemGroup,
  Input,
  InputNumber,
  TextArea
} from 'datavi-editor/templates';
import Extend from './Extend';
import { INTERVAL } from '../constant';

import Form, { FormItem } from './Form';

export default class OptionsSetting extends ComponentOptionsSetting {
  constructor(props) {
    super(props);
  }

  getTabs() {
    return {
      title: {
        label: '配置',
        content: () => this.renderConfig()
      }
    }
  }

  handleConfigChange = (form, value) => {
    if (value.columnsConfig) {
      value.columnsConfig = this.transferConfig(value.columnsConfig);
    }
    this.updateOptions(value)
  }

  transferConfig = (value) => {
    let formatValues = [];
    try {
      formatValues = JSON.parse(value);
    } catch (e) {
      formatValues = [];
    }
    return formatValues;
  }

  stringify = (value) => {
    let formatValues = '';
    try {
      formatValues = JSON.stringify(value);
    } catch (e) {
      formatValues = '';
    }
    return formatValues;
  }

  renderConfig() {
    const {
      options: {
        empty = {},
        sort,
        columnsConfig = [],
        ...initialValues
      } = {
        autoplay: true,
        bordered: false,
        showHeader: true,
        stopWhenMouseEvent: false,
        title,
        footer,
        titleWrapperClassname,
        footerWrapperClassname,
        containerWrapperClassname,
        interval: INTERVAL,
        pagination: true,
        rowKey,
      }
    } = this.props;
    console.log(this.props.options)
    return (
      <React.Fragment>
        <Form initialValues={{ ...initialValues, columnsConfig: this.stringify(columnsConfig) }} onValuesChange={this.handleConfigChange}>
          <FormItemGroup title="基础配置">
            <FormItem name="autoplay" label="自动滚动">
              <RadioBooleanGroup />
            </FormItem>
            <FormItem name="rowKey" label="表格行 key ">
              <Input maxLength={30} placeholder="请输入表格行 key " />
            </FormItem>
            <FormItem name="interval" label="时间间隔">
              <InputNumber min={INTERVAL} />
            </FormItem>
            <FormItem name="bordered" label="边框">
              <RadioBooleanGroup />
            </FormItem>
            <FormItem name="showHeader" label="显示表头">
              <RadioBooleanGroup />
            </FormItem>
            <FormItem name="pagination" label="显示翻页器">
              <RadioBooleanGroup />
            </FormItem>
          </FormItemGroup>

          <FormItemGroup title="表头表尾配置">
            <FormItem name="columnsConfig" label="表头配置">
              <TextArea placeholder="请输入数组格式表头配置" />
            </FormItem>
            <FormItem name="title" label="表格标题">
              <Input placeholder="请输入表格标题" />
            </FormItem>
            <FormItem name="footer" label="表格尾部">
              <Input placeholder="请输入表格尾部" />
            </FormItem>
          </FormItemGroup>


          <FormItemGroup title="样式配置">
            <FormItem name="titleWrapperClassname" label="标题类名">
              <Input placeholder="请输入表格标题类名" />
            </FormItem>
            <FormItem name="footerWrapperClassname" label="尾部类名">
              <Input placeholder="请输入表格尾部类名" />
            </FormItem>
            <FormItem name="containerWrapperClassname" label="滚动区类名">
              <Input placeholder="请输入表格滚动区类名" />
            </FormItem>
          </FormItemGroup>

          <FormItemGroup title="缺省配置" onValuesChange={(form, changeValues) => this.updateOptions({ empty: changeValues })}>
            <Form initialValues={empty} >
              <FormItem name="message" label="缺省文字">
                <Input placeholder="请输入缺省文字" />
              </FormItem>
              <FormItem name="icon" label="缺省图片">
                <Input placeholder="请输入缺省图片" />
              </FormItem>
            </Form>
          </FormItemGroup>
        </Form>
        <Extend initialValues={{ sort }} onChange={option => this.updateOptions(option)} />
      </React.Fragment>
    );
  }
}