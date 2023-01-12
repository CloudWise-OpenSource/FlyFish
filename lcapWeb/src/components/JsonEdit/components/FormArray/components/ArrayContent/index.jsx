import React from "react";
import * as PropTypes from "prop-types";
import { Button, Icon, Popconfirm } from '@chaoswise/ui';
import styleName from "../../../../utils/styleName";
import { getComponent } from "../../../utils/component";
import _ from 'lodash';

function ArrayContent(props) {
    let { value, onChange } = props;
    const items = (value.items || []).map((p) => {
        let newP = _.clone(p);
        newP._id = Math.ceil(Math.random() * 10000) + new Date().getTime();
        return newP;
    });
    return (
        <React.Fragment>
            <div className={styleName("array-property-content-items")}>
                {items.map((item, index) => {
                    const Component = getComponent(item);
                   
                    return (
                        <div key={item._id} className={styleName("array-property-content-item")}>
                            <Component
                                propertyKey={"item" + (index + 1)}
                                value={item}
                                isNew={true}
                                onChange={(newItem) => {
                                    value.items = value.items || [];
                                    value.items[index] = newItem;
                                    onChange && onChange(value);
                                }} />
                            <div className={styleName("array-property-object-content-item-action")}>
                                <Popconfirm
                                    title="确定要删除当前数据吗?"
                                    onConfirm={() => {
                                        value.items = value.items.filter((d, i) => i !== index);
                                        onChange && onChange(value);
                                    }}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button ><Icon type="delete" /></Button>
                                </Popconfirm>
                                {items.length > 1 && index !== 0 && <Button onClick={() => {
                                    let newItems = value.items.filter((d, i) => i !== index);
                                    newItems.splice(index - 1, 0, value.items[index]);
                                    value.items = newItems;
                                    onChange && onChange(value);
                                }}><Icon type="arrow-up" /></Button>}
                                {items.length > 1 && index !== items.length - 1 && <Button onClick={() => {
                                    let newItems = value.items.filter((d, i) => i !== index);
                                    newItems.splice(index + 1, 0, value.items[index]);
                                    value.items = newItems;
                                    onChange && onChange(value);
                                }}><Icon type="arrow-down" /></Button>}
                            </div>
                        </div>
                    );
                })}

            </div>
            <div className={styleName("array-property-content-action")}>
                <Button type="primary" onClick={() => {
                    value.items = [...(value.items || []), {
                        type: "string",
                        default: ''
                    }];
                    onChange && onChange(value);
                }}><Icon type="plus" />新增</Button>
                {items.length > 1 &&
                    <Popconfirm
                        title="确定要删除最后一条数据吗?"
                        onConfirm={() => {
                            value.items = (value.items || []).slice(0, value.items.length - 1);
                            onChange && onChange(value);
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button ><Icon type="delete" />删除末尾</Button> </Popconfirm>}
                {items.length > 1 &&
                    <Popconfirm
                        title="确定要清空数组吗?"
                        onConfirm={() => {
                            value.items = [];
                            onChange && onChange(value)
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button ><Icon type="minus" />清空</Button> </Popconfirm>}
            </div>
        </React.Fragment>
    );
}

ArrayContent.propTypes = {
    propertyKey: PropTypes.string,
    value: PropTypes.object,
    onChange: () => { },
    isNew: PropTypes.bool,
    isVisible: PropTypes.bool,
};

ArrayContent.defaulyProps = {
    propertyKey: "",
    value: {},
    onChange: () => { },
    isNew: false,
    isVisible: true,
};

export default ArrayContent;
