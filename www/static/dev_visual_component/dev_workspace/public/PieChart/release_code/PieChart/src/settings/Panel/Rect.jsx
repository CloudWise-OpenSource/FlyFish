/**
 * @description 物理配置
 */

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  Input,
  FormItemGroup,
  ColorPickerInput
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';
import Border from './Border'
import Shadow from './Shadow'

import { RECT } from '../../Chart/theme';

const Rect = ({
  initialValues,
  onChange,
  title,
  replaceBackgroundColor,
  needDefault
}) => {
  const { key, label } = merge({}, { key: 'backgroundColor', label: '背景色' }, replaceBackgroundColor || {})

  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={needDefault ? merge({}, RECT, initialValues) : {}}>
      <FormItemGroup title={title}>
        <FormItem name="width" label="宽度">
          <Input placeholder="请输入组件的宽度" />
        </FormItem>
        <FormItem name="height" label="高度">
          <Input placeholder="请输入组件的高度" />
        </FormItem>
        <FormItem name={key} label={label}>
          <ColorPickerInput />
        </FormItem>
        <Border title="" initialValues={initialValues} onChange={onChange} />
        <Shadow title="" initialValues={initialValues} onChange={onChange} />
      </FormItemGroup>
    </Form>

  )
}

Rect.defaultProps = {
  initialValues: {},
  onChange: () => { },
  title: '尺寸',
  needDefault: true
}

Rect.propTypes = {
  initialValues: PropTypes.object.isRequired,
  needDefault: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  replaceBackgroundColor: PropTypes.shape({ key: PropTypes.string, label: PropTypes.string })
}

export default Rect;