import React, { useEffect, useState, useRef } from 'react';
import {
  Input,
  Select,
  Form,
  Collapse,
  Menu,
  Popconfirm,
  Button,
  message,
  Checkbox,
  Icon,
  Row,
  Col,
  Table,
  Divider,
  Tag,
} from '@chaoswise/ui';
import { useIntl } from 'react-intl';
const { Option } = Select;
import { JSONEditor } from '@json-editor/json-editor';

import { toJS } from '@chaoswise/cw-mobx';
import styles from './assets/style.less';
const { Panel } = Collapse;
import { successCode } from '@/config/global';
import _ from 'lodash';
const { TextArea } = Input;
import jsoneditor from 'jsoneditor';
import store from './model';
import Http from './components/Http';
import Nomal from './components/nomal';
import mainStore from '@/pages/Data/DataManage/model';
export default Form.create({ name: 'FORM_IN_PROJECT_MODAL' })(
  function EditProjectModal() {
    const { saveData, dataUsability, changeData } = store;
    const { activeData } = mainStore;
    const [type, setType] = useState(); // 加载状态

    // const TypeArr = ['MySQL','HTTP', 'MariaDB', 'SqlServer','达梦','Oracle', 'Clickhouse', 'Postgres'];
    const TypeArr = ['MySQL', 'HTTP', 'Oracle', 'Clickhouse', 'Postgres'];
    const NOMRL = useRef(); //jsonedit实例
    useEffect(() => {
      // 编辑页挂载
      if (activeData && activeData.schemaType) {
        setType(activeData.schemaType);
      } else {
        setType('MySQL');
      }
    }, []);
    return (
      <div className={styles.newData}>
        <Collapse
          defaultActiveKey={['1', '2']}
          onChange={() => {}}
          bordered={false}
        >
          <Panel header={'数据源类型(' + type + ')'} key='1'>
            <div className={styles.typeContainer}>
              {TypeArr.map((item) => (
                <div
                  key={item}
                  style={{
                    backgroundColor:
                      type === item ? 'rgba(64, 169, 255,0.7)' : null,
                  }}
                  className={styles.typeItem}
                  onClick={() => {
                    if (
                      activeData &&
                      activeData.schemaType &&
                      item !== activeData.schemaType
                    ) {
                      message.error('编辑时无法修改数据源类型!');
                      return;
                    }
                    setType(item);
                    if (NOMRL.current) {
                      NOMRL.current.deleteAllRules();
                    }
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </Panel>
          <Panel header='数据源配置' key='2'>
            <div style={{ padding: '16px 0' }}>
              {type && type !== 'HTTP' && (
                <Nomal
                  ref1={NOMRL}
                  saveData={saveData}
                  dataUsability={dataUsability}
                  changeData={changeData}
                  type={type}
                  activeData={activeData}
                />
              )}
              {type && type == 'HTTP' && (
                <Http
                  saveData={saveData}
                  dataUsability={dataUsability}
                  changeData={changeData}
                  type={type}
                  activeData={activeData}
                />
              )}
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  }
);
