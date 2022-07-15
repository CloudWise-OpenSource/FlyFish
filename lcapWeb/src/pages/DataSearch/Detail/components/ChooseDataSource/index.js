/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { observer, toJS, loadingStore } from '@chaoswise/cw-mobx';
import { Input, Empty, Tooltip } from '@chaoswise/ui';
import store from './model/index';
import { useIntl } from 'react-intl';
import styles from './assets/style.less';
import Loading from '@/components/Loading';
import DetailTitleBox from '@/components/Layouts/DetailTitleBox';
const { Search } = Input;

const ChooseDataSource = observer(({ value, onChange }) => {
  const intl = useIntl();
  const { getDataSourceList, setDataSourceQuery } = store;
  const dataSourceQuery = toJS(store.dataSourceQuery);
  const dataSourceList = toJS(store.dataSourceList);
  const loading =
    loadingStore.loading[
      'DataSearchDetail_ChooseDataSourceTable/getDataSourceList'
    ];

  useEffect(() => {
    getDataSourceList();
    return () => {
      setDataSourceQuery('');
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  const showDataSourceList =
    dataSourceQuery == null || dataSourceQuery === ''
      ? dataSourceList
      : dataSourceList.filter(
          (i) =>
            i.datasourceName && i.datasourceName.indexOf(dataSourceQuery) !== -1
        );

  return (
    <div className={styles.chooseDataSource}>
      <div className={styles.header}>
        <div className={styles.headerSearchBox}>
          <Search
            value={dataSourceQuery}
            style={{ width: '200px' }}
            placeholder={'请输入名称进行搜索'}
            onChange={(e) => setDataSourceQuery(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.content}>
        <DetailTitleBox
          title={`${intl.formatMessage({
            id: 'pages.dataSearch.detail.chooseDataSource',
            defaultValue: '选择数据源',
          })}`}
        ></DetailTitleBox>

        <div className={styles.dataSourceList}>
          {!showDataSourceList || showDataSourceList.length === 0 ? (
            <div className={styles.noDataSourceList}>
              <Empty
                description={intl.formatMessage({
                  id: 'pages.dataSearch.detail.noDataSource',
                  defaultValue: '暂无数据源',
                })}
              />
            </div>
          ) : (
            ''
          )}
          {showDataSourceList &&
            showDataSourceList.length > 0 &&
            showDataSourceList.map((dataSourceItem, index) => {
              return (
                <div
                  className={`${styles.dataSourceItem} ${
                    value && value === dataSourceItem.datasourceId
                      ? styles.dataSourceItemActive
                      : ''
                  }`}
                  onClick={() => {
                    onChange &&
                      onChange(
                        dataSourceItem.datasourceId,
                        dataSourceItem.datasourceName,
                        dataSourceItem.schemaName
                      );
                  }}
                  key={`dataSourceItem-${dataSourceItem.datasourceId}-${index}`}
                >
                  <Tooltip title={dataSourceItem.datasourceName}>
                    {dataSourceItem.datasourceName}
                  </Tooltip>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
});
export default ChooseDataSource;
