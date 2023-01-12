import React, { useState } from "react";
import { Button, Checkbox, Popover, Input, message } from '@chaoswise/ui';

export default function EditJsonpopover(props) {
    const [inputVal, setInputVal] = useState("");
    let { value, onChange } = props;


    const stopPropagation = function (e) {
        e.stopPropagation();
        return;
    };

    return (
        <Popover
            trigger="click"
            onClick={stopPropagation}
            onVisibleChange={(visible) => {
                if (!visible) {
                    setInputVal("");
                }
            }}
            content={
                <div onClick={stopPropagation}>
                    {value &&
                        Object.keys(value.properties).map((property) => {
                            let item = value.properties[property];
                            return (
                                <div key={property}>
                                    {
                                        <Checkbox
                                            checked={!item.isNew || item.isNew && !item.isDisable}
                                            disabled={item.isNew ? false : true}
                                            onChange={e => {
                                                if (!e.target.checked) {
                                                    let newValue = { ...value }
                                                    newValue.properties[property].isDisable = true
                                                    onChange(newValue)
                                                } else {
                                                    let newValue = { ...value }
                                                    if (item.isNew) {
                                                        newValue.properties[property].isDisable = false
                                                        onChange(newValue)
                                                    }
                                                }
                                            }}
                                        >
                                            {property}
                                        </Checkbox>
                                    }
                                </div>
                            );
                        })}
                    <div style={{ display: "flex", marginTop: "10px" }}>
                        <Input
                            value={inputVal}
                            placeholder="请输入新增的属性名"
                            style={{ marginRight: '10px' }}
                            onChange={(e) => {
                                setInputVal(e.target.value);
                            }}
                        />
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => {

                                if (inputVal) {
                                    if (
                                        value.properties &&
                                        Object.keys(value.properties).find(
                                            (item) => item === inputVal
                                        )
                                    ) {
                                        message.error(
                                            "该对象內已有相同属性的值,请重新输入！"
                                        );
                                        return;
                                    } else {
                                        let newValue = { ...value }
                                        newValue.properties = {
                                            ...value.properties,
                                            [inputVal]: {title:inputVal, type: 'string', default: '', isNew: true }
                                        }
                                        onChange && onChange(newValue);
                                    }
                                } else {
                                    message.error("请输入属性名后再进行追加!");
                                    return;
                                }
                            }}
                        >
                            添加
                        </Button>
                    </div>
                </div>
            }
            placement="bottom"
        >
            <Button>追加属性</Button>
        </Popover>
    );
}
