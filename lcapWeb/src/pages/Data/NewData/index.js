import React, { useEffect, useState, useRef } from 'react';
import { Form, Collapse, message } from '@chaoswise/ui';
import styles from './assets/style.less';
const { Panel } = Collapse;
import _ from 'lodash';
import store from './model';
import Http from './components/Http';
import Nomal from './components/nomal';
import MySQL from './assets/imgs/mysql.svg';
import Zabbix from './assets/imgs/zabbix.svg';
import ClickHouse from './assets/imgs/clickhouse.svg';
import DM from './assets/imgs/DM.svg';
import File from './assets/imgs/file.svg';
import HTTP from './assets/imgs/http.svg';
import MariaDB from './assets/imgs/MariaDB.svg';
import MongoDB from './assets/imgs/mongodb.svg';
import Oracle from './assets/imgs/oracle.svg';
import Postgres from './assets/imgs/postgres.svg';
import Redis from './assets/imgs/redis.svg';
import SqlServer from './assets/imgs/SqlServer.svg';
import enums from '@/utils/enums.js';
const icons = {
  MySQL,
  ClickHouse,
  DM,
  HTTP,
  MariaDB,
  Oracle,
  Postgres,
  SqlServer,
};

export default Form.create({ name: 'FORM_IN_PROJECT_MODAL' })(
  function EditProjectModal(props) {
    const {
      saveData,
      dataUsability,
      changeData,
      getDataDetail,
      setdataDetail,
      dataDetail,
    } = store;
    const [type, setType] = useState(); // 加载状态
    const [dataType, setDataType] = useState({}); // 加载状态
    // const TypeArr = ['MySQL', 'MongoDB', 'Redis', 'Postgres', 'File', 'HTTP', 'Zabbix', 'ClickHouse', 'MariaDB', 'SqlServer', '达梦', 'Oracle'];
    const NOMRL = useRef(); //jsonedit实例
    useEffect(() => {
      if (props.location.pathname.split('/').length > 3) {
        let changeId = props.location.pathname.split('/')[2];
        getDataDetail(changeId, (data) => {
          const { schemaType } = data;
          setDataType({ [schemaType]: schemaType });
          setType(schemaType);
        });
      } else {
        setdataDetail(null);
        setDataType(enums);
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
          <Panel header={'数据源类型(' + dataType[type] + ')'} key='1'>
            <div className={styles.typeContainer}>
              {Object.keys(dataType).map((item) => (
                <div
                  key={item}
                  className={
                    type === item ? styles.typeItemActive : styles.typeItem
                  }
                  onClick={() => {
                    if (type === item) return;
                    setType(item);
                    if (NOMRL.current) {
                      NOMRL.current.deleteAllRules();
                    }
                  }}
                >
                  <img src={icons[item]} />
                  <span>{enums[item]}</span>
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
                  activeData={dataDetail}
                />
              )}
              {type && type == 'HTTP' && (
                <Http
                  saveData={saveData}
                  dataUsability={dataUsability}
                  changeData={changeData}
                  type={type}
                  activeData={dataDetail}
                />
              )}
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  }
);
