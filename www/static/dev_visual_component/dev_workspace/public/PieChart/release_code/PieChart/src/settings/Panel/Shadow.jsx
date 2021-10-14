/**
 * @description 阴影配置
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  InputNumber,
  FormItemGroup,
  ColorPickerInput
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';

import { upperCaseIndentWord } from '../../utils';

const Shadow = ({
  initialValues,
  onChange,
  title,
  keyprefix
}) => {

  const getKeyWithPrefix = (key) => keyprefix ? [keyprefix, upperCaseIndentWord(key)].join('') : key;

  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={initialValues}>
      <FormItemGroup title={title}>
        <FormItem name={getKeyWithPrefix('shadowColor')} label="阴影颜色">
          <ColorPickerInput />
        </FormItem>
        <FormItem name={getKeyWithPrefix('shadowBlur')} label="模糊大小">
          <InputNumber placeholder="请输入模糊大小" />
        </FormItem>
        <FormItem name={getKeyWithPrefix('shadowOffsetX')} label="水平偏移">
          <InputNumber placeholder="请输入水平偏移" />
        </FormItem>
        <FormItem name={getKeyWithPrefix('shadowOffsetY')} label="垂直偏移">
          <InputNumber placeholder="请输入垂直偏移" />
        </FormItem>
      </FormItemGroup>
    </Form>

  )
}

Shadow.defaultProps = {
  initialValues: {},
  onChange: () => { },
  title: '阴影',
  keyprefix: '',
}

Shadow.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  keyprefix: PropTypes.string
}

export default Shadow;