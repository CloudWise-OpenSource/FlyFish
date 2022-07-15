
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import _ from "lodash";
import { Button, Table, message, Skeleton, Tooltip, Upload, Collapse } from "@chaoswise/ui";
const { Panel } = Collapse;
import MenuStore from '../handleMenu/model';
import store from './model';
import { successCode } from "@/config/global";
import TreeStore from '../handleMenu/model';
import UploadModal from './components/uploadModal';
import LongTable from '@/pages/Data/components/LongTable';
const FileContainer = observer(({ activeContent, bottomTable, tableList, tableId, activeData, onChange
}) => {
  const { uploadVisiable, setUploadVisiable, activeItem } = store;
  const { getTreeList } = TreeStore;
  const loading = loadingStore.loading["DataDetailStore/getTableList"];
  const uploadLoading = loadingStore.loading["HandelMenuStore/changeOutside"];
  const saveOne = () => {
    getTreeList({
      datasourceId: activeData.datasourceId
    }, (data) => {
      if (data && data.length > 0) {
        onChange(data[0].tableName);
      }
    });
  };
  const columns = [
    {
      title: '字段',
      dataIndex: 'name',
      key: 'name',
      width:'50%'
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
            <Panel header={MenuStore.editName} key="1" style={{ border: 'none' }}>
              <Table dataSource={tableList} columns={columns} pagination={false} rowKey='name' style={{marginTop:'14px'}} />
            </Panel>
          </Collapse>
          <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            className="site-collapse-custom-collapse"
          >
            <Panel header='数据预览' key="1" style={{ border: 'none' }}>
            <LongTable columns={tableList} data={bottomTable} />
            </Panel>
          </Collapse>

        </>
      }
      {
        loading && <Skeleton active paragraph={{ rows: 12 }} />
      }

      {uploadVisiable && <UploadModal onCancel={setUploadVisiable} onSave={saveOne} activeItem={activeItem} datasourceId={activeData.datasourceId} />}



    </div >
  );

});

export default FileContainer; 