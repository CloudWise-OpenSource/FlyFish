/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { observer, toJS } from '@chaoswise/cw-mobx';
import { Breadcrumb, Button, Ace, message, Tooltip } from '@chaoswise/ui';
import '@chaoswise/ace/ace-builds/src-noconflict/mode-sql';
import '@chaoswise/ace/ace-builds/src-noconflict/mode-mysql';
import '@chaoswise/ace/ace-builds/src-noconflict/theme-tomorrow';
import '@chaoswise/ace/ace-builds/src-noconflict/ext-language_tools';
import store from './model/index';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './assets/style.less';
import ComponentList from './components/ComponentList';
import ComponentPreview from './components/ComponentPreview';
import ComponentSetting from './components/ComponentSetting';
import { successCode } from '@/config/global';
import EidtModal from './components/EditModal';
import TablePreview from './components/TablePreview';
import { getQueryDataListService } from './services';

let GET_QUERY_DATALIST_SERVICE_INSTANCE = null;

const Config = observer(
  ({
    dataSearch,
    onChange,
    onSave,
    linkToChooseDataSource,
    linkToChooseTable,
  }) => {
    const [isSaveModalVisible, setSaveModalVisible] = useState(false);
    const [isDataLoading, setDataLoading] = useState(false);
    const intl = useIntl();
    const queryData = toJS(store.queryData);
    const isChooseComponentVisible = toJS(store.isChooseComponentVisible);
    const isComponentSettingVisible = toJS(store.isComponentSettingVisible);
    const componentList = toJS(store.componentList);
    const activeComponent = toJS(store.activeComponent);
    const activeComponentDataConfig = toJS(store.activeComponentDataConfig);
    const previewRef = useRef();
    const dataSettingRef = useRef();

    useEffect(() => {
      if (componentList.length === 0) {
        store.getComponentList();
      }
    }, []);

    useEffect(() => {
      // if (dataSearch.datasourceId && dataSearch.sql) {
      //   store.getQueryDataList(
      //     {
      //       datasourceId: dataSearch.datasourceId,
      //       sql: dataSearch.sql,
      //     },
      //     (res) => {
      //       if (res.code === successCode) {
      //         // eslint-disable-next-line max-nested-callbacks
      //         setTimeout(() => {
      //           if (previewRef.current) {
      //             previewRef.current.generateScreen();
      //           }
      //         }, 0);
      //       }
      //     }
      //   );
      // }
      return () => {
        store.reset();
      };
    }, []);

    const runOrPageChanged = (pageNo, pageSize) => {
      if (!dataSearch.sql) {
        return message.info(
          intl.formatMessage({
            id: 'pages.dataSearch.detail.pleaseInputSql',
            defaultValue: '请输入sql语句',
          })
        );
      }
      if (pageNo == null) {
        setDataLoading(true);
      }
      GET_QUERY_DATALIST_SERVICE_INSTANCE = getQueryDataListService({
        datasourceId: dataSearch.datasourceId,
        sql: dataSearch.sql,
        pageNo: pageNo || 1,
        pageSize: pageSize || 10,
      }).then(
        (res) => {
          setDataLoading(false);
          GET_QUERY_DATALIST_SERVICE_INSTANCE = null;
          if (res.code === successCode && res.data) {
            const data = res.data.data;
            let isDataValid = true;
            if (data == null || data === '') {
              isDataValid = false;
            } else if (Array.isArray(data)) {
              if (data.length === 0) {
                isDataValid = false;
              } else if (
                data.length === 1 &&
                Object.keys(data[0]).length === 0
              ) {
                isDataValid = false;
              }
            }
            if (!isDataValid) {
              return message.info(
                intl.formatMessage({
                  id: 'pages.dataSearch.detail.searchSqlEmpty',
                  defaultValue: '当前查询结果为空！',
                })
              );
            }

            setTimeout(() => {
              store.setQueryDataList(data, {
                pageNo: res.data.pageNo,
                pageSize: res.data.pageSize,
                total: res.data.total,
              });
              setTimeout(() => {
                if (previewRef.current) {
                  previewRef.current.generateScreen();
                }
                if (isComponentSettingVisible) {
                  if (dataSettingRef.current) {
                    dataSettingRef.current.generateScreen();
                  }
                }
              }, 0);
            }, 500);
          } else {
            message.error(
              res.msg ||
                intl.formatMessage({
                  id: 'pages.dataSearch.detail.searchSqlError',
                  defaultValue: '执行sql失败，请检查sql书写是否正确！',
                })
            );
          }
        },
        (res) => {
          setDataLoading(false);
          GET_QUERY_DATALIST_SERVICE_INSTANCE = null;
          message.error(
            res.msg ||
              intl.formatMessage({
                id: 'pages.dataSearch.detail.searchSqlError',
                defaultValue: '执行sql失败，请检查sql书写是否正确！',
              })
          );
        }
      );
    };

    const completers = [
      {
        name: dataSearch.tableName,
        value: `\`${dataSearch.tableId}\``,
        score: 100,
        meta: '表',
      },
    ];

    const onAceEditorLoaded = (editor) => {
      editor.completers &&
        editor.completers.push({
          getCompletions: function (editors, session, pos, prefix, callback) {
            callback(null, completers);
          },
        });
    };

    return (
      <div className={styles.Config}>
        <div className={styles.header}>
          <div className={styles.headerBreadcrumb}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Tooltip title={dataSearch.datasourceName}>
                  <span
                    className={styles.headerBreadcrumbItem}
                    onClick={() =>
                      linkToChooseDataSource && linkToChooseDataSource()
                    }
                  >
                    {dataSearch.datasourceName}
                  </span>
                </Tooltip>
              </Breadcrumb.Item>
              {dataSearch.schemaName ? (
                <Breadcrumb.Item>
                  <Tooltip title={dataSearch.schemaName}>
                    <span
                      className={styles.headerBreadcrumbItem}
                      onClick={() =>
                        linkToChooseDataSource && linkToChooseDataSource()
                      }
                    >
                      {dataSearch.schemaName}
                    </span>
                  </Tooltip>
                </Breadcrumb.Item>
              ) : (
                ''
              )}
              <Breadcrumb.Item>
                <Tooltip title={dataSearch.tableName}>
                  <span
                    className={styles.headerBreadcrumbItem}
                    onClick={() => linkToChooseTable && linkToChooseTable()}
                  >
                    {dataSearch.tableName}
                  </span>
                </Tooltip>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span className={styles.headerBreadcrumbItem}>
                  {intl.formatMessage({
                    id: 'pages.dataSearch.detail.configDataSearch',
                    defaultValue: '配置查询',
                  })}
                </span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className={styles.headerActions}>
            <Button
              type='primary'
              onClick={() => {
                if (!dataSearch.sql) {
                  return message.info(
                    intl.formatMessage({
                      id: 'pages.dataSearch.detail.pleaseInputSql',
                      defaultValue: '请输入sql语句',
                    })
                  );
                }
                setSaveModalVisible(true);
              }}
            >
              <FormattedMessage id='common.save' defaultValue='保存' />
            </Button>
          </div>
        </div>
        <div className={styles.content}>
          {isChooseComponentVisible || isComponentSettingVisible ? (
            <div className={styles.contentLeft}>
              {isChooseComponentVisible && (
                <ComponentList
                  componentList={componentList}
                  activeComponent={activeComponent}
                  onActiveComponentChanged={(component) => {
                    store.setActiveComponent(component);
                    store.setComponentSettingVisible(true);
                  }}
                />
              )}
              {isComponentSettingVisible && (
                <ComponentSetting
                  ref={dataSettingRef}
                  activeComponent={activeComponent}
                  data={queryData}
                  config={activeComponentDataConfig}
                  backToComponentList={() => {
                    store.setChooseComponentVisible(true);
                  }}
                  onConfigChanged={(config) => {
                    store.setActiveComponentDataConfig(config);
                    setTimeout(() => {
                      if (previewRef.current) {
                        previewRef.current.generateScreen();
                      }
                    }, 0);
                  }}
                />
              )}
            </div>
          ) : (
            ''
          )}

          <div
            className={`${styles.contentRight} ${
              !(isChooseComponentVisible || isComponentSettingVisible)
                ? styles.contentFullRight
                : ''
            }`}
          >
            <div className={styles.codeEditor}>
              <Ace
                placeholder={intl.formatMessage({
                  id: 'pages.dataSearch.detail.pleaseInputSql',
                  defaultValue: '请输入sql语句',
                })}
                mode='mysql'
                theme='tomorrow'
                onChange={(val) => {
                  dataSearch.sql = val;
                  onChange && onChange(dataSearch);
                }}
                height={'160px'}
                width={'100%'}
                onLoad={onAceEditorLoaded}
                fontSize={16}
                wrapEnabled={true}
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={false}
                value={dataSearch.sql}
                setOptions={{
                  enableBasicAutocompletion: false,
                  enableLiveAutocompletion: true,
                  enableSnippets: false,
                  showLineNumbers: false,
                  tabSize: 2,
                }}
              />
              <div className={styles.sqlActionBar}>
                <Button
                  className={styles.sqlAction}
                  loading={isDataLoading}
                  onClick={() => {
                    runOrPageChanged();
                  }}
                >
                  <FormattedMessage
                    id='pages.dataSearch.detail.sqlRun'
                    defaultValue='执行'
                  />
                </Button>
              </div>
            </div>
            {queryData && (
              <div className={styles.componentPreview}>
                {(!activeComponent || !activeComponent.id) && (
                  <div className={styles.tablePreview}>
                    <TablePreview
                      data={store.queryData}
                      paging={store.queryDataPaging}
                      onPageChanged={(...args) => {
                        runOrPageChanged(...args);
                      }}
                    />
                  </div>
                )}
                {activeComponent && activeComponent.id && (
                  <ComponentPreview
                    ref={previewRef}
                    activeComponent={activeComponent}
                    data={queryData}
                    dataConfig={activeComponentDataConfig}
                  />
                )}
              </div>
            )}
            {queryData && (
              <div className={styles.contentActions}>
                <Button
                  type='primary'
                  onClick={() => {
                    store.setChooseComponentVisible(!isChooseComponentVisible);
                    if (previewRef.current) {
                      if (!isComponentSettingVisible) {
                        previewRef.current.generateScreen();
                      }
                    }
                  }}
                >
                  <FormattedMessage
                    id='pages.dataSearch.detail.componentVisual'
                    defaultValue='可视化'
                  />
                </Button>
                {activeComponent && activeComponent.id && (
                  <Button
                    type='primary'
                    onClick={() => {
                      store.setComponentSettingVisible(
                        !isComponentSettingVisible
                      );
                      if (previewRef.current) {
                        if (!isChooseComponentVisible) {
                          previewRef.current.generateScreen();
                        }
                      }
                    }}
                  >
                    <FormattedMessage
                      id='pages.dataSearch.detail.componentVisualSetting'
                      defaultValue='设置'
                    />
                  </Button>
                )}
                <p className={styles.contentActionInfo}>
                  注：最多查询1000条数据
                </p>
              </div>
            )}
          </div>
        </div>
        {isSaveModalVisible && (
          <EidtModal
            dataSearch={dataSearch}
            onCancel={() => {
              setSaveModalVisible(false);
            }}
            onSave={(values) => {
              onSave &&
                onSave(
                  {
                    ...dataSearch,
                    ...values,
                  },
                  () => {
                    setSaveModalVisible(false);
                  }
                );
            }}
          />
        )}
      </div>
    );
  }
);
export default Config;
