import React from 'react';
import { getComponent } from "../utils/component";
import { schemaJsonToJson } from "../utils";
import { Button, Form } from '@chaoswise/ui';

export default function FormPanel(props) {
    let {
        value,
        onChange,
        isCheck,
        setErrorState,
        formOptions = {}
    } = props || {};
    if (value == null || typeof value !== "object") {
        value = {
            "type": "object",
            properties: {}
        };
    }
    const Component = getComponent(value);
    
    return (
        <Form layout="vertical" {...formOptions}>
            <Component  value={value} isCheck={isCheck} setErrorState={setErrorState}  onChange={(newValue) => {
                onChange && onChange(newValue, schemaJsonToJson(newValue, {}))
            }} />
        </Form>
    );
    
}