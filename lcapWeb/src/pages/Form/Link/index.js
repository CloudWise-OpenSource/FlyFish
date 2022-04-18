import React from 'react';
import { Form, subscribeFields, FormItem, MegaLayout, FieldList } from '@chaoswise/ui/formily';

import { Button } from '@chaoswise/ui';

function FormLink() {
  return (
    <div>
      <Form
        value={{
          a: 1,
          nubmer: [
            {
              one: 10,
            }
          ]
        }}
        effects={() => {
          subscribeFields([
            ['a', ({state, setFieldState}) => {
              setFieldState('b', preState => {
                preState.value = state.value * 4;
              });
            }],
            ['switch', ({state, setFieldState}) => {
              setFieldState('c', preState => {
                preState.visible = state.value;
              });
            }],
            ['nubmer.*.one', ({state, setFieldState, transform}) => {


              const targetPath = transform(state.name, /\d/, index => `nubmer.${index}.two`);


              setFieldState(targetPath, preState => {
                preState.value = state.value * 2;
              });
            }]
          ]);
        }}
      >
        <MegaLayout>
          <FormItem 
            name='switch'
            label='控制c是否显示'
            type='switch'
          />
          <FormItem 
            name='a'
            label='a'
            type='input'
          />
          <FormItem 
            name='b'
            label='b'
            type='input'
          />
           <FormItem 
            name='c'
            label='c'
            type='input'
          />
        </MegaLayout>
        <div style={{paddingLeft: 130}}>
          <h4>动态表单</h4>
          <FieldList
            name="nubmer"
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
                              name={`nubmer.${index}.one`}
                              type='input'
                              title="单数"
                            />
                            <FormItem
                              name={`nubmer.${index}.two`}
                              type='input'
                              title="双数"
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
        </div>
        
      </Form>
    </div>
  );
}

export default FormLink;
