
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { observer, toJS } from "@chaoswise/cw-mobx";
import _ from "lodash";
import { Button, message, Collapse, Icon, Tooltip } from "@chaoswise/ui";
import jsoneditor from 'jsoneditor';
import { successCode } from "@/config/global";
import JSONPath from 'JSONPath';
import { JSONEditor } from "@json-editor/json-editor";
import store from './model';
const Panel = Collapse.Panel;
import AddTableRow from '../EditRoleModal';
import TreeStore from '../handleMenu/model';
import TablePreview from './components/TablePreview';
import DataTable from '../../../components/DataTable';
import './bootstrap.less';
const HandleMenu = observer(({ activeContent, headerArr, resetData
    , paramsArr, setHeader, setParams, tableId
}) => {
    const editShowContainer = useRef(); //jsonshow实例
    const editContainer = useRef(); //jsonedit实例
    const hiddenEditor = useRef(); //jsonedit实例
    const showFirst = useRef(); //jsonshow实例
    const hiddenRef = useRef(); //jsonshow实例
    const editFirst = useRef(); //jsonedit实例

    const [queryLoading, setQueryLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [jsonOrText, setJsonOrText] = useState(true);
    const { addGetTreeList, editName } = TreeStore;
    const { httpDataLink, modalVisiable, changeOutside, setModalVisiable, addTableColumns, seTaddTableData, addTableData, lookDataJson, setAddTableColums, endTableData, setEndTableData } = store;

    const onTableSave = (value) => {

        let { name, resultValue, type, dataExtraction } = value;
        let maxLength = Math.max.apply(null, resultValue.map(item => String(item).length));
        setEndTableData([
            ...endTableData,
            {
                fieldName: name,
                fieldType: type,
                jsonpath: dataExtraction,
                sort: endTableData.length + 1
            }
        ]);
        let arr = [];
        let oldTableData = _.cloneDeep(toJS(addTableData));
        for (const i in resultValue) {
            arr.push({
                [name]: resultValue[i]
            });
        }
        if (addTableData.length === 0) {
            setAddTableColums([{
                title: name,
                dataIndex: name,
                width: maxLength < 7 ? 100 : 220,
                render: (text) => {
                    if (text.length < 7) {
                        return <Tooltip title={text}>
                            <span className='Mintable'>{text}</span>
                        </Tooltip>;
                    } else {
                        return <Tooltip title={text}>
                            <span className='MaxTable'>{text}</span>
                        </Tooltip>;
                    }
                }
            }]);
            seTaddTableData(arr);
        } else {
            let arr1 = [];
            for (const i in resultValue) {
                arr1.push({
                    [name]: resultValue[i]
                });
            }
            let oldArr = _.cloneDeep(toJS(addTableColumns));
            oldArr.push({
                title: name,
                dataIndex: name,
                width: maxLength < 7 ? 100 : 220,
                render: (text) => {
                    if (text.length < 7) {
                        return <Tooltip title={text}>
                            <span className='Mintable'>{text}</span>
                        </Tooltip>;
                    } else {
                        return <Tooltip title={text}>
                            <span className='MaxTable'>{text}</span>
                        </Tooltip>;
                    }
                },
            });
            setAddTableColums(oldArr);
            let new11 = oldTableData.map((item, index) => {
                return {
                    ...item,
                    [name]: resultValue[index]
                };
            });
            seTaddTableData(new11);
        }
    };
    let normalColumns =
        addTableColumns
            ? addTableColumns
            : [];
    const endcolumns = [
        ...normalColumns,
    ];
    let editorOptions = {
        theme: 'bootstrap4',
        schema: {
            "type": "object",
            "format": "categories"
        }
    };
    let editorShowOptions = {
        theme: 'bootstrap4',
        schema: {
            "type": "string",
            "format": "json"
        }
    };
    let editorOptionsText = {
        theme: 'bootstrap4',
        schema: {
            "type": "string",
            "format": "textarea"
        }
    };
    //初始话默认清除
    useEffect(() => {
        return () => {
            setEndTableData([]);
            setAddTableColums([]);
            seTaddTableData([]);
            setModalVisiable(false);
        };
    }, []);
    useEffect(() => {
        if (activeContent) {
            setJsonOrText(activeContent.requestBody.type == 'json' ? true : false);
            setEndTableData([]);
            let { exampleData = {} } = activeContent;
            if (!showFirst.current) {
                showFirst.current = (new JSONEditor(editShowContainer.current, editorShowOptions));
            } else {
                showFirst.current.setValue('');
            }

            if (editFirst.current) {
                editFirst.current.destroy();
            }
            if (hiddenRef.current) {
                hiddenRef.current.destroy();
            }
            // //判断是text还是json
            if (activeContent.requestBody && activeContent.requestBody?.value) {
                if (activeContent.requestBody?.type == 'json') {
                    let parseScreen = JSON.parse(activeContent.requestBody?.value);
                    hiddenRef.current = new JSONEditor(hiddenEditor.current, {
                        theme: 'bootstrap4',
                        schema: parseScreen
                    });

                    editFirst.current = new JSONEditor(editContainer.current, {
                        show_errors: 'never',
                        theme: 'bootstrap4',
                        schema: activeContent.requestBody && activeContent.requestBody?.value ? JSON.parse(activeContent.requestBody?.value) : editorOptions
                    });
                    if (editFirst.current) {
                        editFirst.current.on('ready', () => {
                            editFirst.current.setValue(hiddenRef.current.getValue() || parseScreen);
                        });
                       
                    }

                } else {
                    editFirst.current = new JSONEditor(editContainer.current, editorOptionsText);
                    editFirst.current.on('ready', () => {
                        editFirst.current.setValue(activeContent.requestBody.value);
                    });
                }

            }


            if (exampleData && exampleData.clomes) {
                setAddTableColums(exampleData.clomes);
            } else {
                setAddTableColums([]);
            }
            if (exampleData && exampleData.data) {
                seTaddTableData(exampleData.data);
            } else {
                seTaddTableData([]);
            }
        }
    }, [activeContent]);
    // //修改数据表
    const addOneDatatable = () => {
        if (addTableColumns.length == 0) {
            message.error('请设置定义字段信息!');
            return;
        }
        let conentData = resetData;
        if (resetData.datasourceId && editName) {
            let newarr;
            if (activeContent.fields.length > 0) {
                newarr = [...toJS(activeContent.fields), ...endTableData];
            } else {
                newarr = endTableData;
            }
            let newFields = newarr.map((item, index) => {
                return {
                    ...item,
                    sort: index
                };
            });
            setSaveLoading(true);
            changeOutside({
                datasourceId: resetData.datasourceId,
                tableName: editName,
                tableId,
                tableMeta: {
                    url: conentData.url,
                    method: conentData.method,
                    params: paramsArr,
                    header: headerArr,
                    requestBody: {
                        type: activeContent.requestBody.type,
                        value: activeContent.requestBody.value ? JSON.stringify(editFirst.current.getValue()) : null,
                    },
                    fields: newFields,
                    exampleData: {
                        clomes: addTableColumns,
                        data: addTableData
                    }
                }

            }, (res) => {
                setSaveLoading(false);
                if (res.code == successCode) {
                    message.success('修改数据表成功!');
                    addGetTreeList({
                        datasourceId: resetData.datasourceId
                    }, () => { }, true);
                } else {
                    message.error(res.msg || '修改数据表失败,请重试!');
                }

            }).catch(res => {
                setSaveLoading(false);
            });
        }
    };

    const Tosearch = () => {
        let arrErrorFlag = false;
        let jsHeaderArr = toJS(headerArr);
        let jsParamsArr = toJS(paramsArr);
        if (jsHeaderArr.length > 0) {
            for (let i = 0; i < jsHeaderArr.length; i++) {
                if (jsHeaderArr[i].required && !jsHeaderArr[i].default) {
                    arrErrorFlag = true;
                    message.error(`请填写header数组中${jsHeaderArr.name}的必填参数,不能为空`);
                    return;
                }
            }
        }
        if (jsParamsArr.length > 0) {
            for (let i = 0; i < jsParamsArr.length; i++) {
                if (jsParamsArr[i].required && !jsParamsArr[i].default) {
                    arrErrorFlag = true;
                    message.error(`请填写请求数组中${jsParamsArr[i].name}的必填参数,不能为空!`);
                    return;
                }
            }
        }
        if (arrErrorFlag) {
            return;
        }
        let errors = [];
        if (editFirst.current && activeContent.requestBody?.value) {
            errors = editFirst.current.validate();
        }
        if (errors.length == 0) {
            let conentData = resetData;
            let requestBody = null;
            if (editFirst && activeContent.requestBody?.value) {
                requestBody = {
                    type: activeContent.requestBody.type,
                    value: editFirst.current.getValue()
                };
            }
            let obj = {
                schemaType: 'HTTP',
                connectData: {
                    url: conentData.url,
                    method: conentData.method,
                    params: paramsArr,
                    header: headerArr,
                    requestBody
                }
            };
            setQueryLoading(true);
            httpDataLink(obj, (res) => {
                setQueryLoading(false);
                if (res.code == successCode) {
                    let formateStr = JSON.stringify(res.data, null, 2);
                    showFirst.current.setValue(formateStr);
                    const Fields = toJS(activeContent.fields);
                    if (Fields.length > 0) {
                        //执行查询后同步更新底部table的值
                        const QueryData = res.data;
                        let newArr = _.cloneDeep(toJS(addTableData));
                        let obj = {};
                        Fields.map(item => {
                            obj[item.fieldName] = (
                                JSONPath({
                                    json: toJS(QueryData),
                                    path: item.jsonpath
                                })
                            );
                        });

                        newArr.map((item, index) => {
                            for (const i in item) {
                                if (i !== 'key') {
                                    if (obj[i]) {
                                        item[i] = obj[i][index];
                                    }

                                }
                            }
                        });
                        seTaddTableData(newArr);
                    }

                } else {
                    message.error(res.msg || '执行查询失败,请重新查询!');
                }

            }).catch(res => {
                setQueryLoading(false);
            });
        } else {
            message.error('请求体中【' + `${errors[0].path.split('.').pop()}` + '】不符合该数据源JSONSchema中的规范,请修改后再进行查询!');
        }

    };
    return (
        <div className={styles.httpContainer}>
            <DataTable title='Header请求头' columnsTitle={['Header名', 'Header值']}
                canChangeValue={true}
                tableData={headerArr}
                setActiveContent={setHeader}
            ></DataTable>

            <DataTable title='请求参数' columnsTitle={['请求参数', '参数值']} canChangeValue={true}
                tableData={paramsArr}
                setActiveContent={setParams}
            ></DataTable>
            {activeContent && activeContent.requestBody &&
                <div className={activeContent && jsonOrText ? 'jsontPanel' : 'textPanel'}>
                    <Collapse
                        defaultActiveKey={['1']}
                        bordered={false}
                        className="site-collapse-custom-collapse"
                    >
                        <Panel header='请求体' key="1" style={{ border: 'none' }} >
                            <div ref={editContainer} ></div>
                        </Panel>
                    </Collapse>
                </div>
            }
            <Button onClick={() => { Tosearch(); }} loading={queryLoading} className={styles.bluebtn}>执行查询</Button>
            {/* 底部 */}
            <Collapse
                defaultActiveKey={['1']}
                bordered={false}
                className="site-collapse-custom-collapse"
            >
                <Panel header='结果预览' key="1" style={{ border: 'none' }}>
                    <div ref={editShowContainer} className='showEdit' ></div>
                </Panel>
            </Collapse>

            {/* 创建表格 */}
            <Collapse
                defaultActiveKey={['1']}
                bordered={false}
                className="site-collapse-custom-collapse"
            >
                <Panel header='定义字段' key="1" style={{ border: 'none' }}>
                    <TablePreview data={toJS(addTableData)} columns={endcolumns} />
                    <div className={styles.btnContainer} onClick={() => {
                        if (!showFirst.current.getValue()) {
                            message.error('请先执行查询后再新增表格！');
                            return;
                        } else {
                            setModalVisiable(true);
                        }
                    }}>
                        <Icon type="plus" style={{ marginRight: '5px' }} />
                        <span>添加</span>
                    </div>
                </Panel>
            </Collapse>
            {
                modalVisiable && <AddTableRow
                    columnsArr={addTableColumns}
                    onCancel={setModalVisiable} onSave={onTableSave} lookDataJson={lookDataJson} />

            }
            <Button className={styles.bluebtn} style={{ margin: '10px 0 0' }} onClick={addOneDatatable} loading={saveLoading}>保存</Button>

            <div ref={hiddenEditor} style={{ display: 'none' }}></div>

        </div>
    );

});

export default HandleMenu;