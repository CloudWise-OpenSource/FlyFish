/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { observer, toJS, loadingStore } from '@chaoswise/cw-mobx';
import { Input, Empty, Breadcrumb, Tooltip } from '@chaoswise/ui';
import store from './model/index';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './assets/style.less';
import tableSvg from './assets/imgs/grid.svg';
import Loading from '@/components/Loading';
import DetailTitleBox from '@/components/Layouts/DetailTitleBox';

const { Search } = Input;

const ChooseTable = observer(
  ({
    tableId,
    onChange,
    datasourceId,
    datasourceName,
    schemaName,
    linkToChooseDataSource,
  }) => {
    const intl = useIntl();
    const { getTableList, setTableQuery } = store;
    const tableQuery = toJS(store.tableQuery);
    const tableList = toJS(store.tableList);
    const loading =
      loadingStore.loading[
        'DataSearchDetail_ChooseDataSourceTable/getTableList'
      ];

    useEffect(() => {
      getTableList({ datasourceId });
      return () => {
        setTableQuery('');
      };
    }, [datasourceId]);

    const showTableList =
      tableQuery == null || tableQuery === ''
        ? tableList
        : tableList.filter(
            (i) =>
              i.tableName &&
              i.tableName
                .toLocaleLowerCase()
                .indexOf(tableQuery.toLocaleLowerCase()) !== -1
          );

    if (loading) {
      return <Loading />;
    }
    return (
      <div className={styles.chooseTable}>
        <div className={styles.header}>
          <div className={styles.headerSearchBox}>
            <Search
              value={tableQuery}
              placeholder={'请输入名称进行搜索'}
              style={{ width: '200px' }}
              onChange={(e) => setTableQuery(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentBreadcrumb}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Tooltip title={datasourceName}>
                  <span
                    className={styles.contentBreadcrumbItem}
                    onClick={() =>
                      linkToChooseDataSource && linkToChooseDataSource()
                    }
                  >
                    {datasourceName}
                  </span>
                </Tooltip>
              </Breadcrumb.Item>
              {schemaName ? (
                <Breadcrumb.Item>
                  <Tooltip title={schemaName}>
                    <span
                      className={styles.contentBreadcrumbItem}
                      onClick={() =>
                        linkToChooseDataSource && linkToChooseDataSource()
                      }
                    >
                      {schemaName}
                    </span>
                  </Tooltip>
                </Breadcrumb.Item>
              ) : (
                ''
              )}
              <Breadcrumb.Item>
                <span className={styles.contentBreadcrumbItem}>
                  {intl.formatMessage({
                    id: 'pages.dataSearch.detail.chooseTable',
                    defaultValue: '选择数据表',
                  })}
                </span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <DetailTitleBox
            title={`${intl.formatMessage({
              id: 'pages.dataSearch.detail.chooseTable',
              defaultValue: '选择数据表',
            })}`}
          ></DetailTitleBox>
          <div className={styles.tableList}>
            {!showTableList || showTableList.length === 0 ? (
              <div className={styles.noTableList}>
                <Empty
                  description={intl.formatMessage({
                    id: 'pages.dataSearch.detail.noTable',
                    defaultValue: '暂无数据表',
                  })}
                />
              </div>
            ) : (
              ''
            )}
            {showTableList &&
              showTableList.length > 0 &&
              showTableList.map((tableItem, index) => {
                return (
                  <div
                    className={`${styles.tableItem} ${
                      tableId === tableItem.tableId
                        ? styles.tableItemActive
                        : ''
                    }`}
                    onClick={() => {
                      onChange &&
                        onChange(
                          tableItem.tableId,
                          tableItem.tableName,
                          tableItem.modelName
                        );
                    }}
                    key={`tableItem-${tableItem.tableId}-${index}`}
                  >
                    <span className={styles.tableItemIconWrap}>
                      <img className={styles.tableItemIcon} src={tableSvg} />
                    </span>
                    <Tooltip
                      className={styles.tableItemName}
                      title={tableItem.tableName}
                    >
                      {tableItem.tableName}
                    </Tooltip>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
);
export default ChooseTable;
