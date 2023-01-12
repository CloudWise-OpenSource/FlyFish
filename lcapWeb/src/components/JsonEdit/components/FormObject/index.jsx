import React from 'react';
import * as PropTypes from 'prop-types';
import { Typography } from '@chaoswise/ui';
import Collapsed from "../custom/collapsed";
import SelectType from "../custom/selectType";
import styleName from '../../utils/styleName';
import AddProperties from "./components/AddProperties";
import EditJsonPopover from "./components/EditJsonPopover";
import { getComponent } from "../utils/component";

const { Title } = Typography;
/**
 * 当类型为object时的组件渲染
 * json schema的属性包括：id, type, title, description, properties, required
 */

function FormObject(props) {
  let { value, onChange, isNew, propertyKey ,isCheck,setErrorState} = props;
  if (value == null) { 
    value = {
      "type": "object",
      properties: {}
    }
  }
  const propertyKeys = Object.keys(value.properties || {});
  return (
    <Collapsed header={<div className={styleName('label-box')}>
      <div key="title" className={styleName('label-title')}>
        <Title level={4}>{value.title || propertyKey || "root"}</Title>
        {value?.isNew && <SelectType root={value} onChange={onChange}/>}
      </div>
      <div>
        <EditJsonPopover propertyKey={propertyKey} value={value} onChange={(val) => { 
          onChange && onChange(val)
        }} />
        <AddProperties value={value} onChange={(val) => {
          onChange && onChange(val)
        }} />
      </div>
    </div>}>
      {propertyKeys.map(propertyKey => { 
        const property = value.properties[propertyKey];
        const Component = getComponent(property);
        return <Component key={propertyKey} propertyKey={propertyKey} value={property} isCheck={isCheck}
        setErrorState={setErrorState}
        required={value.required||[]} onChange={(newValue) => {
          value.properties = value.properties || {};
          value.properties[propertyKey] = newValue;
          onChange && onChange({ ...value });
        }} />;
      })}
    </Collapsed >
  );
}

FormObject.propTypes = {
  propertyKey: PropTypes.string,
  value: PropTypes.object,
  onChange: () => { },
  isNew: PropTypes.bool,
  isVisible: PropTypes.bool,
};

FormObject.defaulyProps = {
  propertyKey: "",
  value: {},
  onChange: () => { },
  isNew: false,
  isVisible: true,
};


export default FormObject