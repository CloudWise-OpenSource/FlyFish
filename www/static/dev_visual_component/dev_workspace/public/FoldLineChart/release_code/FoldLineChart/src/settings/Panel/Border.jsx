/**
 * @description 边框配置
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  InputNumber,
  FormItemGroup,
  ColorPickerInput,
  Select
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';

import { AXISLINETYPE } from '../../constant/batchAxis';
import { upperCaseIndentWord } from '../../utils';

const Option = Select.Option;

const Border = ({
  initialValues,
  onChange,
  title,
  keyprefix
}) => {

  const getKeyWithPrefix = (key) => keyprefix ? [keyprefix, upperCaseIndentWord(key)].join('') : key;

  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={initialValues}>
      <FormItemGroup title={title}>
        <FormItem name={getKeyWithPrefix('borderColor')} label="边框颜色">
          <ColorPickerInput />
        </FormItem>
        <FormItem name={getKeyWithPrefix('borderWidth')} label="边框宽度">
          <InputNumber placeholder="请输入边框宽度" min={0} />
        </FormItem>
        <FormItem name={getKeyWithPrefix('borderType')} label="边框类型">
          <Select>
            {
              Object.keys(AXISLINETYPE).map(key => (
                <Option key={key} value={key}>{AXISLINETYPE[key]}</Option>
              ))
            }
          </Select>
        </FormItem>
        <FormItem name={getKeyWithPrefix('borderRadius')} label="边框圆角">
          <InputNumber placeholder="请输入边框圆角" min={0} />
        </FormItem>
      </FormItemGroup>
    </Form>

  )
}

Border.defaultProps = {
  initialValues: {},
  onChange: () => { },
  title: '边框',
  keyprefix: '',
}

Border.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  keyprefix: PropTypes.string
}

export default Border;