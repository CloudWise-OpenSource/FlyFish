import React, { useEffect, useRef, useState } from 'react';
import { observer, toJS } from '@chaoswise/cw-mobx';
import { Table, Tag, Icon, Select, Input, Form, message } from '@chaoswise/ui';
import TreeSelect from '@chaoswise/ui/lib/Antd/TreeSelect';
import styles from './style.less';
import store from '../../model/index';

const { Option } = Select;

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
let selectedRowsCopy = [];
const EditableCell = observer((props) => {
  const [editing, setEditing] = useState(false); //判断那一列组件可以进行修改
  // const { selectedRows, setSelectedRows } = store
  let formElement = null;
  let inputElement = null;

  useEffect(() => {
    if (editing) {
      inputElement.focus();
    }
  }, [editing]);

  const toggleEdit = (record) => {
    if (!record.update) {
      setEditing(!editing);
    }
  };

  const save = (e) => {
    const { record, handleSave } = props;

    formElement.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      toggleEdit(record);
      // if(selectedRows.some(item => item.id === record.id)){
      //   let selectedRowsCopy = _.cloneDeep(toJS(selectedRows))
      //   selectedRowsCopy.forEach(item => {
      //     if(item.id === record.id){
      //       item.name = values.name
      //     }
      //   })
      //   setSelectedRows(selectedRowsCopy)
      // }
      handleSave({ ...record, ...values });
    });
  };

  const renderCell = (form) => {
    formElement = form;
    const { children, dataIndex, record, title } = props;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `请填写${title}`,
            },
            {
              max: 50,
              message: '组件名称长度不能超过50！',
            },
          ],
          initialValue: record[dataIndex],
        })(
          <Input
            ref={(node) => {
              return (inputElement = node);
            }}
            onPressEnter={save}
            onBlur={save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className={'editable-cell-value-wrap ' + styles.importConfigComName}
        onClick={() => toggleEdit(record)}
      >
        {children}
        {record.update ? <></> : <Icon type='edit' theme='twoTone' />}
      </div>
    );
  };

  const {
    editable,
    dataIndex,
    title,
    record,
    index,
    handleSave,
    children,
    ...restProps
  } = props;

  return (
    <td {...restProps}>
      {editable ? (
        <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
      ) : (
        children
      )}
    </td>
  );
});

const ImportConfig = observer((props) => {
  const {
    setImportSelectedNum,
    setImportTableData,
    getImportConfig,
    getProjectsData,
    getComponentClassifyTreeData,
    setIsAppHasComponent,
    getVersionValidate,
  } = store;
  const {
    importSelectedNum,
    importTableData,
    projectsData,
    componentClassifyTreeData,
    isComponent,
    isAppHasComponent,
    previouStepFlag,
    comsInAppTableData,
    versionvalidatResult,
  } = store;
  const { selectedRows, setSelectedRows, setComsInAppTableData } = store;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  let appOrComDispaly = isComponent ? '组件' : '应用';
  let timer = null;
  let versionValue = '';

  const selectChange = (selectedRowKeys, selectedRows) => {
    setImportSelectedNum(selectedRows.length);
    setSelectedRowKeys(selectedRowKeys);
    selectedRowsCopy = [...selectedRows];
    setSelectedRows(selectedRowsCopy);
  };

  useEffect(() => {
    getImportConfig();
    getProjectsData();
    getComponentClassifyTreeData();
    setImportSelectedNum(0);
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: selectChange,
  };

  const typeOnchange = (value, option) => {
    const editTableCellDataId = option._owner.memoizedProps.record.id;
    let newData = _.cloneDeep(toJS(importTableData));
    newData.forEach((item) => {
      if (item.id === editTableCellDataId) {
        item.type = value;
        if (value === 'project') {
          item.projects = [];
          item.projectsName = [];
        }
      }
    });
    setImportTableData(newData);
    if (selectedRows.some((item) => item.id === editTableCellDataId)) {
      let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
      selectedRowsCopy.forEach((item) => {
        if (item.id === editTableCellDataId) {
          item.type = value;
          if (value === 'project') {
            item.projects = [];
            item.projectsName = [];
          }
        }
      });
      setSelectedRows(selectedRowsCopy);
    }
  };
  const projectsOnslect = (value, record) => {
    const editTableCellDataId = record.id;
    let newData = _.cloneDeep(toJS(importTableData));
    if (value.length > record.projects.length) {
      newData.forEach((item) => {
        if (item.id === editTableCellDataId) {
          let projectIsRepeat = item.projects.some((element) => {
            return element === value[value.length - 1].key;
          });
          if (!projectIsRepeat) {
            item.projects = [...item.projects, value[value.length - 1].key];
            item.projectsName = [
              ...item.projectsName,
              value[value.length - 1].label,
            ];
          } else {
            message.error('不能选取重复的项目');
          }
        }
      });
      setImportTableData(newData);
      if (selectedRows.some((item) => item.id === editTableCellDataId)) {
        let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
        selectedRowsCopy.forEach((item) => {
          if (item.id === editTableCellDataId) {
            let projectIsRepeat = item.projects.some((element) => {
              return element === value[value.length - 1].key;
            });
            if (!projectIsRepeat) {
              item.projects = [...item.projects, value[value.length - 1].key];
              item.projectsName = [
                ...item.projectsName,
                value[value.length - 1].label,
              ];
            }
            // else {
            //   message.error('不能选取重复的项目')
            // }
          }
        });
        setSelectedRows(selectedRowsCopy);
      }
    } else {
      let deleteProjectIndex;
      for (let i = 0; i < value.length; i++) {
        if (value[i].key !== record.projectsName[i]) {
          deleteProjectIndex = i;
          break;
        }
        if (i === value.length - 1) {
          deleteProjectIndex = i + 1;
        }
      }
      newData.forEach((item) => {
        if (item.id === editTableCellDataId) {
          item.projects.splice(deleteProjectIndex, 1);
          item.projectsName.splice(deleteProjectIndex, 1);
        }
      });
      setImportTableData(newData);
      if (selectedRows.some((item) => item.id === editTableCellDataId)) {
        let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
        selectedRowsCopy.forEach((item) => {
          if (item.id === editTableCellDataId) {
            item.projects.splice(deleteProjectIndex, 1);
            item.projectsName.splice(deleteProjectIndex, 1);
          }
        });
        setSelectedRows(selectedRowsCopy);
      }
    }
  };
  const categoryOnchange = (param) => {
    const value = JSON.parse(param.value);
    let newData = _.cloneDeep(toJS(importTableData));
    newData.forEach((item) => {
      if (item.id === value.three.id) {
        item.category = value.one.id;
        item.subCategory = value.two;
        item.subCategoryName = param.label;
        item.categoryName = value.one.name;
      }
    });
    setImportTableData(newData);
    if (selectedRows.some((item) => item.id === value.three.id)) {
      let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
      selectedRowsCopy.forEach((item) => {
        if (item.id === value.three.id) {
          item.category = value.one.id;
          item.subCategory = value.two;
          item.subCategoryName = param.label;
          item.categoryName = value.one.name;
        }
      });
      setSelectedRows(selectedRowsCopy);
    }
  };

  const appProjectsOnchange = (value, option) => {
    const editTableCellDataId = option._owner.memoizedProps.record.id;
    const newData = _.cloneDeep(toJS(importTableData));
    newData.forEach((item) => {
      if (item.id === editTableCellDataId) {
        item.projectId = value.key;
        item.projectName = value.label;
      }
    });
    setImportTableData(newData);
    if (selectedRows.some((item) => item.id === editTableCellDataId)) {
      let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
      selectedRowsCopy.forEach((item) => {
        if (item.id === editTableCellDataId) {
          item.projectId = value.key;
          item.projectName = value.label;
        }
      });
      setSelectedRows(selectedRowsCopy);
    }
  };

  const appsComTypeOnchange = (value, option) => {
    const editTableCellDataId = option._owner.memoizedProps.record.id;
    let newData = _.cloneDeep(toJS(importTableData));
    let newComsInAppTableData = _.cloneDeep(toJS(comsInAppTableData));
    newData.forEach((item) => {
      item.components.forEach((element) => {
        if (element.id === editTableCellDataId) {
          element.type = value;
          if (value === 'project') {
            element.projects = [];
            element.projectsName = [];
          }
        }
      });
    });
    setImportTableData(newData);
    newComsInAppTableData.forEach((item) => {
      if (item.id === editTableCellDataId) {
        item.type = value;
        if (value === 'project') {
          item.projects = [];
          item.projectsName = [];
        }
      }
    });
    setComsInAppTableData(newComsInAppTableData);
    let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
    selectedRowsCopy.forEach((item) => {
      item.components.forEach((element) => {
        if (element.id === editTableCellDataId) {
          element.type = value;
          if (value.key === 'project') {
            element.projects = [];
            element.projectsName = [];
          }
        }
      });
    });
    setSelectedRows(selectedRowsCopy);
  };

  const appsComProjectsOnchange = (value, record) => {
    const editTableCellDataId = record.id;
    let newData = _.cloneDeep(toJS(importTableData));
    let newComsInAppTableData = _.cloneDeep(toJS(comsInAppTableData));
    setComsInAppTableData(newComsInAppTableData);
    if (value.length > record.projects.length) {
      newData.forEach((item) => {
        item.components.forEach((comelem) => {
          if (comelem.id === editTableCellDataId) {
            let projectIsRepeat = comelem.projects.some((element) => {
              return element === value[value.length - 1].key;
            });
            if (!projectIsRepeat) {
              comelem.projects = [
                ...comelem.projects,
                value[value.length - 1].key,
              ];
              comelem.projectsName = [
                ...comelem.projectsName,
                value[value.length - 1].label,
              ];
            }
          }
        });
      });
      setImportTableData(newData);
      newComsInAppTableData.forEach((item) => {
        if (item.id === editTableCellDataId) {
          let projectIsRepeat = item.projects.some((element) => {
            return element === value[value.length - 1].key;
          });
          if (!projectIsRepeat) {
            item.projects = [...item.projects, value[value.length - 1].key];
            item.projectsName = [
              ...item.projectsName,
              value[value.length - 1].label,
            ];
          } else {
            message.error('不能选取重复的项目');
          }
        }
      });
      setComsInAppTableData(newComsInAppTableData);
      let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
      selectedRowsCopy.forEach((item) => {
        item.components.forEach((comelem) => {
          if (comelem.id === editTableCellDataId) {
            let projectIsRepeat = comelem.projects.some((element) => {
              return element === value[value.length - 1].key;
            });
            if (!projectIsRepeat) {
              comelem.projects = [
                ...comelem.projects,
                value[value.length - 1].key,
              ];
              comelem.projectsName = [
                ...comelem.projectsName,
                value[value.length - 1].label,
              ];
            }
          }
        });
      });
      setSelectedRows(selectedRowsCopy);
    } else {
      let deleteProjectIndex;
      for (let i = 0; i < value.length; i++) {
        if (value[i].key !== record.projectsName[i]) {
          deleteProjectIndex = i;
          break;
        }
        if (i === value.length - 1) {
          deleteProjectIndex = i + 1;
        }
      }
      newData.forEach((item) => {
        item.components.forEach((comelem) => {
          if (comelem.id === editTableCellDataId) {
            comelem.projects.splice(deleteProjectIndex, 1);
            comelem.projectsName.splice(deleteProjectIndex, 1);
          }
        });
      });
      setImportTableData(newData);
      newComsInAppTableData.forEach((item) => {
        if (item.id === editTableCellDataId) {
          item.projects.splice(deleteProjectIndex, 1);
          item.projectsName.splice(deleteProjectIndex, 1);
        }
      });
      setComsInAppTableData(newComsInAppTableData);
      let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
      selectedRowsCopy.forEach((item) => {
        item.components.forEach((comelem) => {
          if (comelem.id === editTableCellDataId) {
            comelem.projects.splice(deleteProjectIndex, 1);
            comelem.projectsName.splice(deleteProjectIndex, 1);
          }
        });
      });
      setSelectedRows(selectedRowsCopy);
    }
  };

  const appsComCategoryOnchange = (param) => {
    const value = JSON.parse(param.value);
    let newData = _.cloneDeep(toJS(importTableData));
    let newComsInAppTableData = _.cloneDeep(toJS(comsInAppTableData));
    newData.forEach((item) => {
      item.components.forEach((element) => {
        if (element.id === value.three.id) {
          element.category = value.one.id;
          element.subCategory = value.two;
          element.subCategoryName = param.label;
          element.categoryName = value.one.name;
        }
      });
    });
    setImportTableData(newData);
    newComsInAppTableData.forEach((item) => {
      if (item.id === value.three.id) {
        item.category = value.one.id;
        item.subCategory = value.two;
        item.subCategoryName = param.label;
        item.categoryName = value.one.name;
      }
    });
    setComsInAppTableData(newComsInAppTableData);
    let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
    selectedRowsCopy.forEach((item) => {
      item.components.forEach((element) => {
        if (element.id === value.three.id) {
          element.category = value.one.id;
          element.subCategory = value.two;
          element.subCategoryName = param.label;
          element.categoryName = value.one.name;
        }
      });
    });
    setSelectedRows(selectedRowsCopy);
  };

  const versionOnchange = (event, record) => {
    versionValue = event.currentTarget.value;
    if (versionValue.length > 0) {
      //调取校验接口
      getVersionValidate({ id: record.id, version: versionValue });
    } else {
      let newData = _.cloneDeep(toJS(importTableData));
      let newComsInAppTableData = _.cloneDeep(toJS(comsInAppTableData));
      if (isComponent) {
        newData.forEach((item) => {
          if (item.id === record.id) {
            item.versionFlag = '';
            item.version = item.resetVersion;
            item.versionValidateMes = '';
          }
        });
        setImportTableData(newData);
        if (selectedRows.some((item) => item.id === record.id)) {
          let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
          selectedRowsCopy.forEach((item) => {
            if (item.id === record.id) {
              item.version = item.resetVersion;
              item.versionFlag = '';
              item.versionValidateMes = '';
            }
          });
          setSelectedRows(selectedRowsCopy);
        }
      } else {
        newData.forEach((item) => {
          item.components.forEach((element) => {
            if (element.id === record.id) {
              element.versionFlag = '';
              element.version = element.resetVersion;
              element.versionValidateMes = '';
            }
          });
        });
        newComsInAppTableData.forEach((item) => {
          if (item.id === record.id) {
            item.versionFlag = '';
            item.version = item.resetVersion;
            item.versionValidateMes = '';
          }
        });
        let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
        selectedRowsCopy.forEach((item) => {
          item.components.forEach((element) => {
            if (element.id === record.id) {
              element.versionFlag = '';
              element.version = element.resetVersion;
              element.versionValidateMes = '';
            }
          });
        });
        setSelectedRows(selectedRowsCopy);
        setImportTableData(newData);
        setComsInAppTableData(newComsInAppTableData);
      }
    }
  };

  const componentColumns = [
    {
      title: '组件名称',
      dataIndex: 'name',
      width: '15%',
      key: 'name',
      editable: true,
    },
    {
      title: '导入方式',
      width: '10%',
      dataIndex: 'update',
      key: 'update',
      render: (tag) => (
        <span>
          {tag ? (
            <Tag color='blue' key={tag}>
              更新
            </Tag>
          ) : (
            <Tag color='green' key={tag}>
              新建{' '}
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: '组件版本',
      width: '25%',
      dataIndex: 'version',
      key: 'version',
      render: (text, record) => (
        <>
          {record.update ? (
            <Form.Item
              hasFeedback
              validateStatus={record.versionFlag}
              help={record.versionValidateMes}
            >
              <Input
                onBlur={(e) => {
                  versionOnchange(e, record);
                }}
                defaultValue={record.versionFlag ? record.version : ''}
                placeholder='填写将创建新版本，未填写版本则覆盖原版本'
                className={styles.versionInfo}
              ></Input>
            </Form.Item>
          ) : (
            <span>{text}</span>
          )}
        </>
      ),
    },
    {
      title: '组件类别',
      width: '15%',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => (
        <>
          {record.update ? (
            <span>{text === 'common' ? '基础组件' : '项目组件'}</span>
          ) : (
            <Select
              style={{ width: '90%' }}
              defaultValue={text}
              onChange={typeOnchange}
            >
              <Option value='common' key='common'>
                基础组件
              </Option>
              <Option value='project' key='project'>
                项目组件
              </Option>
            </Select>
          )}
        </>
      ),
    },
    {
      title: '所属项目',
      width: '240',
      dataIndex: 'projectsName',
      key: 'projectsName',
      render: (text, record) => {
        let projectsNameArr = [];
        projectsNameArr =
          text &&
          text.map((item) => {
            return {
              key: item,
            };
          });
        return (
          <>
            {record.update ? (
              <span>{text && text.join(',')}</span>
            ) : record.type === 'project' ? (
              <Select
                mode='multiple'
                labelInValue
                showSearch
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '90%' }}
                onChange={(value) => projectsOnslect(value, record)}
                // defaultValue={projectsNameArr}
                value={projectsNameArr}
              >
                {projectsData.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
    {
      title: '组件分类',
      width: '15%',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
      render: (text, record) => (
        <>
          {record.update ? (
            <span>{text}</span>
          ) : (
            <TreeSelect
              labelInValue
              style={{ width: '80%' }}
              getPopupContainer={(node) => {
                return node.parentNode;
              }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              onChange={categoryOnchange}
              treeData={componentClassifyTreeData.map((v, k) => {
                return {
                  title: v.name,
                  value: v.id,
                  key: k + '',
                  disabled: true,
                  children: v.children.map((v1, k1) => {
                    return {
                      title: v1.name,
                      value: JSON.stringify({
                        one: v,
                        two: v1.id,
                        three: record,
                      }),
                      key: k + '-' + k1,
                    };
                  }),
                };
              })}
              placeholder={text}
              treeDefaultExpandAll
              placement='topLeft'
            />
          )}
        </>
      ),
    },
  ];

  const AppColumns = [
    {
      title: '应用名称',
      width: '20%',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '导入方式',
      width: '60%',
      dataIndex: 'update',
      render: (tag) => (
        <span>
          {tag ? (
            <Tag color='blue' key={tag}>
              更新
            </Tag>
          ) : (
            <Tag color='green' key={tag}>
              新建{' '}
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: '所属项目',
      width: '20%',
      dataIndex: 'projectName',
      render: (text, record) => (
        <Select
          labelInValue
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          defaultValue={{ key: text }}
          style={{ width: '90%' }}
          onChange={appProjectsOnchange}
        >
          {projectsData.map((item) => {
            return (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      ),
    },
  ];

  const componentsInApp = [
    {
      title: '组件名称',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      editable: true,
    },
    {
      title: '导入方式',
      width: '10%',
      dataIndex: 'update',
      key: 'update',
      render: (tag) => (
        <span>
          {tag ? (
            <Tag color='blue' key={tag}>
              更新
            </Tag>
          ) : (
            <Tag color='green' key={tag}>
              新建{' '}
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: '所属应用',
      width: '15%',
      dataIndex: 'appName',
      key: 'appName',
    },
    {
      title: '组件版本',
      width: '25%',
      dataIndex: 'version',
      render: (text, record) => (
        <>
          {record.update ? (
            <Form.Item
              hasFeedback
              validateStatus={record.versionFlag}
              help={record.versionValidateMes}
            >
              <Input
                onBlur={(e) => {
                  versionOnchange(e, record);
                }}
                defaultValue={record.versionFlag ? record.version : ''}
                placeholder='填写将创建新版本，未填写版本则覆盖原版本'
                className={styles.versionInfo}
              ></Input>
            </Form.Item>
          ) : (
            <span>{text}</span>
          )}
        </>
      ),
    },
    {
      title: '组件类别',
      width: '10%',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => (
        <>
          {record.update ? (
            <span>{text === 'common' ? '基础组件' : '项目组件'}</span>
          ) : (
            <Select
              style={{ width: '90%' }}
              defaultValue={text}
              onChange={appsComTypeOnchange}
            >
              <Option value='common' key='common'>
                基础组件
              </Option>
              <Option value='project' key='project'>
                项目组件
              </Option>
            </Select>
          )}
        </>
      ),
    },
    {
      title: '所属项目',
      width: '240',
      dataIndex: 'projectsName',
      key: 'projectsName',
      render: (text, record) => {
        let projectsNameArr = [];
        projectsNameArr =
          text &&
          text.map((item) => {
            return {
              key: item,
            };
          });
        return (
          <>
            {record.update ? (
              <span>{text && text.join(',')}</span>
            ) : record.type === 'project' ? (
              <Select
                mode='multiple'
                labelInValue
                showSearch
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '90%' }}
                onChange={(value) => appsComProjectsOnchange(value, record)}
                defaultValue={projectsNameArr}
              >
                {projectsData.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
    {
      title: '组件分类',
      width: '10%',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
      render: (text, record) => (
        <>
          {record.update ? (
            <span>{text}</span>
          ) : (
            <TreeSelect
              labelInValue
              // style={{ width: '80%' }}
              dropdownStyle={{
                maxHeight: 300,
                overflow: 'auto',
                top: '30px',
                right: 0,
              }}
              onChange={appsComCategoryOnchange}
              getPopupContainer={(node) => {
                return node;
              }}
              dropdownClassName={styles.cwTreeSelect}
              treeData={componentClassifyTreeData.map((v, k) => {
                return {
                  title: v.name,
                  value: v.id,
                  key: k + '',
                  disabled: true,
                  children: v.children.map((v1, k1) => {
                    return {
                      title: v1.name,
                      value: JSON.stringify({
                        one: v,
                        two: v1.id,
                        three: record,
                      }),
                      key: k + '-' + k1,
                    };
                  }),
                };
              })}
              placeholder={text}
              treeDefaultExpandAll
              placement='topLeft'
            />
          )}
        </>
      ),
    },
  ];
  const handleSave = (row) => {
    if (!isComponent && comsInAppTableData.length > 0) {
      let newData = _.cloneDeep(toJS(importTableData));
      let newComsInAppTableData = _.cloneDeep(toJS(comsInAppTableData));
      newData.forEach((item) => {
        item.components.forEach((element) => {
          if (element.id === row.id) {
            element.name = row.name;
          }
        });
      });
      setImportTableData(newData);
      newComsInAppTableData.forEach((item) => {
        if (item.id === row.id) {
          item.name = row.name;
        }
      });
      setComsInAppTableData(newComsInAppTableData);
      let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
      selectedRowsCopy.forEach((item) => {
        item.components.forEach((element) => {
          if (element.id === row.id) {
            element.name = row.name;
          }
        });
      });
      setSelectedRows(selectedRowsCopy);
    } else {
      const newData = _.cloneDeep(toJS(importTableData));
      const index = newData.findIndex((item) => row.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setImportTableData(newData);
      if (selectedRows.some((item) => item.id === row.id)) {
        let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
        selectedRowsCopy.forEach((item) => {
          if (item.id === row.id) {
            item.name = row.name;
          }
        });
        setSelectedRows(selectedRowsCopy);
      }
    }
  };

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };
  const columns = (
    isComponent
      ? componentColumns
      : previouStepFlag
      ? AppColumns
      : componentsInApp
  ).map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <>
      {isAppHasComponent || previouStepFlag ? (
        <div style={{ position: 'relative' }}>
          <Form>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              rowKey={'id'}
              dataSource={importTableData}
              columns={columns}
              rowSelection={rowSelection}
              className={styles.importConfigTableStyle}
            />
            <span className={styles.importConfigSpan}>
              总共待导入{appOrComDispaly}
              {importTableData.length}个，已选中{importSelectedNum}个
            </span>
          </Form>
        </div>
      ) : (
        <Form>
          <div>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              rowKey={'id'}
              dataSource={comsInAppTableData}
              columns={columns}
              className={
                styles.importConfigTableStyle + ' ' + styles.comsInAppTable
              }
            />
          </div>
        </Form>
      )}
    </>
  );
});

export default ImportConfig;
