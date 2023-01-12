import React from "react";
import * as PropTypes from "prop-types";
import { Typography } from '@chaoswise/ui';
import Collapsed from "../custom/collapsed";
import SelectType from "../custom/selectType";
import styleName from "../../utils/styleName";
import ObjectContent from "./components/ObjectContent";
import ArrayContent from "./components/ArrayContent";

const { Title } = Typography;

function FormArray(props) {
    let { value, isNew, propertyKey,onChange } = props;
    if (value == null) {
        value = {
            type: "object",
            properties: {},
        };
    }

    const isArrayContent = Array.isArray(value.items)
    return (
        <Collapsed
            header={
                <div className={styleName("label-box")}>
                    <div key="title" className={styleName("label-title")}>
                        <Title level={4}>
                            {value.title || propertyKey || "root"}
                        </Title>
                        {value?.isNew && <SelectType root={value}  onChange={onChange}/>}
                    </div>
                </div>
            }
        >
            {!isArrayContent && <ObjectContent {...props} />}
            {isArrayContent && <ArrayContent {...props} />}
        </Collapsed>
    );
}

FormArray.propTypes = {
    propertyKey: PropTypes.string,
    value: PropTypes.object,
    onChange: () => {},
    isNew: PropTypes.bool,
    isVisible: PropTypes.bool,
};

FormArray.defaulyProps = {
    propertyKey: "",
    value: {},
    onChange: () => {},
    isNew: false,
    isVisible: true,
};

export default FormArray;
