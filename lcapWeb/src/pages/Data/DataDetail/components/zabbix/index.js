
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { useIntl } from "react-intl";
import { observer, toJS } from "@chaoswise/cw-mobx";
import { successCode } from "@/config/global";
import { Collapse, Form, Radio, Select, Button, Modal, message, CWTree, Icon, Tooltip, Input, Skeleton, Row, Col } from "@chaoswise/ui";
const { Option } = Select;
const Panel = Collapse.Panel;
import store from './model'
import _ from "lodash";
import NOMAL from './components/SelectIndicators'
import API from './components/Api'
import ApiStore from './components/Api/model'
const EditComponent = observer(({ form, activeContent, checkIndex, onChange }) => {
    const intl = useIntl();
    const { setRequestValue } = ApiStore
    const { getFieldDecorator, getFieldValue, validateFields, setFieldsValue, getFieldsValue, resetFields } = form;
    const { getSearchItem, searchItem, setName, monitorVisiable, setMonitorVisiable,
        setRadioCheckId, radioCheckId, changeOutside, query, exampleData, fields, setTableData, getApiSelectData,
        groupList, methodList } = store
    const [nameArr, setNameArr] = useState(null) //radio选中的id
    const [apiSelect, setApiSelect] = useState(null) //api组件需要的requestbody
    useEffect(() => {
        if (activeContent && activeContent.tableMeta) {
            if (activeContent.tableMeta?.exampleData && activeContent.tableMeta?.fields) {
                setTableData(activeContent.tableMeta.exampleData, activeContent.tableMeta.fields)
                if (!activeContent.tableMeta?.querySource) {
                    setFieldsValue({
                        itemId: activeContent.tableMeta?.itemName.split('/')[1],
                        querySource: activeContent.tableMeta.querySource,
                        queryType: activeContent.tableMeta.queryType
                    })
                    setRadioCheckId(activeContent.tableMeta.itemName)
                } else {
                    setFieldsValue({
                        templateGroup: activeContent.tableMeta?.templateGroup,
                        querySource: activeContent.tableMeta.querySource,
                        templateMethod: activeContent.tableMeta.templateMethod
                    })
                    getApiSelectData(activeContent.datasourceId, (res) => {
                        let arr = toJS(res[activeContent.tableMeta?.templateGroup]).find(item => item.method === activeContent.tableMeta.templateMethod)
                        setApiSelect(arr)
                    })

                }
            } else {
                setApiSelect(null)
                setTableData([], [])
                resetFields()
                setNameArr([])
            }
        }

    }, [activeContent])
    const onRadioChange = (e) => {
        setRadioCheckId(e.target.value)
    }
    const getExpendArr = (id, list) => {
        let checkIdArr = []
        list.map(item => {
            item.hosts.map(item1 => {
                item1.applications.map(item2 => {
                    item2.items.map(item3 => {
                        if (item3.itemid === id) {
                            checkIdArr.push(item.groupid + '-' + 1, item1.hostid + '-' + 2, item2.applicationid + '-' + 3)
                        }
                    })
                })
            })
        })
        setNameArr(checkIdArr)
    }
    const onPressEnter = (e) => {
        setName(e.target.value)
        setRadioCheckId(null)
        getSearchItem(activeContent.datasourceId)
        let checkIdArr = []
        searchItem.map(item => {
            checkIdArr.push(item.groupid + '-' + 1)
            item.hosts.map(item1 => {
                checkIdArr.push(item1.hostid + '-' + 2)
                item1.applications.map(item2 => {
                    checkIdArr.push(item2.applicationid + '-' + 3)
                })
            })
        })
        setNameArr(checkIdArr)
    }
    const onExpand = (expandedKeys) => {
        setNameArr(expandedKeys)
    }
    //连接测试
    const onQuery = () => {
        validateFields(['querySource', 'itemId', 'queryType'], async (err, values) => {
            if (!err) {
                query({
                    datasourceId: activeContent.datasourceId,
                    querySource: values.querySource,
                    itemId: radioCheckId && radioCheckId.split('/')[0],
                    itemName: radioCheckId,
                    valueType: radioCheckId && radioCheckId.split('/')[2],
                    queryType: values.queryType
                })
            }
        });
    }
    //保存
    const onSave = () => {
        validateFields(['querySource', 'itemId', 'queryType'], async (err, values) => {
            if (!err) {
                if (!fields || fields.length == 0) {
                    message.error('请连接测试后再进行保存!')
                    return
                }
                changeOutside({
                    datasourceId: activeContent.datasourceId,
                    tableId: activeContent.tableId,
                    tableMeta: {
                        ...activeContent.tableMeta,
                        querySource: values.querySource,
                        itemId: radioCheckId && radioCheckId.split('/')[0],
                        itemName: radioCheckId,
                        valueType: radioCheckId && radioCheckId.split('/')[2],
                        queryType: values.queryType,
                        exampleData,
                        fields
                    }
                }, (res) => {
                    if (res.code === successCode) {
                        message.success('保存成功');
                        onChange(activeContent.tableName)
                    } else {
                        message.error(res.msg || '保存失败,请重试!');
                    }
                })
            }
        });
    }
    //api的连接测试
    const onApiQuery = (bodyValue, callback) => {
        validateFields(['querySource', 'templateGroup', 'templateMethod'], async (err, values) => {
            if (!err) {
                query({
                    datasourceId: activeContent.datasourceId,
                    querySource: values.querySource,
                    templateGroup: values.templateGroup,
                    templateMethod: values.templateMethod,
                    requestBody: bodyValue
                }, (res) => {
                    callback && callback(res)
                })
            }
        });
    }
    //api的保存
    const onApiSave = (callback) => {
        validateFields(['querySource', 'templateGroup', 'templateMethod'], async (err, values) => {
            if (!err) {
                callback && callback({
                    templateGroup: values.templateGroup,
                    templateMethod: values.templateMethod
                })
            }
        });
    }
    return (
        <div className={styles.zabbixContainer}>
            <Collapse
                defaultActiveKey={['1']}
                bordered={false}
            >
                <Panel header='选择监控项' key='1' style={{ border: 'none' }}>
                    <Form
                        initialvalues={activeContent?.tableMeta || {}}
                    >
                        <Form.Item label="选择方式" >
                            {getFieldDecorator("querySource", {
                                initialValue: activeContent?.tableMeta?.querySource || 0,
                                rules: [
                                    {
                                        required: true,
                                        message:
                                            intl.formatMessage({
                                                id: "common.pleaseSelect",
                                                defaultValue: "请选择",
                                            }) + "选择方式",
                                    }
                                ],
                            })(
                                <Radio.Group onChange={e => {
                                    if (e.target.value) {
                                        getApiSelectData(activeContent?.datasourceId)
                                    }
                                }}>
                                    <Radio value={0} disabled={activeContent?.tableMeta?.querySource == 1}>选择指标</Radio>
                                    <Radio value={1} disabled={activeContent?.tableMeta?.querySource == 0}>调用API</Radio>
                                </Radio.Group>
                            )}{getFieldValue('querySource') == 0 ? <div className={styles.titleColor}>基于zabbix中的数据关系,通过逐级选择机组，主机，应用,定位到要选择的监控项</div> :
                                <div className={styles.titleColor}>调用zabbix提供的API接口,连接到监控项,可做相关设置</div>}

                        </Form.Item>
                    </Form>
                    {
                        <Form
                            style={{ display: getFieldValue('querySource') == 0 ? 'block' : 'none' }}
                            initialvalues={activeContent?.tableMeta || {}}
                        >
                            <Form.Item label="监控项" >
                                {getFieldDecorator("itemId", {
                                    initialValue: activeContent?.tableMeta?.itemId,
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                intl.formatMessage({
                                                    id: "common.pleaseSelect",
                                                    defaultValue: "请选择",
                                                }) + "监控项",
                                        }
                                    ],
                                })(
                                    <Input style={{ width: '60%' }} className={styles.InputStyle} placeholder="点击选择监控项"
                                        onClick={() => {
                                            getSearchItem(activeContent.datasourceId, (res) => {
                                                if (activeContent.tableMeta?.itemId) {
                                                    getExpendArr(activeContent.tableMeta.itemId, res)
                                                }
                                            })
                                            setMonitorVisiable(true)
                                        }}
                                    ></Input>
                                )}
                            </Form.Item>
                            <Form.Item label="数据类型" >
                                {getFieldDecorator("queryType", {
                                    initialValue: activeContent?.tableMeta?.queryType || 0,
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                intl.formatMessage({
                                                    id: "common.pleaseSelect",
                                                    defaultValue: "请选择",
                                                }) + "数据类型",
                                        }
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value={0}>历史数据</Radio>
                                        <Radio value={1}>趋势数据</Radio>
                                    </Radio.Group>
                                )}{
                                    getFieldValue('queryType') == 0 ? <div className={styles.titleColor}>通过设置的时间间隔,获取到的实时监控数据,一般保存7天,可通过zabbix修改</div> :
                                        <div className={styles.titleColor}>以小时为维度的趋势数据,统计单位时间内的最大值、最小值及平均值,一般保存365天,可通过zabbix修改</div>
                                }
                            </Form.Item>
                            <Button onClick={onQuery}>连接测试</Button>
                            <Button type="primary" style={{ marginLeft: '15px' }}
                                onClick={onSave}
                            >保存</Button>
                        </Form>
                    }
                    {
                        <Form
                            initialvalues={activeContent?.tableMeta || {}}
                            style={{ display: getFieldValue('querySource') == 1 ? 'block' : 'none' }}>
                            <Row gutter={[120, 0]}>
                                <Col span={11}>
                                    <Form.Item label="选择api" >
                                        {getFieldDecorator("templateGroup", {
                                            initialValue: activeContent?.tableMeta?.templateGroup,
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        intl.formatMessage({
                                                            id: "common.pleaseSelect",
                                                            defaultValue: "请选择",
                                                        }) + "分类",
                                                    validator: (rule, value) => {
                                                        if (!value) {
                                                            return Promise.reject('请选择分类');
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                }
                                            ],
                                        })(
                                            <Select
                                                style={{ width: '90%' }}
                                                placeholder="请选择分类"
                                                showArrow={true}
                                                onChange={(e) => {
                                                    setRequestValue(null)
                                                    if (e == 'custom') {
                                                        setFieldsValue({
                                                            templateMethod: 'custom'
                                                        })
                                                        let arr = toJS(methodList['custom']).find(item => item.method === e)
                                                        setApiSelect(arr)

                                                    } else {
                                                        setApiSelect(null)
                                                        setFieldsValue({
                                                            templateMethod: null
                                                        })
                                                    }
                                                }}
                                            >
                                                <Option value="custom">自定义API</Option>
                                                {
                                                    groupList.map(item => {
                                                        return <Option value={item}>{item}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>

                                </Col>
                                <Col span={10} className='rightContainer'>
                                    <Form.Item label="222" >
                                        {getFieldDecorator("templateMethod", {
                                            initialValue: activeContent?.tableMeta?.templateMethod,
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        intl.formatMessage({
                                                            id: "common.pleaseSelect",
                                                            defaultValue: "请选择",
                                                        }) + "api",
                                                }
                                            ],
                                        })(
                                            <Select style={{ width: '70%', marginLeft: '-30%' }} optionLabelProp="label"
                                                disabled={
                                                    getFieldValue('templateGroup') == 'custom'
                                                } placeholder="请选择api"
                                                onChange={e => {
                                                    setRequestValue(null)
                                                    let arr = toJS(methodList[getFieldValue('templateGroup')]).find(item => item.method === e)
                                                    setApiSelect(arr)
                                                }}
                                            >
                                                {
                                                    getFieldValue('templateGroup') && methodList[getFieldValue('templateGroup')] ? methodList[getFieldValue('templateGroup')].map(item => {
                                                        return <Option value={item.method} label={item.method}>
                                                            <div className={styles.tooltipContainer}>
                                                                {item.method}
                                                                {
                                                                    item.description && <Tooltip
                                                                        title={item.description}>
                                                                        <Icon type="question-circle" style={{ float: 'right', marginTop: '4px' }} />
                                                                    </Tooltip>
                                                                }
                                                            </div>
                                                        </Option>
                                                    }) : null
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>

                                </Col>
                            </Row>
                        </Form>
                    }
                </Panel>
            </Collapse>
            {/* 底部数据展示 */}
            {
                getFieldValue('querySource') == 0 ? <NOMAL
                    exampleData={exampleData}
                    fields={fields}
                /> : <API
                    checkIndex={checkIndex}
                    groupData={getFieldValue('templateGroup')}
                    onChange={onChange}
                    reqBody={apiSelect}
                    activeContent={activeContent}
                    onApiQuery={onApiQuery}
                    onSave={onApiSave}
                />
            }
            {
                monitorVisiable ? <Modal
                    title="选择监控项"
                    visible={true}
                    width={500}
                    onOk={() => {
                        if (!radioCheckId) {
                            message.error('请选择监控项!')
                            return
                        }
                        setFieldsValue({
                            itemId: radioCheckId && radioCheckId.split('/')[1]
                        })
                        setMonitorVisiable(false)
                    }}
                    onCancel={() => {
                        setMonitorVisiable(false)
                    }}
                >
                    <Input placeholder='请输入关键字' suffix={<Icon type="search" />}
                        onPressEnter={onPressEnter}
                    ></Input>
                    <div style={{ height: '400px', overflowY: 'auto', marginTop: '20px' }}>
                        <Radio.Group onChange={onRadioChange} value={radioCheckId} style={{ width: '100%' }}>
                            {
                                searchItem.length ? <div style={{ width: '420px' }} className='myTree'>
                                    <CWTree
                                        onExpand={onExpand}
                                        treeData={searchItem.map((v, k) => ({
                                            key: v.groupid + '-' + 1,
                                            title: v.name,
                                            range: 1,
                                            children: !!v.hosts ? v.hosts.map((v1, k1) => {
                                                return {
                                                    key: v1.hostid + '-' + 2,
                                                    title: v1.name,
                                                    range: 2,
                                                    children: !!v1.applications ? v1.applications.map((v2, k2) => {
                                                        return {
                                                            key: v2.applicationid + '-' + 3,
                                                            title: v2.name,
                                                            range: 3,
                                                            children: !!v2.items ? v2.items.map((v3, k3) => {
                                                                return {
                                                                    key: v3.itemid + '/' + v3.name + '/' + v3.value_type + '/',
                                                                    title: v3.name,
                                                                    range: 4,
                                                                    icon: <Radio value={v3.itemid + '/' + v3.name + '/' + v3.value_type + '/'}></Radio>
                                                                }
                                                            }) : []
                                                        }
                                                    }) : []
                                                }
                                            }) : []
                                        }))}
                                        expandedKeys={nameArr}
                                    />
                                </div> : <Skeleton active />
                            }
                        </Radio.Group>
                    </div>
                </Modal > : null
            }
        </div >
    );
});

export default Form.create({ name: 'editComponent' })(EditComponent);