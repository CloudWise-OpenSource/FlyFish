import React from 'react';
import { Icon, Input, Popconfirm, message, Button, Tooltip } from '@chaoswise/ui';
import { useState, useEffect } from 'react';
import styles from './style.less';
import { observer, toJS } from '@chaoswise/cw-mobx';
import _ from 'lodash';
import store from './model';
import mainStore from '../../model';
import FileStore from '../File/model';
import { successCode } from '@/config/global';

const HandleMenu = observer((props) => {
  const { onChange, type, getTableList, activeContent, resetData, datasourceId } = props;

  const {
    treeList,
    getTreeList,
    setAddCateName,
    addCateName,
    setEditName,
    editName,
    checkIndex,
    setCheckIndex,
    resetTreeList,
    setTreeList,
    showInput,
    addGetTreeList,
    setShowInput,
    outsideName,
    setOutsideName,
    deleteOne,
    newOutside,
    changeOutside,
  } = store;
  const { setUploadVisiable } = FileStore;
  const [data, setData] = useState([]);
  let { activeData } = mainStore;
  //检测输入框查询的值找到符合的items
  useEffect(() => {
    let filterData = [];
    let data;
    if (!addCateName) {
      data = resetTreeList;
      setTreeList(data);
      return;
    }
    if (addCateName) {
      filterData = resetTreeList.filter(
        (item) => item.tableName.toLowerCase().indexOf(addCateName.toLowerCase()) !== -1
      );
      if (filterData.length > 0) {
        data = filterData;
      } else {
        if (!addCateName) {
          data = resetTreeList;
        } else {
          data = [];
        }
      }
    }
    setCheckIndex(null);
    setTreeList(data);
  }, [addCateName]);
  useEffect(() => {
    if (treeList) {
      const data = _.cloneDeep(toJS(treeList));
      let rs = data.map((item) => {
        let obj = {
          ...item,
          editing: false,
        };
        return obj;
      });
      setData(rs);
    }
  }, [treeList]);
  const reqTreeList = () => {
    getTreeList(
      {
        datasourceId,
      },
      (data) => {
        if (data && data.length > 0) {
          getTableList(
            {
              tableName: data[0].tableName,
              schemaName: data[0].schemaName,
              schemaType: data[0].schemaType,
              datasourceId: data[0].datasourceId,
            },
            data[0].schemaType
          );
        } else {
          resetData();
        }
      }
    );
  };
  const reqChangeList = () => {
    addGetTreeList(
      {
        datasourceId,
      },
      (data) => {
        if (data && data.length > 0) {
          getTableList(
            {
              tableName: data[0].tableName,
              schemaName: data[0].schemaName,
              schemaType: data[0].schemaType,
              datasourceId: data[0].datasourceId,
            },
            data[0].schemaType
          );
        } else {
          resetData();
        }
      },
      true
    );
  };
  //初始获取左侧树有值后请求父组件右侧content
  useEffect(() => {
    reqTreeList();
    return () => {
      setEditName('');
      setAddCateName('');
      setTreeList([]);
    };
  }, []);

  return (
    <>
      <div className={styles.wrapContainer}>
        <div className={styles.inputContainer}>
          <Input
            suffix={<Icon type="search" style={{ color: '#d9d9d9' }} />}
            style={{ width: '100%' }}
            allowClear
            value={addCateName}
            onChange={(e) => {
              setAddCateName(e.target.value);
            }}
            placeholder="查找表格"
          ></Input>
        </div>
        <div className={styles.treeContainer}>
          <div className={styles.topContainer}>
            <div className={styles.totalNum}>{treeList.length}个查询表格</div>
          </div>
          <div className={styles.treeInside}>
            {data && data.length == 0 && addCateName && (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  color: 'rgba(0, 0, 0, 0.25)',
                }}
              >
                未查找到任何结果
              </div>
            )}
            {data &&
              data.map((v, k) => {
                return (
                  <div key={k + ''}>
                    <div
                      className={styles.item + (checkIndex === k ? ' ' + styles.selected : '')}
                      onClick={() => {
                        setEditName(v.tableName), setCheckIndex(k), onChange(v.tableName);
                      }}
                    >
                      {v.editing ? (
                        <Input
                          style={{ height: 28, marginLeft: 0, width: 120 }}
                          className={styles.addingInput}
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                          }}
                          onBlur={(e) => {
                            setData((olddata) => {
                              return olddata.map((v1, k1) => {
                                if (k1 === k) {
                                  v1.editing = false;
                                }
                                return v1;
                              });
                            });
                          }}
                          onPressEnter={async (e) => {
                            if (!editName) {
                              message.error('数据表名称不能为空！');
                              return;
                            }
                            changeOutside(
                              {
                                datasourceId: activeData.datasourceId,
                                tableId: treeList[k].tableId,
                                tableName: editName,
                                tableMeta: activeContent,
                              },
                              (res) => {
                                if (res.code == successCode) {
                                  message.success('修改成功!');
                                  reqChangeList();
                                } else {
                                  message.error(res.msg || '修改失败,请重试！');
                                }
                              }
                            );
                          }}
                        ></Input>
                      ) : (
                        <Tooltip title={v.tableName}>
                          <span className={styles.tableItemName}>{v.tableName}</span>
                        </Tooltip>
                      )}
                      {['File'].includes(type) && (
                        <div className={styles.iconContainer}>
                          <Icon
                            type="edit"
                            className={styles.editIcon}
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadVisiable(true, v);
                            }}
                          />
                          <a
                            href={`${window.LCAP_CONFIG.javaApiDomain}/api/dataplateform/datatable/downloadTableFile?datasourceId=${v.datasourceId}&tableName=${v.tableName}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icon type="download" className={styles.editIcon} onClick={(e) => e.stopPropagation()} />
                          </a>
                          <Popconfirm
                            title="确定删除吗?"
                            onClick={(e) => e.stopPropagation()}
                            onCancel={(e) => e.stopPropagation()}
                            onConfirm={async (e) => {
                              e.stopPropagation();
                              deleteOne(
                                {
                                  datasourceId,
                                  tableId: treeList[k].tableId,
                                },
                                (res) => {
                                  if (res.code == successCode) {
                                    message.success('删除成功!');
                                    reqTreeList();
                                  } else {
                                    message.error(res.msg || '删除失败,请重试!');
                                  }
                                }
                              );
                            }}
                          >
                            <Icon type="delete" />
                          </Popconfirm>
                        </div>
                      )}
                      {['HTTP', 'Redis'].includes(type) && (
                        <div className={styles.iconContainer}>
                          <Icon
                            type="edit"
                            className={styles.editIcon}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditName(v.tableName);
                              setData((olddata) => {
                                return olddata.map((v1, k1) => {
                                  if (k1 === k) {
                                    v1.editing = true;
                                  }
                                  return v1;
                                });
                              });
                            }}
                          />
                          <Popconfirm
                            title="确定删除吗?"
                            onClick={(e) => e.stopPropagation()}
                            onCancel={(e) => e.stopPropagation()}
                            onConfirm={async (e) => {
                              e.stopPropagation();
                              deleteOne(
                                {
                                  datasourceId,
                                  tableId: treeList[k].tableId,
                                },
                                (res) => {
                                  if (res.code == successCode) {
                                    message.success('删除成功!');
                                    reqTreeList();
                                  } else {
                                    message.error(res.msg || '删除失败,请重试!');
                                  }
                                }
                              );
                            }}
                          >
                            <Icon type="delete" />
                          </Popconfirm>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          {type == 'File' && (
            <div className={styles.btnContainer}>
              <Button
                style={{ width: '100%' }}
                className={styles.AddBtn}
                onClick={() => {
                  setUploadVisiable(true);
                }}
              >
                <Icon type="plus" />
                新增表格
              </Button>
            </div>
          )}
          {['HTTP', 'Redis'].includes(type) && (
            <>
              {!showInput && (
                <div className={styles.btnContainer}>
                  <Button
                    style={{ width: '100%' }}
                    className={styles.AddBtn}
                    onClick={() => {
                      setShowInput(true);
                    }}
                  >
                    <Icon type="plus" />
                    新增表格
                  </Button>
                </div>
              )}
              {type !== 'File' && showInput && (
                <div className={styles.btnContainer}>
                  <Input
                    onChange={(e) => {
                      setOutsideName(e.target.value);
                    }}
                    style={{ marginTop: '10px' }}
                    placeholder="请输入表格名称"
                    onBlur={() => {
                      setShowInput(false);
                    }}
                    onPressEnter={() => {
                      setShowInput(false);
                      if (!outsideName) {
                        message.error('数据表名称不能为空');
                        return;
                      }
                      setEditName(outsideName);
                      if (outsideName) {
                        let newData = JSON.parse(JSON.stringify(activeData));
                        let conentData = JSON.parse(toJS(newData.connectData));
                        newOutside(
                          {
                            datasourceId: datasourceId,
                            tableName: outsideName,
                            tableMeta: conentData,
                          },
                          (res) => {
                            if (res.code == successCode) {
                              message.success('数据表保存成功');
                              addGetTreeList(
                                {
                                  datasourceId,
                                },
                                (data) => {
                                  if (data && data.length > 0) {
                                    getTableList(
                                      {
                                        tableName: data[data.length - 1].tableName,
                                        schemaName: data[data.length - 1].schemaName,
                                        schemaType: data[data.length - 1].schemaType,
                                        datasourceId: data[data.length - 1].datasourceId,
                                      },
                                      activeData.schemaType
                                    );
                                  } else {
                                    resetData();
                                  }
                                }
                              );
                            } else {
                              message.error(res.msg);
                            }
                          }
                        );
                      }
                      setOutsideName('');
                    }}
                  ></Input>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
});

export default HandleMenu;
