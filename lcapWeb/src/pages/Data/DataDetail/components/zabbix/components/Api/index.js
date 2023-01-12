
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { observer, toJS } from "@chaoswise/cw-mobx";
import _ from "lodash";
import { Collapse, Table, Icon, Popconfirm, Button, Empty, message, Tooltip } from '@chaoswise/ui';
import { successCode } from "@/config/global";
import store from './model'
import { JSONEditor } from "@json-editor/json-editor";
import MYJSONEditor from '@/components/JsonEdit';
const Panel = Collapse.Panel;
import AddTableRow from './EditRoleModal'
const ProjectDetail = observer(({ reqBody, onApiQuery, onSave, activeContent, checkIndex, onChange, groupData }) => {
  const { addModalVisiable, setAddModalVisiable,
    setColumnsData, columnsData, dataColumns, dataColumnsData, setDataColumnsData, setDataColumns, changeOutside, setRequestValue, requestValue } = store
  const [lookDataJson, setLookDataJson] = useState(null)
  const [changeColums, setChangeColums] = useState({}) //编辑的表头
  const editShowContainer = useRef(); //jsonshow实例
  const hiddenEditor = useRef(); //jsonedit实例
  const showFirst = useRef(); //jsonshow实例
  const editFirst = useRef(); //jsonedit实例
  const myeditor = useRef();//editor实力
  const [keepSchemaJson, setKeepSchemaJson] = useState(null)//判断是否切换左侧，把requsetBody清空
  useEffect(() => {
    return () => {
      if (editFirst.current) {
        editFirst.current.on('ready', () => {
          setRequestValue(JSON.stringify(editFirst.current.getValue()))
        });
      }
    }
  }, [])
  useEffect(() => {
    setKeepSchemaJson(null)
  }, [checkIndex])
  useEffect(() => {
    const { tableMeta } = activeContent
    if (tableMeta) {
      if (tableMeta.templateGroup && tableMeta.templateMethod) {
        setColumnsData(toJS(tableMeta.fields))
        let newClomus = tableMeta.exampleData?.clomes.map(item => {
          delete item?.width
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
        setDataColumns(newClomus)
        setDataColumnsData(toJS(tableMeta.exampleData?.data))
      }
    }
  }, [activeContent])
  const columns = [
    {
      title: '字段类型',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: '25%'

    },
    {
      title: '类型',
      width: '20%',
      dataIndex: 'fieldType',
      key: 'fieldType',
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
      width: 200,
      render: (text) => (
        <Tooltip title={text || ''} placement="topLeft">
          <span className="TableTopTitle" style={{ width: '200px' }}>{text || ''}</span>
        </Tooltip>
      ),
    }
  ]

  let editorShowOptions = {
    theme: 'bootstrap4',
    schema: {
      "type": "string",
      "format": "json"
    }
  };

  useEffect(() => {
    if (!showFirst.current) {
      showFirst.current = (new JSONEditor(editShowContainer.current, editorShowOptions));
    } else {
      showFirst.current.setValue('');
    }
    if (!reqBody) {
      if (!activeContent.tableMeta?.templateGroup) {
        if (editFirst.current) {
          editFirst.current.destroy();
        }
        setDataColumnsData([])
        setDataColumns([])
        setColumnsData([])
      }
      if (groupData !== activeContent.tableMeta?.templateGroup) {
        if (editFirst.current) {
          editFirst.current.destroy();
        }
        setDataColumnsData([])
        setDataColumns([])
        setColumnsData([])
      }
    } else {
      setKeepSchemaJson(reqBody?.requestBody)
    }
  }, [reqBody]);
  const onSearch = () => {
    myeditor.current.readyCheck((myeditorJsonValue) => {
      if (!myeditorJsonValue) {
        message.error('请修改请求体Json后再进行查询!')
        return
      }
      onApiQuery(JSON.stringify(myeditorJsonValue), ({ data }) => {
        setLookDataJson(data)
        let formateStr = JSON.stringify(data, null, 2);
        showFirst.current.setValue(formateStr);
      })
    })

  }
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
  //表格数据发生变化
  const onTableSave = (value) => {
    if (!lookDataJson) {
      message.error('请先进行数据查询后再进行添加!')
      return
    }
    let { fieldName, resultValue, fieldType, jsonpath, id } = value;
    let newresultValue = toJS(resultValue)
    let maxLength = Math.max.apply(null, resultValue.map(item => String(item).length));
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
  const addTable = () => {
    setChangeColums({})
    if (!lookDataJson) {
      message.error('请先进行数据查询后再进行添加!')
      return
    }
    setAddModalVisiable(true)
  }
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
  //保存api数据
  const save = () => {
    myeditor.current.readyCheck((myeditorJsonValue) => {
      onSave(({ templateGroup, templateMethod }) => {
        if (dataColumns.length == 0) {
          message.error('请抽取字段后再进行保存!')
          return
        }
        changeOutside({
          datasourceId: activeContent.datasourceId,
          tableId: activeContent.tableId,
          tableMeta: {
            ...activeContent.tableMeta,
            querySource: 1,
            templateGroup,
            templateMethod,
            requestBody: myeditorJsonValue,
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
          if (res.code === successCode) {
            message.success('保存成功');
            onChange(activeContent.tableName)
          } else {
            message.error(res.msg || '保存失败,请重试!');
          }
        })
      })
    })

  }
  return (
    <div className={styles.apiContainer}>
      <div className='jsontPanel'>
        <Collapse
          defaultActiveKey={['1']}
          bordered={false}
          className="site-collapse-custom-collapse"
        >
          <Panel header='请求体' key="1" style={{ border: 'none' }} >
            {
              <Empty style={{ marginTop: '20px', display: !reqBody ? 'block' : 'none' }} />

            }
            {
              <MYJSONEditor
                style={{ display: reqBody ? 'block' : 'none' }}
                ref={myeditor}
                schema={keepSchemaJson || null}
                schemaJson={activeContent.tableMeta?.requestBody ? JSON.stringify(activeContent.tableMeta?.requestBody) : null}
              />
            }
          </Panel>
        </Collapse>
      </div>
      <Button className={styles.searchBtn} onClick={onSearch}>执行查询</Button>
      <Collapse
        defaultActiveKey={['1']}
        bordered={false}
      >
        <Panel header='结果预览' key='1' style={{ border: 'none' }}>
          <div ref={editShowContainer} className='showEdit' ></div>
        </Panel>

      </Collapse>
      <Collapse
        defaultActiveKey={['1']}
        bordered={false}
      >
        <Panel header='定义字段' key='1' style={{ border: 'none' }}>
          {
            columnsData.length > 0 && <Table columns={newClomus} dataSource={columnsData} pagination={false}
              scroll={{ y: '300px' }}
            />
          }
          <div className={styles.btnContainer} onClick={() => {
          }}>
            <Icon type="plus" style={{ marginRight: '5px' }} />
            <span onClick={addTable}>添加</span>
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


      <div ref={hiddenEditor} style={{ display: 'none' }}></div>
      <Button type="primary" onClick={save}>保存</Button>
      {
        addModalVisiable && <AddTableRow
          activeItem={changeColums}
          columnsArr={columnsData} onCancel={setAddModalVisiable}
          onSave={onTableSave} lookDataJson={lookDataJson} />
      }
    </div>
  );

});

export default ProjectDetail;