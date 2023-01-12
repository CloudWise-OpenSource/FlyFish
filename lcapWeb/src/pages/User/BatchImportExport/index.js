import React, { useState, useEffect, useRef } from 'react';
import styles from './assets/style.less';
import { observer, toJS } from '@chaoswise/cw-mobx';
import store from './model/index';
import { Button } from '@chaoswise/ui';
import globalStore from '@/stores/globalStore';

const BatchImportExport = observer((props) => {
  const { lastExportIsEnd } = store;
  const {
    getComponentClassifyTreeData,
    getProjectsData,
    checkLastImportResource,
  } = store;
  const { progressNum } = globalStore;

  useEffect(() => {
    getComponentClassifyTreeData();
    getProjectsData();
  }, []);

  return (
    <div className={styles.batchImportExport}>
      <Button
        type='primary'
        onClick={() => {
          if (progressNum === 0 || progressNum === 100) {
            props.history.push({
              pathname: `/user/batchExport/batch-import-export`,
              state: { name: '批量导出' },
            });
          } else {
            props.history.push({
              pathname: `/user/exportSuccess/batch-import-export`,
              state: { name: '导出成功' },
            });
          }
        }}
      >
        导出资源
      </Button>
      <Button
        type='primary'
        onClick={() => {
          checkLastImportResource()
          props.history.push({
            pathname: `/user/bulkImport/batch-import-export`,
            state: { name: '批量导入' },
          });
        }}
      >
        导入资源
      </Button>
    </div>
  );
});

export default BatchImportExport;
