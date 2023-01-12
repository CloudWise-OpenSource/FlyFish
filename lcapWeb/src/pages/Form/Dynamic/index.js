import React, { useState } from 'react';
import { FieldList, Form, MegaLayout, FormItem, Submit } from '@chaoswise/ui/formily';
import { Button } from '@chaoswise/ui';

function Dynamic() {

  const [value, setValue] = useState();

  const onSubmit = (values) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  const onShow = () => {
    setValue({
      userList: [
        { username: 'morally', age: 21 },
        { username: 'bill', age: 22 },
        { username: 'howard', age: 33 }
      ]
    });
  };

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        value={value}
        initialvalues={{
          userList: [
            { username: 'morally', age: 21 },
          ]
        }}
      >
        <FieldList
          name="userList"
        >
          {
            ({onAdd, onRemove, state, onMoveDown, onMoveUp}) => {
              return (
                <div>
                  {
                    state.value.map((item, index) => {
                      return (
                        <MegaLayout 
                          key={index} 
                          inline
                          labelWidth={null}
                        >
                          <FormItem
                            name={`userList.${index}.username`}
                            type='input'
                            title="用户名"
                          />
                          <FormItem
                            name={`userList.${index}.age`}
                            type='input'
                            title="年龄"
                          />
                          <Button onClick={onRemove.bind(null, index)}>remove</Button>
                          <Button style={{margin: '0 5px'}} onClick={onMoveUp.bind(null, index)}>up</Button>
                          <Button onClick={onMoveDown.bind(null, index)}>down</Button>
                        </MegaLayout>
                      );
                    })
                  }
                  <div style={{marginBottom: 10}}>
                    <Button onClick={onAdd.bind(null)}>Add</Button>
                  </div>
                </div>
              );
            }
          }
        </FieldList>
        <div>
          <Submit />
          <Button style={{marginLeft: 10}} type='primary' onClick={onShow}>表单回显</Button>
        </div>
      </Form>
    </div>
  );
}

export default Dynamic;
