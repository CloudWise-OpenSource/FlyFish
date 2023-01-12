import React, { useEffect, useState } from "react";
import { InputNumber, Form } from '@chaoswise/ui';
import * as PropTypes from "prop-types";
import classNames from "classnames";
import styleName from "../../utils/styleName";
import SelectType from "../custom/selectType";
import stroe from '../store'

function FormInputNumber({ propertyKey, value, onChange, isVisible, required,isCheck }) {
    const [innerValue, setInnerValue] = useState(value.default || "");
    const nodeDefault = value.default;
    const [errorTitle, setErrorTitle] = useState(false)
    let { setErrorState } = stroe
    let { maximum, minimum, description } = value
    useEffect(() => {
        if (isCheck) {
            check()
        }
    }, [isCheck]);
    useEffect(() => {
        if (innerValue) {
            check()
        }
        if (innerValue !== nodeDefault) {
            setInnerValue(nodeDefault);
        }
        setErrorTitle(null)
    }, [nodeDefault]);
    let check = () => {
        if (minimum && nodeDefault < minimum) {
            setInnerValue(minimum)
            setErrorState(true)

            value.default = minimum;
            onChange && onChange(value);
            return
        }
        if (maximum && nodeDefault > maximum) {
            setInnerValue(maximum)
            setErrorState(true)

            value.default = maximum;
            onChange && onChange(value);
            return
        }
        if (required && required.includes(propertyKey)&& !nodeDefault){
            setErrorTitle(`字段不能为空`)
            setErrorState(true)
            return
        }
    }
    return (
        <Form.Item
            className={classNames(isVisible ? styleName("hidden") : undefined)}
            label={
                <div className={styleName("label-title")}>
                  {required && required.includes(propertyKey)&& <span style={{ color: 'red', marginRight: '10px' }}>*</span>}
                    {value.title || propertyKey}   {description ? `( ${description} )` : ''}
                    {value?.isNew && <SelectType root={value} onChange={onChange} />}
                </div>
            }
        >
            <InputNumber
                value={innerValue}
                max={maximum}
                min={minimum}
                style={{ width: "100%" }}
                onChange={(value) => {
                    if (value > maximum) {
                        value = maximum
                    }
                    if (value < minimum) {
                        value = minimum
                    }
                    const newValue = value;
                    setInnerValue(newValue);
                }}
                onBlur={() => {
                    value.default = innerValue;
                    onChange && onChange(value);
                }}
            />
             {errorTitle && <div style={{ color: 'red', float: 'left', marginTop: '10px' }}>{errorTitle}</div>}
        </Form.Item>
    );
}

FormInputNumber.propTypes = {
    propertyKey: PropTypes.string,
    value: PropTypes.object,
    onChange: () => { },
    isNew: PropTypes.bool,
    isVisible: PropTypes.bool,
};

FormInputNumber.defaulyProps = {
    propertyKey: "",
    value: {},
    onChange: () => { },
    isNew: false,
    isVisible: true,
};

export default FormInputNumber;
