import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { observer, toJS } from "@chaoswise/cw-mobx";
import _ from "lodash";
import { Button, message, Collapse, Icon, Tooltip, Table, Popconfirm, Input } from "@chaoswise/ui";
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
import myeditorStore from '@/components/JsonEdit/components/store'
import MYJSONEditor from '@/components/JsonEdit';
const HandleMenu = observer(({ activeContent, headerArr, resetData
  , paramsArr, setHeader, setParams, tableId
}) => {
  const [requestBodyTypeiIsJson, setRequestBodyTypeIsJson] = useState(false)
  const editShowContainer = useRef(); //jsonshow实例
  // const editContainer = useRef(); //jsonedit实例
  const hiddenEditor = useRef(); //jsonedit实例
  const showFirst = useRef(); //jsonshow实例
  const hiddenRef = useRef(); //jsonshow实例
  const editFirst = useRef(); //jsonedit实例
  const myeditor = useRef();//editor实力
  const [changeColums, setChangeColums] = useState({}) //编辑的表头
  // const [isCheck, setIsCheck] = useState(false);//自己的jsoneditor进行校验
  const [queryLoading, setQueryLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [jsonOrText, setJsonOrText] = useState(true);
  const { addGetTreeList, editName } = TreeStore;
  const [textAreaValue, setTextAreaValue] = useState('');
  const { httpDataLink, changeOutside,
    setColumnsData, columnsData, dataColumns, dataColumnsData, setDataColumnsData, setDataColumns,
    setAddModalVisiable, addModalVisiable,
    lookDataJson } = store;
  //过滤数组中无用的空数据
  const distinctArrObj = (arr) => {
    var MyShow = (typeof arr != "object") ? [arr] : arr
    for (let i = 0; i < MyShow.length; i++) {
      if (MyShow[i] == null || MyShow[i] == "" || JSON.stringify(MyShow[i]) == "{}") {
        MyShow.splice(i, 1);
        i = i - 1;
      }
    }
    return MyShow;
  }
  const columns = [
    {
      title: '字段类型',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: '25%'

    },
    {
      title: '类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: '20%',
      render: text => {
        switch (text) {
          case 'String':
            return '文本'
          case 'Int':
            return '整数'
          case 'Double':
            return '浮点数'
          case 'Boolean':
            return '布尔值'
          case 'Long':
            return '长整型'
        }
      },
    }, {
      title: '数据抽取',
      dataIndex: 'jsonpath',
      key: 'jsonpath',
      render: (text) => (
        <Tooltip title={text || ''} placement="topLeft">
          <span className="TableTopTitle" style={{ width: '100%' }}>{text || ''}</span>
        </Tooltip>
      ),
    }
  ]
  let newClomus = [
    ...columns,
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (text, record, index) => (
        <span>
          <a style={{ marginRight: '15px' }} onClick={() => {
            setChangeColums(record)
            setAddModalVisiable(true)

          }}>编辑</a>
          <Popconfirm
            title='是否删除？删除后无法恢复'
            onConfirm={() => {
              setColumnsData(toJS(columnsData).filter(item => item.id !== record.id))
              setDataColumnsData(distinctArrObj(toJS(dataColumnsData).filter(item => item !== record.fieldName)))
              setDataColumns(toJS(dataColumns).filter(item => item.title !== record.fieldName))
            }}
            okText='是'
            cancelText='否'
          >
            <a >删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ]

  //表格数据发生变化
  const onTableSave = (value) => {
    if (!lookDataJson) {
      message.error('请先进行数据查询后再进行添加!')
      return
    }
    let { fieldName, resultValue, fieldType, jsonpath, id } = value;
    let newresultValue = toJS(resultValue)
    let arr = []
    if (id) {
      let index = columnsData.findIndex(item => item.id === id)
      let newData = _.cloneDeep([...toJS(columnsData)]);
      const oldName = newData[index].fieldName || ''
      //修改底部俩数据
      let oldDataColumns = _.cloneDeep([...toJS(dataColumns)])
      if (index !== -1) {
        oldDataColumns[index] = {
          ...oldDataColumns[index],
          title: fieldName,
          dataIndex: fieldName,
        }
        setDataColumns(oldDataColumns)
        let oldDataValue = _.cloneDeep([...toJS(dataColumnsData)])
        //新的数据比原有数据长
        if (Array.isArray(newresultValue) && newresultValue.length > 0) {
          if (oldDataValue.length >= resultValue.length) {
            console.log('111', newresultValue, oldDataValue)
            let newOne = oldDataValue.map((item, index) => {
              let obj = {
                ...item,
                [fieldName]: JSON.stringify(newresultValue[index])
              }
              if (oldName !== fieldName) {
                delete obj[oldName]
              }
              return obj
            })

            setDataColumnsData(distinctArrObj(newOne))
          } else {
            let newOne = newresultValue.map((item, index) => {
              let obj
              if (oldDataValue[index]) {
                obj = {
                  ...oldDataValue[index],
                  [fieldName]: JSON.stringify(item)
                }
              } else {
                let oldKeys = Object.keys(oldDataValue).filter(item => item !== fieldName).map(item => {
                  return {
                    [item]: null
                  }
                })
                obj = {
                  ...oldKeys,
                  [fieldName]: JSON.stringify(item)
                }
              }
              return obj
            })
            newOne = newOne.filter(item => {
              let isNoDataFlag = false
              Object.keys(item).map(objItem => {
                if (!item[objItem]) {
                  isNoDataFlag = true
                }
              })
              if (!isNoDataFlag) {
                return item
              }

            })

            setDataColumnsData(distinctArrObj(newOne))
          }
        } else {
          let newOne = oldDataValue.map((item, index) => {
            if (index === 0) {
              return {
                ...item,
                [fieldName]: JSON.stringify(resultValue)
              }
            } else {
              return {
                ...item,
                [fieldName]: null
              }
            }

          })
          setDataColumnsData(distinctArrObj(newOne))
        }

        //底部表头数据
        newData[index] = {
          ...newData[index],
          fieldName,
          fieldType,
          jsonpath,
          resultValue
        }
        arr = newData
      }
    } else {
      arr = [...columnsData, {
        fieldName,
        fieldType,
        jsonpath,
        resultValue,
        id: Math.random()
      }]
      //底部修改数据
      let oldDataColumns = _.cloneDeep([...toJS(dataColumns)])
      let oldDataValue = _.cloneDeep([...toJS(dataColumnsData)])
      setDataColumns([...oldDataColumns, {
        title: fieldName,
        dataIndex: fieldName,
        render: (text) => {
          if (text) {
            return <Tooltip title={text}>
              <span className='MaxTable' style={{ width: '80%' }}>{text}</span>
            </Tooltip>;
          }

        },

      }])
      if (dataColumns.length == 0) {
        // data数据
        let dataArr = [];
        if (Array.isArray(resultValue) && resultValue.length > 0) {
          resultValue.map(item => {
            dataArr.push({
              [fieldName]: JSON.stringify(item)
            });
          })
        } else {
          for (const i in resultValue) {
            dataArr.push({
              [fieldName]: JSON.stringify(resultValue[i])
            });
          }
        }
        setDataColumnsData(dataArr)
      } else {
        if (Array.isArray(newresultValue) && newresultValue.length > 0) {
          if (oldDataValue.length >= newresultValue.length) {
            let new11 = oldDataValue.map((item, index) => {
              let obj = {
                ...item,
                [fieldName]: JSON.stringify(newresultValue[index])
              }

              return obj
            })
            setDataColumnsData(new11)
          } else {
            let new11 = newresultValue.map((item, index) => {
              let obj
              if (oldDataValue[index]) {
                obj = {
                  ...oldDataValue[index],
                  [fieldName]: JSON.stringify(item)
                }
                return obj
              } else {
                let oldKeys = Object.keys(oldDataValue).filter(item => item !== fieldName).map(item => {
                  return {
                    [item]: null
                  }
                })
                obj = {
                  ...oldKeys,
                  [fieldName]: JSON.stringify(item)
                }
                return obj
              }
            })
            setDataColumnsData(new11)
          }
        } else {
          let new11 = oldDataValue.map((item, index) => {
            if (index === 0) {
              return {
                ...item,
                [fieldName]: JSON.stringify(newresultValue[index])
              };
            } else {
              return {
                ...item,
                [fieldName]: null
              };
            }

          });
          setDataColumnsData(new11);
        }

      }
    }
    setColumnsData(arr)

  };
  let editorShowOptions = {
    theme: 'bootstrap4',
    schema: {
      "type": "string",
      "format": "json"
    }
  };
  //初始话默认清除
  useEffect(() => {
    return () => {
      setColumnsData([]);
      setDataColumnsData([]);
      setDataColumns([]);
      setAddModalVisiable(false);
    };
  }, []);
  useEffect(() => {
    if (activeContent) {
      setRequestBodyTypeIsJson(false)
      setJsonOrText(activeContent?.requestBody?.type == 'json' ? true : false);
      let { exampleData = {} } = activeContent;
      if (!showFirst.current) {
        showFirst.current = (new JSONEditor(editShowContainer.current, editorShowOptions));
      } else {
        showFirst.current.setValue('');
      }
      // //判断是text还是json
      if (activeContent.requestBody && activeContent.requestBody?.value) {
        if (activeContent.requestBody?.type == 'json') {
          setRequestBodyTypeIsJson(true)

        } else {
          setRequestBodyTypeIsJson(false)
        }

      }
      if (activeContent.fields) {
        setColumnsData(Array.isArray(toJS(activeContent.fields)) ? activeContent.fields : [])
      }

      if (exampleData && exampleData.clomes) {
        let newClomus = exampleData?.clomes.map(item => {
          delete item.width
          return {
            ...item,
            render: (text) => {
              if (text) {
                return <Tooltip title={text}>
                  <span className='MaxTable' style={{ width: '80%' }}>{text}</span>
                </Tooltip>;
              }

            },
          }
        })
        setDataColumns(newClomus);
      } else {
        setDataColumns([]);
      }
      if (exampleData && exampleData.data) {
        setDataColumnsData(exampleData.data);
      } else {
        setDataColumnsData([]);
      }
    }
    setTextAreaValue(activeContent.requestBody.type ? activeContent.requestBody.value : activeContent.requestBody)
  }, [activeContent]);
  // //修改数据表
  const addOneDatatable = () => {
    if (columnsData.length == 0) {
      message.error('请设置定义字段信息!');
      return;
    }
    if (myeditor.current) {
      myeditor.current.readyCheck((myeditorJsonValue) => {
        if (myeditorJsonValue === false) {
          message.error('请修改请求体Json符合规则后再进行保存！')
          return
        }
        let conentData = resetData;
        if (resetData.datasourceId && editName) {
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
                type: activeContent.requestBody?.type,
                schema: activeContent.requestBody?.schema || activeContent.requestBody.value,
                value: activeContent.requestBody.value ? JSON.stringify(myeditor.current.getObjValue()) : null,
              },
              fields: columnsData.map((item, index) => {
                return {
                  ...item,
                  sort: index + 1
                }
              }),
              exampleData: {
                clomes: dataColumns,
                data: dataColumnsData
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
      })
    }else{
      let conentData = resetData;
      if (resetData.datasourceId && editName) {
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
              type: activeContent.requestBody?.type,
              schema: activeContent.requestBody?.schema || activeContent.requestBody.value,
              value: activeContent.requestBody.value ? textAreaValue : null,
            },
            fields: columnsData.map((item, index) => {
              return {
                ...item,
                sort: index + 1
              }
            }),
            exampleData: {
              clomes: dataColumns,
              data: dataColumnsData
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
    let conentData = resetData;
    let requestBody = null;
    let errorMes = false
    if (myeditor.current) {
      myeditor.current.readyCheck((myeditorJsonValue) => {

        if (myeditorJsonValue === false) {
          message.error('请修改请求体Json符合规则后再进行查询!')
          errorMes = true
          return
        }

        if (editFirst && activeContent.requestBody?.value) {
          requestBody = {
            type: activeContent.requestBody.type,
            value: myeditorJsonValue
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
              let newArr = _.cloneDeep(toJS(dataColumnsData));
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
                      item[i] = JSON.stringify(obj[i][index]);
                    }

                  }
                }
              });
              setDataColumnsData(newArr);
            }

          } else {
            message.error(res.msg || '执行查询失败,请重新查询!');
          }

        }).catch(res => {
          setQueryLoading(false);
        });
      })

    } else {
      if (editFirst && activeContent.requestBody?.value) {
        requestBody = {
          type: activeContent.requestBody.type,
          value: textAreaValue
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
            let newArr = _.cloneDeep(toJS(dataColumnsData));
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
                    item[i] = JSON.stringify(obj[i][index]);
                  }

                }
              }
            });
            setDataColumnsData(newArr);
          }

        } else {
          message.error(res.msg || '执行查询失败,请重新查询!');
        }

      }).catch(res => {
        setQueryLoading(false);
      });
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
              {/* <div ref={editContainer} ></div> */}
              {
                activeContent.requestBody?.type == 'json' ?
                  <MYJSONEditor
                    ref={myeditor}
                    schema={activeContent.requestBody?.schema || activeContent.requestBody?.value || null}
                    schemaJson={activeContent.requestBody?.schema ? activeContent.requestBody.value : null}
                    tableId={tableId}
                  /> :
                  <Input.TextArea
                    rows={10}
                    onChange={e =>
                      setTextAreaValue(e.target.value)}
                    value={textAreaValue}
                  />
              }
            </Panel>
          </Collapse>
        </div>
      }
      <Button onClick={() => { Tosearch() }} loading={queryLoading} className={styles.bluebtn}>执行查询</Button>
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
          {
            columnsData.length > 0 && <Table columns={newClomus} dataSource={columnsData} pagination={false}
              scroll={{ y: '300px' }}
            />
          }
          <div className={styles.btnContainer} onClick={() => {
            setChangeColums({})
            if (!showFirst.current.getValue()) {
              message.error('请先执行查询后再新增表格！');
              return;
            } else {
              setAddModalVisiable(true);
            }
          }}>
            <Icon type="plus" style={{ marginRight: '5px' }} />
            <span>添加</span>
          </div>
        </Panel>
      </Collapse>
      <Collapse
        defaultActiveKey={['1']}
        bordered={false}
      >
        <Panel header='数据表' key='1' style={{ border: 'none' }}>
          {
            dataColumnsData.length > 0 && <Table columns={dataColumns} dataSource={dataColumnsData} pagination={false} scroll={{ x: dataColumns.length * 200, y: '300px' }} />
          }
        </Panel>
      </Collapse>
      {
        addModalVisiable && <AddTableRow
          columnsArr={columnsData} activeItem={changeColums}
          onCancel={setAddModalVisiable} onSave={onTableSave} lookDataJson={lookDataJson} />

      }
      <Button className={styles.bluebtn} style={{ margin: '10px 0 0' }} onClick={addOneDatatable} loading={saveLoading}>保存</Button>

      <div ref={hiddenEditor} style={{ display: 'none' }}></div>

    </div>
  );

});

export default HandleMenu;
