import React from "react";
import * as PropTypes from "prop-types";
import { Table, Button, Icon ,Popconfirm} from '@chaoswise/ui';
import _ from 'lodash';
import { getComponent } from "../../../utils/component";
import styleName from "../../../../utils/styleName";
import { schemaJsonToJson } from "../../../utils";

function ObjectContent(props) {
    let { value, onChange } = props;
   
    const defaultData = (value.default || []).map((p,index) => {
        let newP = _.clone(p);
        if(Object.prototype.toString.call(newP) === '[object Object]'){
            newP._id = Math.ceil(Math.random() * 10000) + new Date().getTime();
        }else{
            newP={
                [value['items']['title']+(index+1)]:p,
                _id : Math.ceil(Math.random() * 10000) + new Date().getTime()
            }
        }
        
        return newP;
    });
    const properties = value.items ? value.items.properties || {} : {}
    const columns = Object.keys(properties).map((key) => {
        return {
            title: key,
            dataIndex: key,
            key: key,
            render: (text, record, index) => {
                const property = properties[key];
                const Component = getComponent(property);

                return (
                    <Component
                        propertyKey={key} value={{ ..._.clone(property), default: text }}  onChange={(newValue) => {
                            defaultData[index][key] = newValue.default;
                            value.default = defaultData.map((p) => {
                                let newP = _.clone(p);
                                if (Object.prototype.hasOwnProperty.call(newP, "_id")) {
                                    delete newP._id;
                                }
                                return newP;
                            });;
                            onChange && onChange(value);
                        }} />
                );
            },
        };
    }).concat([{
        title: '',
        key: "action",
        width: "240px",
        render: (text, record, index) => {
            return (
                <div className={styleName("array-property-object-content-table-action")}>
                    <Popconfirm
                        title="确定要删除当前数据吗?"
                        onConfirm={() => {
                                value.default = value.default.filter((d, i) => i !== index);
                                onChange && onChange(value);
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Icon type="delete" />
                    </Popconfirm>
                    {defaultData.length > 1 && index !== 0 && <Icon style={{ marginLeft: '10px' }} onClick={() => {
                        let newDefault = value.default.filter((d, i) => i !== index);
                        newDefault.splice(index - 1, 0, value.default[index]);
                        value.default = newDefault;
                        onChange && onChange(value);
                    }} type="arrow-up" />}
                    {defaultData.length > 1 && index !== defaultData.length - 1 && <Icon style={{ marginLeft: '10px' }} type="arrow-down" onClick={() => {
                        let newDefault = value.default.filter((d, i) => i !== index);
                        newDefault.splice(index + 1, 0, value.default[index]);
                        value.default = newDefault;
                        onChange && onChange(value);
                    }} />}
                </div>
            );
        }
    }]);


    return (
        <React.Fragment>
            <Table columns={columns} className={styleName("array-property-object-content-table")} rowKey={(record) => record._id} dataSource={defaultData} pagination={false} />
            <div className={styleName("array-property-content-action")}>
                <Button type="primary" onClick={() => {
                    value.default = [...(value.default || []), _.clone(schemaJsonToJson("", {
                        type: "object",
                        properties: properties
                    }))];
                    onChange && onChange(value);
                }}><Icon type="plus" />新增</Button>
                {defaultData.length > 1 &&
                 <Popconfirm
                 title="确定要删除最后一条数据吗?"
                 onConfirm={() => {
                    value.default = (value.default || []).slice(0, value.default.length - 1);
                    onChange && onChange(value);
                 }}
                 okText="确认"
                 cancelText="取消"
             >
                <Button ><Icon type="delete" />删除最后</Button> </Popconfirm>}
                {defaultData.length > 1 &&
                  <Popconfirm
                  title="确定要清空数组吗?"
                  onConfirm={() => {
                    value.default = [];
                    onChange && onChange(value);
                  }}
                  okText="确认"
                  cancelText="取消"
              >
                <Button ><Icon type="minus" />清空</Button></Popconfirm>}
            </div>
        </React.Fragment>
    );
}

ObjectContent.propTypes = {
    propertyKey: PropTypes.string,
    value: PropTypes.object,
    onChange: () => { },
    isNew: PropTypes.bool,
    isVisible: PropTypes.bool,
};

ObjectContent.defaulyProps = {
    propertyKey: "",
    value: {},
    onChange: () => { },
    isNew: false,
    isVisible: true,
};

export default ObjectContent;
