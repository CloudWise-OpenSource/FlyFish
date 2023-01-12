/* eslint-disable no-console */
import React, { useState } from 'react';
import { Form, FormItem, MegaLayout, FormButtonGroup, Submit, Reset } from '@chaoswise/ui/formily';

import { data } from './config';
import { Button } from '@chaoswise/ui';

function Basic({
  megaLayoutProps = {}
}) {

  const [ value, setValue ] = useState({});
  const [ isShow, setIsShow ] = useState(true);

  const onSubmit = values => {
    console.log(values);
  };

  const onEditShow = () => {
    setValue({
      form: {
        input: 'abc',
        select: '2',
        checkbox: ['3'],
        radio: '1',
        textarea: '我是TextArea',
        rating: 5,
        datepicker: "2021-03-11",
        switch: true,
        rangepicker: ["2021-03-11", "2021-03-20"],
      }
    });
  };

  const changeIsShow = () => {
    setIsShow(pre => !pre);
  };

  return (
    
    <Form
      value={value}
      style={{padding: '10px 100px'}}
      onSubmit={onSubmit}
      onReset={() => setValue({})}
      editable={isShow}
    >
      <div style={{padding: '20px 130px'}}>
        <Button type='primary' onClick={onEditShow}>编辑回显</Button>
        <Button type='primary' style={{margin: '0 10px'}} onClick={changeIsShow}>{ isShow ? '展示模式' : '编辑模式'}</Button>
        <Reset style={{marginRight: '10px'}}>重置</Reset>
        <Submit>提交</Submit>
      </div>
      <MegaLayout 
        {...megaLayoutProps}
      >
        {
          data.map(item => {
            return (
              <FormItem
                key={item.type}
                type={item.type} 
                rules={item.rules}
                label={item.label}
                name={`form.${item.type}`}
                placeholder={item.type}
                mega-props={item['mega-props'] || {}}
                addonAfter={item.addonAfter}
                {
                  ...item.comProps
                }
              />
            );
          })
        }
      </MegaLayout>
      <FormButtonGroup>
        
      </FormButtonGroup>
    </Form>
  );
}

export default Basic;
