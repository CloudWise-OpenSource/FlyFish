import React, { useEffect, useState } from 'react';
import { Input, Form, Select } from '@chaoswise/ui';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import styleName from '../../utils/styleName';
import SelectType from "../custom/selectType";
function FormInput({ propertyKey, value, onChange, isCheck, isVisible, required, setErrorState = () => { } }) {
    const [innerValue, setInnerValue] = useState(value.default || "");
    const [errorTitle, setErrorTitle] = useState(false)
    const nodeDefault = value.default;
    let { minLength, maxLength, description } = value
    useEffect(() => {
        if (isCheck) {
            check(true)
        } else {
            setErrorState(false)
            setErrorTitle(null)
        }
    }, [isCheck]);
    useEffect(() => {
        if (innerValue !== nodeDefault) {
            check()
            setInnerValue(nodeDefault);
        }

    }, [nodeDefault]);
    let check = (flag) => {
        if (flag) {
            if (required && required.includes(propertyKey)&& !nodeDefault) {
                setErrorTitle(`字段不能为空`)
                setErrorState(true)
                return
            }
            if (minLength && nodeDefault.length < minLength) {
                setErrorTitle(`字段长度不能小于${minLength}个字符`)
                setErrorState(true)
                return
            }
            if (maxLength && nodeDefault.length > maxLength) {
                setErrorTitle(`字段长度不能大于${minLength}个字符`)
                setErrorState(true)
                return
            }
        }

    }
    return (
        <Form.Item className={classNames(isVisible ? styleName('hidden') : undefined)}
            label={
                <div className={styleName('label-title')}>
                    {required && required.includes(propertyKey)&& <span style={{ color: 'red', marginRight: '10px' }}>*</span>}
                    {value.title || propertyKey}   {description ? `( ${description} )` : ''}
                    {value?.isNew && <SelectType root={value} onChange={onChange} />}

                </div>
            }
        >
            {Array.isArray(value.enum) && (<>
                <Select value={innerValue} className={styleName('string-select')}
                    onChange={(value) => {
                        const newValue = value;
                        setInnerValue(newValue);
                        if (value.isRequired&& !newValue) {
                            setErrorTitle(`字段不能为空`)
                            setErrorState(true)
                            return
                        }
                        if (minLength && newValue.length < minLength) {
                            setErrorTitle(`字段长度不能小于${minLength}个字符`)
                            setErrorState(true)
                            return
                        }
                        if (maxLength && newValue.length > maxLength) {
                            setErrorTitle(`字段长度不能大于${minLength}个字符`)
                            setErrorState(true)
                            return
                        }
                        setErrorState(false)
                        setErrorTitle(null)
                    }}
                    onBlur={() => {
                        value.default = innerValue;
                        value.isError = true
                        onChange && onChange(value);
                    }}
                >
                    {value.enum.map(item => <Select.Option key={item} value={item}>{item}</Select.Option>)}
                </Select>  {errorTitle && <div style={{ color: 'red', float: 'left', marginTop: '10px' }}>{errorTitle}</div>}
            </>)}
            {!Array.isArray(value.enum) && (<>


                <Input
                    value={innerValue}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setInnerValue(newValue);
                        if (value.isRequired&& !newValue) {
                            setErrorTitle(`字段不能为空`)
                            setErrorState(true)
                            return
                        }
                        if (minLength && newValue.length < minLength) {
                            setErrorTitle(`字段长度不能小于${minLength}个字符`)
                            setErrorState(true)
                            return
                        }
                        if (maxLength && newValue.length > maxLength) {
                            setErrorTitle(`字段长度不能大于${minLength}个字符`)
                            setErrorState(true)
                            return
                        }
                        setErrorState(false)
                        setErrorTitle(null)
                    }}
                    onBlur={() => {
                        value.default = innerValue;
                        value.isError = true
                        onChange && onChange(value);
                    }}
                />

                {errorTitle && <div style={{ color: 'red', float: 'left', marginTop: '10px' }}>{errorTitle}</div>}
            </>)}

        </Form.Item>

    );
};


FormInput.propTypes = {
    propertyKey: PropTypes.string,
    value: PropTypes.object,
    onChange: () => { },
    isNew: PropTypes.bool,
    isVisible: PropTypes.bool,
};

FormInput.defaulyProps = {
    propertyKey: "",
    value: {},
    onChange: () => { },
    isNew: false,
    isVisible: true,
};

export default FormInput;