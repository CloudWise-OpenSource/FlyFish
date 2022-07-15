/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { message } from '@chaoswise/ui';
import { observer, toJS } from '@chaoswise/cw-mobx';
import store from './model/index';
import ChooseDataSource from './components/ChooseDataSource';
import ChooseTable from './components/ChooseTable';
import Config from './components/Config';

const scheduleKeyMappings = {
  chooseDataSource: 'chooseDataSource',
  chooseDataSourceTable: 'chooseDataSourceTable',
  configDataSearch: 'configDataSearch',
};

const Create = observer(({ dataSearch, onChange, onSave }) => {
  const [scheduleKey, setScheduleKey] = useState(
    dataSearch.settingId > 0
      ? scheduleKeyMappings.configDataSearch
      : scheduleKeyMappings.chooseDataSource
  );
  return (
    <React.Fragment>
      {scheduleKey === scheduleKeyMappings.chooseDataSource && (
        <ChooseDataSource
          value={dataSearch.datasourceId}
          onChange={(datasourceId, dataSourceName, schemaName) => {
            if (dataSearch.datasourceId !== datasourceId) {
              dataSearch.tableName = '';
            }
            dataSearch.datasourceId = datasourceId;
            dataSearch.datasourceName = dataSourceName;
            dataSearch.schemaName = schemaName;
            onChange && onChange(dataSearch);
            setScheduleKey(scheduleKeyMappings.chooseDataSourceTable);
          }}
        />
      )}
      {scheduleKey === scheduleKeyMappings.chooseDataSourceTable && (
        <ChooseTable
          datasourceId={dataSearch.datasourceId}
          datasourceName={dataSearch.datasourceName}
          tableId={dataSearch.tableId}
          tableName={dataSearch.tableName}
          schemaName={dataSearch.schemaName}
          linkToChooseDataSource={() => {
            setScheduleKey(scheduleKeyMappings.chooseDataSource);
          }}
          onChange={(tableId, tableName, modelName) => {
            dataSearch.sql = `select * from \`${modelName}\`.\`${tableName}\``;
            dataSearch.tableId = tableId;
            dataSearch.tableName = tableName;
            onChange && onChange(dataSearch);
            setScheduleKey(scheduleKeyMappings.configDataSearch);
          }}
        />
      )}
      {scheduleKey === scheduleKeyMappings.configDataSearch && (
        <Config
          dataSearch={dataSearch}
          linkToChooseDataSource={() => {
            setScheduleKey(scheduleKeyMappings.chooseDataSource);
          }}
          linkToChooseTable={() => {
            setScheduleKey(scheduleKeyMappings.chooseDataSourceTable);
          }}
          onChange={(dataSearch) => {
            onChange && onChange(dataSearch);
          }}
          onSave={(dataSearch) => {
            onSave && onSave(dataSearch);
          }}
        />
      )}
    </React.Fragment>
  );
});
export default Create;
