/**
 * @description 标题配置
 */

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  FormItemGroup,
  RadioBooleanGroup,
  Input,
  Select
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';
import Grid from './Grid'
import Font from './Font'

import { TITLELINKTARGET } from '../../constant';
import { INITTITLES } from '../../Chart/theme';

const Option = Select.Option;

const Title = ({
  initialValues,
  onChange,
  title,
  needShow
}) => {
  const handleChange = (form, changeValues) => {
    onChange(changeValues);
  }

  return (
    <Form onValuesChange={handleChange} initialValues={merge({}, INITTITLES, initialValues)}>
      <FormItemGroup title={title}>
        {
          needShow && (
            <FormItem label="显示" name="show">
              <RadioBooleanGroup />
            </FormItem>
          )
        }
        <FormItem name={needShow ? 'text' : 'subtext'}>
          <Input placeholder={`请输入${title}`} />
        </FormItem>
        <FormItem name={needShow ? 'link' : 'sublink'}>
          <Input placeholder={`请输入${title}文本超链接`} />
        </FormItem>
        <FormItem name={needShow ? 'target' : 'subtarget'} label='打开方式'>
          <Select>
            {
              Object.keys(TITLELINKTARGET).map(item => (
                <Option value={item} key={item}>{TITLELINKTARGET[item]}</Option>
              ))
            }
          </Select>
        </FormItem>
        <Font initialValues={initialValues[needShow ? 'textStyle' : 'subtextStyle']} onChange={(value) => onChange({ [needShow ? 'textStyle' : 'subtextStyle']: value })} />
        {
          needShow
          &&
          (
            <React.Fragment>
              <Grid title="" initialValues={initialValues} onChange={onChange} />
            </React.Fragment>
          )
        }
      </FormItemGroup>
    </Form>

  )
}

Title.defaultProps = {
  initialValues: {},
  onChange: () => { },
  title: '',
  // 是否展示主标题相关
  needShow: true
}

Title.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  needShow: PropTypes.bool
}

export default Title;