import React, { useState } from "react";
import { Button, Popover, Input, message } from '@chaoswise/ui';
import { schemaJsonToJson, jsonTosShemaJson, diffShemaJson } from "../../utils";

export default function EditJsonPopover(props) {
    const [visible, setVisible] = useState(false);
    const [innerValue, setInnerValue] = useState("");
   
    const { value, onChange,propertyKey } = props || {};
   
    return (
        <Popover
            trigger="click"
            visible={visible}
            content={
                visible ? (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Input.TextArea
                            style={{ width: 400, marginBottom: "10px" }}
                            rows={10}
                            value={innerValue}
                            onChange={(e) => {
                                setInnerValue(e.target.value);
                            }}
                        />
                        <div>
                            <Button
                                type="primary"
                                onClick={(e) => {
                                    try {
                                        const innerValueObj =JSON.parse(innerValue);
                                        let newValue = jsonTosShemaJson(
                                            innerValueObj,
                                            value,
                                            value.title,
                                        );
                                        newValue = diffShemaJson(
                                            newValue,
                                            value
                                        );
                                        onChange && onChange(newValue);
                                        setVisible(false);
                                    } catch (error) {
                                        console.log('----报错了----',error)
                                        message.error("请检查JSON格式")
                                    }
                                }}
                                style={{ marginRight: "10px" }}
                            >
                                保存
                            </Button>
                            <Button
                                onClick={() => {
                                    setVisible(false);
                                }}
                            >
                                关闭
                            </Button>
                        </div>
                    </div>
                ) : (
                    ""
                )
            }
            placement="bottom"
        >
            <Button
                style={{ marginRight: "10px" }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (visible) {
                        return setVisible(false);
                    }
                    setVisible(true);
                    setInnerValue(
                        JSON.stringify(
                            schemaJsonToJson("", value),
                            null,
                            4
                        )
                    );
                }}
            >
                修改JSON
            </Button>
        </Popover>
    );
}
