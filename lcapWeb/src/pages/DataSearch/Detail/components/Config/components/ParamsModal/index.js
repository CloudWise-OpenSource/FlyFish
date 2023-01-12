import React, { useEffect, useState } from 'react';
import {
  Modal,
  CWTable,
  Input,
  Select,
  DatePicker,
  message,
  Alert,
  Icon,
  Popconfirm,
  InputNumber,
} from '@chaoswise/ui';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './style.less';
import _ from 'lodash';
import moment from 'moment';
import InputEnter from './components/InputEnter';
import NameInput from './components/NameInput';
import DescriptionInput from './components/DescriptionInput';

const PARAM_TYPE_MAPPING = {
  text: {
    id: 0,
    name: '文本',
    key: 'text',
    paramSetting: {
      default: '',
    },
  },
  textEnums: {
    id: 1,
    name: '枚举列表（文本）',
    key: 'textEnums',
    paramSetting: {
      default: '',
      selections: [],
    },
  },
  date: {
    id: 2,
    name: '时间',
    key: 'date',
    paramSetting: {
      default: '',
      format: 'YYYY/MM/DD',
    },
  },
  number: {
    id: 3,
    name: '数字',
    key: 'number',
    paramSetting: {
      default: '',
    },
  },
};

const PARAM_TYPES = [
  PARAM_TYPE_MAPPING.text,
  PARAM_TYPE_MAPPING.number,
  PARAM_TYPE_MAPPING.textEnums,
  PARAM_TYPE_MAPPING.date,
];

const NEW_PARAMS = {
  name: '',
  paramType: PARAM_TYPE_MAPPING.text.id,
  default: '',
  description: '',
};

const PARAM_DATE_FORMAT_TIME = moment('2022-01-25 9:23:49');
const PARAM_DATE_FORMATS = [
  {
    key: 'YYYY/MM/DD',
    name: PARAM_DATE_FORMAT_TIME.format('YYYY/MM/DD'),
  },
  {
    key: 'YYYY/MM/DD HH:mm',
    name: PARAM_DATE_FORMAT_TIME.format('YYYY/MM/DD HH:mm'),
  },
  {
    key: 'YYYY-MM-DD',
    name: PARAM_DATE_FORMAT_TIME.format('YYYY-MM-DD'),
  },
  {
    key: 'YYYY-MM-DD HH:mm',
    name: PARAM_DATE_FORMAT_TIME.format('YYYY-MM-DD HH:mm'),
  },
  {
    key: 'MM-DD',
    name: PARAM_DATE_FORMAT_TIME.format('MM-DD'),
  },
  {
    key: 'MM/DD/YYYY',
    name: PARAM_DATE_FORMAT_TIME.format('MM/DD/YYYY'),
  },
  {
    key: 'X',
    name: '时间戳（秒）',
  },
  {
    key: 'x',
    name: '时间戳（毫秒）',
  },
];

export default ({ dataSearch = {}, onOk, onCancel }) => {
  const intl = useIntl();
  const [params, setParams] = useState([]);

  useEffect(() => {
    const oldParams = dataSearch.setting ? dataSearch.setting.params : [];
    let newParams = Array.isArray(oldParams) ? _.cloneDeep(oldParams) : [];
    const sql = dataSearch.sql || '';
    const matchParams = sql.match(/\{\{\w+\}\}/g) || [];
    if (matchParams && Array.isArray(matchParams)) {
      for (let i = 0; i < matchParams.length; i++) {
        const matchParam = matchParams[i];
        const realMatchPatam = matchParam.slice(2, matchParam.length - 2);
        if (newParams.every((p) => p.name !== realMatchPatam)) {
          newParams.push(
            Object.assign(_.cloneDeep(NEW_PARAMS), {
              name: realMatchPatam,
            })
          );
        }
      }
    }
    newParams = newParams.map((p) => {
      let newP = _.clone(p);
      newP._id = Math.ceil(Math.random() * 10000) + new Date().getTime();
      return newP;
    });
    setParams(newParams);
    return () => {
      setParams([]);
    };
  }, [dataSearch]);

  const columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: '20%',
      key: 'name',
      render: (text, record, index) => {
        return (
          <NameInput
            value={text}
            maxlength={50}
            onBlur={(val) => {
              params[index].name = val;
              setParams(params.concat([]));
            }}
            placeholder={'请输入参数名称！'}
          />
        );
      },
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
      width: '30%',
      key: 'paramType',
      render: (paramType, record, index) => {
        return (
          <div className={styles.paramTypeContent}>
            <Select
              value={paramType}
              onChange={(val) => {
                const target = PARAM_TYPES.find((t) => t.id === val);
                if (target) {
                  params[index].paramType = val;
                  params[index] = {
                    ..._.cloneDeep(target.paramSetting),
                    name: params[index].name,
                    paramType: params[index].paramType,
                    description: params[index].description,
                  };
                  setParams(params.concat([]));
                }
              }}
            >
              {PARAM_TYPES.map((PARAM_TYPE) => {
                return (
                  <Select.Option key={PARAM_TYPE.key} value={PARAM_TYPE.id}>
                    {PARAM_TYPE.name}
                  </Select.Option>
                );
              })}
            </Select>
            {paramType === PARAM_TYPE_MAPPING.textEnums.id && (
              <InputEnter
                validValue={(val) => {
                  if (record.selections) {
                    if (record.selections.some((s) => s === val)) {
                      message.error('此选项已存在，请修改后再添加！');
                      return false;
                    }
                  }
                  return true;
                }}
                onPressEnter={(val) => {
                  record.selections = record.selections || [];
                  record.selections.push(val);
                  params[index].selections = record.selections;
                  setParams(params.concat([]));
                }}
                placeholder={'请添加选项！'}
              />
            )}
            {paramType === PARAM_TYPE_MAPPING.date.id && (
              <Select
                value={record.format}
                onChange={(val) => {
                  if (params[index].default) {
                    params[index].default = moment(
                      params[index].default,
                      params[index].format
                    ).format(val);
                  }
                  params[index].format = val;
                  setParams(params.concat([]));
                }}
              >
                {PARAM_DATE_FORMATS.map((PARAM_DATE_FORMAT) => {
                  return (
                    <Select.Option
                      key={PARAM_DATE_FORMAT.key}
                      value={PARAM_DATE_FORMAT.key}
                    >
                      {PARAM_DATE_FORMAT.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </div>
        );
      },
    },
    {
      title: '默认值',
      dataIndex: 'default',
      width: '20%',
      key: 'default',
      render: (text, record, index) => {
        if (record.paramType === PARAM_TYPE_MAPPING.text.id) {
          return (
            <Input
              defaultValue={text}
              maxlength={30}
              onBlur={(e) => {
                params[index].default = e.target.value;
                setParams(params.concat([]));
              }}
              placeholder={'请输入默认值！'}
            />
          );
        } else if (record.paramType === PARAM_TYPE_MAPPING.number.id) {
          return (
            <InputNumber
              defaultValue={text}
              style={{ width: '100%' }}
              onBlur={(e) => {
                params[index].default = e.target.value;
                setParams(params.concat([]));
              }}
              placeholder={'请输入默认值！'}
            />
          );
        } else if (record.paramType === PARAM_TYPE_MAPPING.textEnums.id) {
          return (
            <Select
              style={{ width: '100%' }}
              value={text ? text : undefined}
              placeholder={'请选择默认值！'}
              onChange={(val) => {
                params[index].default = val;
                setParams(params.concat([]));
              }}
            >
              {record.selections &&
                record.selections.map((selection, index) => {
                  return (
                    <Select.Option key={index} value={selection}>
                      {selection}
                    </Select.Option>
                  );
                })}
            </Select>
          );
        } else if (record.paramType === PARAM_TYPE_MAPPING.date.id) {
          return (
            <DatePicker
              style={{ width: '100%' }}
              showTime={
                record.format &&
                (record.format.includes('HH') ||
                  record.format.includes('hh') ||
                  record.format === 'x' ||
                  record.format === 'X')
                  ? { format: 'HH:mm:ss' }
                  : false
              }
              value={text ? moment(text, record.format) : undefined}
              placeholder={'请选择时间！'}
              format={record.format}
              onChange={(val) => {
                params[index].default = val
                  ? moment(val).format(record.format)
                  : '';
                setParams(params.concat([]));
              }}
              onOk={(val) => {
                params[index].default = val
                  ? moment(val).format(record.format)
                  : '';
                setParams(params.concat([]));
              }}
            />
          );
        }
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '20%',
      key: 'description',
      render: (text, record, index) => {
        return (
          <DescriptionInput
            value={text}
            maxlength={60}
            onBlur={(value) => {
              params[index].description = value;
              setParams(params.concat([]));
            }}
            placeholder={'请输入参数描述！'}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '10%',
      key: 'action',
      render: (text, record, index) => {
        return (
          <Popconfirm
            title='确定删除?'
            onConfirm={() => {
              setParams(params.filter((p, i) => i !== index));
            }}
            okText='确认'
            cancelText='取消'
          >
            <a className={styles.tableAction}>
              <FormattedMessage id='common.delete' defaultValue='删除' />
            </a>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <Modal
      onCancel={() => onCancel && onCancel()}
      onOk={() => {
        const sql = dataSearch.sql || '';
        const matchParams = sql.match(/\{\{\w+\}\}/g) || [];
        const deficiencyParam = matchParams.filter((matchParam) => {
          const realMatchPatam = matchParam.slice(2, matchParam.length - 2);
          return params.every((p) => p.name !== realMatchPatam);
        });
        if (deficiencyParam.length > 0) {
          return message.error(
            `参数${deficiencyParam.join(',')}缺失，请添加后再确定！`
          );
        }
        let isValid = true;
        for (let i = 0; i < params.length; i++) {
          const param = params[i];
          if (param.name == null || param.name === '') {
            isValid = false;
            message.error(`第${i + 1}项参数未添加参数名称！`);
            break;
          }
          if (
            params.some(
              (p, innerIndex) => innerIndex !== i && p.name === param.name
            )
          ) {
            isValid = false;
            message.error(`${param.name}参数名称重复！`);
            break;
          }
        }
        if (params.length > 10) {
          isValid = false;
          message.error(`最多可设置十个参数！`);
        }
        if (!isValid) {
          return;
        }
        onOk &&
          onOk(
            params.map((param) => {
              delete param._id;
              return param;
            })
          );
      }}
      title={intl.formatMessage({
        id: 'pages.dataSearch.detail.sqlParams',
        defaultValue: '设置参数',
      })}
      width={'65vw'}
      visible
    >
      <div className={styles.componentParamsModal}>
        <div className={styles.infoContent}>
          <Alert
            message={
              <div className={styles.info}>
                <p className={styles.infoNormal}>
                  {
                    '注：在sql中手写参数，参数请使用：{{  }} 格式，我们会自动解析到表格中，设置好后，数据查询集的参数可以在组件中被使用。'
                  }
                </p>
                <p className={styles.infoBlob}>
                  {`示例："SELECT * FROM TABLE_A WHERE param1 = {{name}} AND param2 = {{age}}"`}
                </p>
                <p className={styles.infoBlob}>{`提取参数结果为 name 、age`}</p>
              </div>
            }
            type='info'
            showIcon
          />
        </div>
        <div className={styles.content}>
          <CWTable
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={params}
          ></CWTable>
        </div>
        <div className={styles.actionContent}>
          <div
            className={styles.action}
            onClick={() => {
              if (params.length === 10) {
                return message.info('最多可新增十个参数！');
              }
              setParams(
                params.concat([
                  {
                    _id:
                      Math.ceil(Math.random() * 10000) + new Date().getTime(),
                    ..._.cloneDeep(NEW_PARAMS),
                  },
                ])
              );
            }}
          >
            <Icon type='diff' className={styles.actionIcon} /> 添加参数
          </div>
        </div>
      </div>
    </Modal>
  );
};
