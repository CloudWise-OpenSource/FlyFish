import React from "react";
import { Select, Form } from '@chaoswise/ui';
import * as PropTypes from "prop-types";
import classNames from "classnames";
import styleName from "../../utils/styleName";
import SelectType from "../custom/selectType";

function FormBoolean({ propertyKey, value, onChange, isNew, isVisible }) {
    return (
        <Form.Item
            className={classNames(isVisible ? styleName("hidden") : undefined)}
            label={
                <div className={styleName("label-title")}>
                    {value.title || propertyKey}
                    {value?.isNew && <SelectType root={value} onChange={onChange}/>}
                </div>
            }
        >
            <Select value={value.default != null ? value.default + "" : "true"} className={styleName('string-select')}
                onChange={(newValue) => { 
                    value.default = newValue === "true" ? true : false;
                    onChange && onChange(value);
                }}
            >
                <Select.Option value={"true"}>{"true"}</Select.Option>
                <Select.Option value={"false"}>{"false"}</Select.Option>
            </Select>
        </Form.Item>
    );
}

FormBoolean.propTypes = {
    propertyKey: PropTypes.string,
    value: PropTypes.object,
    onChange: () => { },
    isNew: PropTypes.bool,
    isVisible: PropTypes.bool,
};

FormBoolean.defaulyProps = {
    propertyKey: "",
    value: {},
    onChange: () => { },
    isNew: false,
    isVisible: true,
};

export default FormBoolean;
