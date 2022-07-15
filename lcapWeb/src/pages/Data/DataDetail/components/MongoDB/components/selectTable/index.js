/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from "react";
import { Input, Select, Popconfirm, Icon, Table, Collapse, Tooltip } from "@chaoswise/ui";
import { observer, toJS } from "@chaoswise/cw-mobx";

const { Option } = Select;
const Panel = Collapse.Panel;
import _ from "lodash";

const ProjectDetail = observer(({ tableData = [], columnsTitle, title, setActiveContent }) => {
    const [inputBodyType, setInputBodyType] = useState(''); // 输入框存在flag
    const [bodyInputTitle, setBodyInputTitle] = useState(''); // 请求体输入框内容
    let parseTableData = toJS(tableData);
    const changeOneName = (recode) => {
        let oldArr = _.cloneDeep([...parseTableData]);
        let index = oldArr.findIndex(item => item.key === recode.key);
        let endItem = oldArr[index];
        if (bodyInputTitle) {
            endItem.name = bodyInputTitle;
            setBodyInputTitle('');
            if (endItem.default && endItem.name) {
                setInputBodyType(null);
                endItem.state = false;
                endItem.key = Math.random();
                if (oldArr[oldArr.length - 1].state) {
                    setActiveContent(oldArr);
                } else {
                    setActiveContent([...oldArr, {
                        key: Math.random(),
                        name: '',
                        state: true
                    }]);
                }

            } else {
                setActiveContent([...oldArr]);
            }
        } else {
            setActiveContent(oldArr);
            setInputBodyType(null);

        }
    };
    const getRowClass = (row, rowIndex) => {
        if (rowIndex === parseTableData.length - 1) {
            return 'my-cover';
        }

    };
    const deleteOne = (key) => {
        setActiveContent(parseTableData.filter(item => item.key !== key));

    };
    const NewColumns = [
        {
            title: columnsTitle[0],
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            render: (text, recode) => {
                if (recode.state) {
                    return (
                        <>
                            {inputBodyType != recode.key && <a style={{ color: text ? '#40a9ff' : 'gray' }} onClick={() => { setInputBodyType(recode.key); }}>{text || `添加${columnsTitle[0]}`}</a>}
                            {inputBodyType && inputBodyType === recode.key && <Input placeholder={`请输入${columnsTitle[0]}`}
                                style={{ height: 26, width: 130 }}
                                onChange={(e) => {
                                    setBodyInputTitle(e.target.value);
                                }}
                                defaultValue={text || ''}
                                onPressEnter={() => { changeOneName(recode); }}
                                onBlur={() => { changeOneName(recode); }} />}
                        </>
                    );
                } else {
                    return <a onClick={() => {
                            let oldArr = _.cloneDeep([...parseTableData]);
                            let index = oldArr.findIndex(item => item.key === recode.key);
                            oldArr[index].state = true;
                            setActiveContent(oldArr);
                            setInputBodyType(recode.key);
                    }}>{text}</a>;
                }
            }
        },
        {
            title: columnsTitle[1],
            dataIndex: 'default',
            width: '40%',
            key: 'default',
            render: (text, recode) => {
                return (
                    <>
                        <Select defaultValue={text} style={{ width: 120 }} onChange={(val) => {
                            let oldArr = _.cloneDeep([...parseTableData]);
                            let index = oldArr.findIndex(item => item.key === recode.key);
                            let endItem = oldArr[index];
                            endItem.default = val;
                            if (endItem.name) {
                                endItem.state = false;
                            }
                            if (oldArr[oldArr.length - 1].state) {
                                setActiveContent(oldArr);
                            } else {
                                setActiveContent([...oldArr, {
                                    key: Math.random(),
                                    name: '',
                                    state: true
                                }]);
                            }

                        }}>
                            <Option value="varchar">文本</Option>
                            {/* <Option value="boolean">布尔值</Option>
                            <Option value="int" >整形</Option>
                            <Option value="long" >长整形</Option>
                            <Option value="double" >浮点数</Option>
                            <Option value="date" >日期</Option>
                            <Option value="time" >时间</Option>
                            <Option value="array" >列表</Option>
                            <Option value="map" >json</Option> */}
                        </Select>
                    </>
                );
            }
        },
        { title: "", dataIndex: "", key: "expand" },
        {
            title: '',
            key: 'action',
            render: (text, record) => {
                if (!record.state) {
                    return (
                        <Popconfirm
                            title="确定要删除吗？"
                            onConfirm={() => { deleteOne(record.key, true); }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Tooltip title="删除">
                                <Icon style={{ fontSize: '16px', cursor: 'pointer', color: 'gray', marginTop: '5px' }} type="minus-circle" />
                            </Tooltip>
                        </Popconfirm>
                    );
                }
            }
        }
    ];
    return (
        <div style={{ marginBottom: '20px' }} >
            <Collapse
                defaultActiveKey={parseTableData && parseTableData.length > 0 ? ['1'] : null}
                bordered={false}
                className="site-collapse-custom-collapse"
            >
                <Panel header={title} key="1" style={{ border: 'none' }}>
                    <Table tableLayout='fixed' style={{ marginTop: '20px' }} columns={NewColumns} dataSource={parseTableData} pagination={false} rowKey='key'
                        expandIconColumnIndex={2}
                        expandIconAsCell={false}
                        rowClassName={getRowClass}
                    />
                </Panel>
            </Collapse>

        </div>
    );
});
export default ProjectDetail;
