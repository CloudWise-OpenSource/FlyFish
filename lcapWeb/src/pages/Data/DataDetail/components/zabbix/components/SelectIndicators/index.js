
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { useIntl } from "react-intl";
import { observer, toJS } from "@chaoswise/cw-mobx";
import { Button, message, Collapse, Icon, Tooltip, Table, Form, Radio, Select } from "@chaoswise/ui";
const { Option } = Select;
import store from './model'
const Panel = Collapse.Panel;
import _ from "lodash";
export default Form.create({ name: 'FORM_IN_PROJECT_MODAL' })(
  function EditProjectModal({ form, exampleData = {}, fields = [] }) {
    const [clomes1, setClomes1] = useState([])
    useEffect(() => {
      if (exampleData.clomes) {
        setClomes1(toJS(exampleData.clomes).map(item => {
          return {
            ...item,
            width: 200,
            render: (text) => {
              return (
                  <Tooltip title={text}>
                    <span className={styles.TableTopTitle}>{text}</span>
                  </Tooltip>

              );
            },
          }
        }))
      }
    }, [exampleData])
    const columns = [
      {
        title: '字段类型',
        dataIndex: 'fieldName',
        key: 'fieldName'

      },
      {
        title: '类型',
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
      }
    ];
    return (
      <div className={styles.zabbixContainer}>
        <Collapse
          defaultActiveKey={['1']}
          bordered={false}
        >
          <Panel header='字段列表' key='1' style={{ border: 'none' }}>
            {
              <Table columns={columns} dataSource={fields} pagination={false} scroll={{
                y: '300px'
              }}/>
            }
          </Panel>
        </Collapse>
        <Collapse
          defaultActiveKey={['1']}
          bordered={false}
        >
          <Panel header='数据预览' key='1' style={{ border: 'none' }}>
            <div className={styles.tooltipTitle}>注:仅展示最近20条数据</div>
            {
             exampleData?.data&&exampleData?.data.length>0&& <Table columns={clomes1 || []} dataSource={exampleData?.data || []} pagination={false}
              scroll={{
                x: clomes1.length * 200,
                y: '300px'
              }}
            />
            }
          </Panel>
        </Collapse>
      </div>
    );
  }
);
