/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { AbreastLayout, Empty } from '@chaoswise/ui';
import { observer, toJS } from '@chaoswise/cw-mobx';
import store from './model/index';
import MenuStore from './components/handleMenu/model';
import _ from 'lodash';
import styles from './assets/style.less';
import HandleMenu from './components/handleMenu/index';
import HttpContainer from './components/HttpContainer';
import MongoDBContainer from './components/MongoDB';
import Normal from './components/normal';
import File from './components/File';
import Zabbix from './components/zabbix'
const ProjectDetail = observer((props) => {
  const{checkIndex}=MenuStore
  let {
    getTableList,
    tableList,
    bottomTable,
    activeContent,
    resetTableList,
    activeData,
    headerArr,
    setHeader,
    paramsArr,
    setParams,
    setActiveContent,
    resetAllData,
    setgetNewData,
    getNewData,
    tableId,
    resetBottomTable,
    getDetail,
  } = store; //自己存储数据
  const DatasourceId = props.match.params.id;
  useEffect(() => {
    if (DatasourceId) {
      getDetail({ datasourceId: DatasourceId }, (res) => {
        if (res && res.schemaType === 'HTTP') {
          let conentData = JSON.parse(toJS(res.connectData));
          setActiveContent({ ...conentData, datasourceId: DatasourceId });
          setHeader(conentData.header);
          setParams(conentData.params);
        }
        return () => {
          setActiveContent(null);
          resetTableList([]);
          resetBottomTable([]);
        };
      });
    }
  }, []);
  useEffect(() => {
    if (DatasourceId&&getNewData) {
      getDetail({ datasourceId: DatasourceId }, (res) => {
        if (res && res.schemaType === 'HTTP') {
          let conentData = JSON.parse(toJS(res.connectData));
          setActiveContent({ ...conentData, datasourceId: DatasourceId });
          setHeader(conentData.header);
          setParams(conentData.params);
          setgetNewData()
        }
      });
    }
  }, [getNewData]);
  //左侧树点击了/右侧修改了需要新请求右侧数据
  const treeChange = (tableName) => {
    getTableList(
      {
        tableName,
        schemaName: activeData.schemaName,
        schemaType: activeData.schemaType,
        datasourceId: activeData.datasourceId,
      },
      activeData.schemaType
    );
  };
  return (
    <div className={styles.dataDetailContainer}>
      <AbreastLayout
        type='leftOperationArea'
        SiderWidth={160}
        showCollapsedBtn={false}
        Siderbar={
          <div className={styles.leftWrap}>
            <div className={styles.treeWrap}>
              <HandleMenu
                type={activeData && activeData.schemaType}
                getTableList={getTableList}
                activeContent={activeContent}
                datasourceId={DatasourceId}
                resetData={resetAllData}
                onChange={treeChange}
              />
            </div>
          </div>
        }
      >
        <div className={styles.contentContainer}>
          {!activeContent && (
            <Empty description='无数据源' className={styles.noData} />
          )}
          { activeContent&&activeData && activeData.schemaType  === 'Zabbix' && (
            <Zabbix 
            activeContent={activeContent}
            activeData={activeData}
            onChange={treeChange}
            checkIndex={checkIndex}
            />
          )}
          {activeData && activeData.schemaType === 'File' && (
            <File
              activeContent={activeContent}
              tableList={tableList}
              tableId={tableId}
              activeData={activeData}
              onChange={treeChange}
              bottomTable={bottomTable}
            />
          )}
          {activeData &&
            activeData.schemaType === 'HTTP' &&
            MenuStore.treeList.length > 0 && (
              <HttpContainer
                activeContent={activeContent}
                activeData={activeData}
                resetData={activeContent}
                tableId={tableId}
                onChange={treeChange}
                headerArr={headerArr}
                paramsArr={paramsArr}
                setHeader={setHeader}
                setParams={setParams}
                setActiveContent={resetAllData}
              />
            )}
          {activeData && activeData.schemaType === 'Redis' && (
            <MongoDBContainer
              activeContent={activeContent}
              tableList={tableList}
              tableId={tableId}
              onChange={treeChange}
              bottomTable={bottomTable}
            />
          )}
          {DatasourceId &&
            !['File', 'HTTP', 'Redis'].includes(activeData.schemaType) && (
              <Normal bottomTable={bottomTable} tableList={tableList} />
            )}
        </div>
      </AbreastLayout>
    </div>
  );
});
export default ProjectDetail;
