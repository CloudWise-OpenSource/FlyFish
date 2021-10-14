/**
 * @description 文字配置
 */

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  FormItemGroup,
  InputNumber,
  Input,
  Select,
  ColorPickerInput,
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';
import Border from './Border'
import Shadow from './Shadow'

import {
  FONTSTYLE,
  FONTWEIGHT
} from '../../constant';
import { INITFONTSTYLE } from '../../Chart/theme';

const Option = Select.Option;

const Font = ({
  title,
  initialValues,
  onChange
}) => {
  return (
    <Form initialValues={merge({}, INITFONTSTYLE, initialValues)} onValuesChange={(form, changeValues) => onChange(changeValues)}>
      <FormItemGroup title={title}>
        <FormItem name="color" label="字体颜色">
          <ColorPickerInput />
        </FormItem>
        <FormItem name="fontStyle" label="字体风格">
          <Select>
            {
              Object.keys(FONTSTYLE).map(value => (
                <Option value={value} key={value}>{FONTSTYLE[value]}</Option>
              ))
            }
          </Select>
        </FormItem>
        <FormItem name="fontWeight" label="字体粗细">
          <Select>
            {
              Object.keys(FONTWEIGHT).map(value => (
                <Option value={value} key={value}>{FONTWEIGHT[value]}</Option>
              ))
            }
          </Select>
        </FormItem>
        <FormItem name="fontFamily" label="字体风格">
          <Input placeholder="请输入字体风格" />
        </FormItem>
        <FormItem name="fontSize" label="字体大小">
          <InputNumber min={12} placeholder="请输入字体大小" />
        </FormItem>
        <FormItem name="lineHeight" label="行高">
          <InputNumber min={1.5} placeholder="请输入行高" />
        </FormItem>
        <Border title="" keyprefix="text" initialValues={initialValues} onChange={onChange} />
        <Shadow title="" keyprefix="text" initialValues={initialValues} onChange={onChange} />
      </FormItemGroup>
    </Form>
  )
}

Font.defaultProps = {
  initialValues: {},
  onChange: () => { },
  title: '',
}

Font.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string
}

export default Font;