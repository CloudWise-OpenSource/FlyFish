/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from "react";
import { Select, Table, Collapse } from "@chaoswise/ui";
import { observer, toJS } from "@chaoswise/cw-mobx";
const { Panel } = Collapse;

const { Option } = Select;
import _ from "lodash";

const ProjectDetail = observer(({ tableData = [], newTable, columnsTitle, title, setActiveContent, canChangeValue }) => {
  
    let [kwFlag, setKwFlag] = useState(false);
    let parseTableData = toJS(tableData);
    //请求体
    const changeDetail = (key, value, selectType) => {
        let oldArr = _.cloneDeep([...parseTableData]);
        let index = oldArr.findIndex(item => item.key == key);
        if (index !== -1) {
            if (selectType) {
                oldArr[index]['type'] = value;
            } else {
                oldArr[index]['required'] = value || false;
            }
        }
        setActiveContent(oldArr);
    };
    const columns = [
        {
            title: columnsTitle[0],
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (text, recode) => {
                return <span>{text}</span>;

            }
        },
        {
            title: columnsTitle[1],
            dataIndex: 'default',
            width: '30%',
            key: 'default',
            render: (text, recode) => {
                if (recode.state) {
                    return (
                        <>
                            <Select defaultValue={text} style={{ width: 120 }} onChange={(val) => {
                                let oldArr = _.cloneDeep([...parseTableData]);
                                let index = oldArr.findIndex(item => item.key === recode.key);
                                let endItem = oldArr[index];
                                endItem.default = val;
                                setActiveContent(oldArr);

                            }}>
                                <Option value=",">,</Option>
                                <Option value=":">:</Option>
                                <Option value=";" >;</Option>
                            </Select>
                        </>
                    );

                } else {
                    return (
                        <>
                            <Select defaultValue={text} style={{ width: 120 }} onChange={(val) => {
                                let oldArr = _.cloneDeep([...parseTableData]);
                                let index = oldArr.findIndex(item => item.key === recode.key);
                                let endItem = oldArr[index];
                                endItem.default = val;
                                setActiveContent(oldArr);
                            }}>
                                <Option value="raw">raw</Option>
                                <Option value="json">json</Option>
                            </Select>
                        </>
                    );
                }
            }
        },
        {
            title: '',
            key: 'action',
            render: (text, record) => {
                if (record.state) {
                    return <span>字段分隔符</span>;
                } else {
                    return <span>支持raw,json两种结构</span>;
                }


            }
        },
    ];
    return (
        <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            className="site-collapse-custom-collapse"
        >
            <Panel header={title} key="1" style={{ border: 'none' }}>
                <Table columns={columns} dataSource={parseTableData} pagination={false} rowKey='key' />
            </Panel>
        </Collapse>
    );
});
export default ProjectDetail;
