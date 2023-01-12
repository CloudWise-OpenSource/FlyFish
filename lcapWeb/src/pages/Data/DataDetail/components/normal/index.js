
import React from 'react';
import styles from './index.less';
import { observer, loadingStore } from "@chaoswise/cw-mobx";
import _ from "lodash";
import { Button, Table, message, Skeleton, Tooltip, Collapse } from "@chaoswise/ui";
const { Panel } = Collapse;
import MenuStore from '../handleMenu/model';
import LongTable from '@/pages/Data/components/LongTable';
const HandleMenu = observer(({ bottomTable, tableList
}) => {
  const { checkIndex, resetTreeList } = MenuStore;

  const loading = loadingStore.loading["DataDetailStore/getTableList"];
  const columns = [
    {
      title: '字段',
      dataIndex: 'name',
      key: 'name',
      width: '50%'
    },
    {
      title: '数据类型',
      dataIndex: 'value',
      key: 'value', align: 'left'
    },
  ];
  return (
    <div >
      {
        !loading && tableList && tableList.length > 0 && <>
          <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            className="site-collapse-custom-collapse"
          >
            <Panel header={"数据表字段"} key="1" style={{ border: 'none' }}>
              <Table dataSource={[...tableList]} columns={columns} pagination={false}
               scroll={{ y: '24vh' }}
              rowKey={(record) => record.name} style={{marginTop:'12px'}} />
            </Panel>
          </Collapse>
          <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            className="site-collapse-custom-collapse"
          >
            <Panel header='数据预览' key="1" style={{ border: 'none' }}>
              <LongTable columns={tableList} data={bottomTable}  />

            </Panel>
          </Collapse>
        </>
      }
      {
        loading && <Skeleton active paragraph={{ rows: 12 }} />
      }

    </div>
  );

});

export default HandleMenu;