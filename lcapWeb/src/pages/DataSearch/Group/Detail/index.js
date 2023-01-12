/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { message, Button, Icon, Radio, Tooltip } from '@chaoswise/ui';
import { observer, loadingStore } from '@chaoswise/cw-mobx';
import store from './model/index';
import DetailTitleBox from '@/components/Layouts/DetailTitleBox';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  dataSearchTypeEnums,
  dataSearchGroupTypeEnums,
  dataSearchTypeMappings,
} from '@/pages/DataSearch/constants/enum';
import SearchList from './components/SearchList';
import styles from './assets/style.less';
import EidtModal from './components/EditModal';
import SingleValuePreview from './components/SingleValuePreview';
import MultipleValuePreview from './components/MultipleValuePreview';
import TimeSeriesValuePreview from './components/TimeSeriesValuePreview';

const PREVIEW_COMPONENT_MAPPINGS = {
  [dataSearchTypeMappings.singleValueGroup.id]: SingleValuePreview,
  [dataSearchTypeMappings.multipleValueRowGroup.id]: MultipleValuePreview,
  [dataSearchTypeMappings.multipleValueColGroup.id]: MultipleValuePreview,
  [dataSearchTypeMappings.timeSeriesValueGroup.id]: TimeSeriesValuePreview,
};

const Detail = observer(({ dataSearch, onChange, onSave, onCancel }) => {
  const intl = useIntl();
  const loading =
    loadingStore.loading['DataGroupSearchDetail/getQueryDataList'];
  const searchListRef = useRef();
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);
  const [isItemValid, setItemValid] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    if (dataSearch.settingId) {
      store.getQueryDataList(
        {
          queryType: dataSearch.queryType,
          combineIds: combineInfo.map((c) => c.value.settingId),
        },
        () => {
          if (mountedRef.current) {
            setItemValid(true);
          }
        },
        errorCallback
      );
    }
    return () => {
      mountedRef.current = false;
      store.reset();
    };
  }, []);

  const { queryData } = store;

  const targetDataSearchTypeEnum =
    dataSearchTypeEnums.find((t) => t.id == dataSearch.queryType) || {};
  let targetDataSearchGroupTypeEnum = dataSearchGroupTypeEnums.find(
    (t) => t.id == dataSearch.queryType
  );
  if (
    targetDataSearchGroupTypeEnum == null ||
    targetDataSearchTypeEnum === dataSearchTypeMappings.multipleValueColGroup.id
  ) {
    targetDataSearchGroupTypeEnum = dataSearchGroupTypeEnums[1];
  }
  const errorCallback = (list) => {
    if (!mountedRef.current) {
      return;
    }
    if (Array.isArray(list)) {
      setItemValid(false);
      if (searchListRef && searchListRef.current) {
        searchListRef.current.setValidResult(list);
      }
      message.error(
        list
          .filter((item) => !item.available)
          .map((item) => item.msg)
          .join(',') ||
          intl.formatMessage({
            id: 'pages.dataSearch.groupDetail.previewSearchQueryError',
            defaultValue: '预览查询项失败，请稍后重试！',
          })
      );
    } else {
      message.error(
        list ||
          intl.formatMessage({
            id: 'pages.dataSearch.groupDetail.previewSearchQueryError',
            defaultValue: '预览查询项失败，请稍后重试！',
          })
      );
    }
  };
  const combineInfo = dataSearch.setting
    ? dataSearch.setting.combineInfo || []
    : [];
  const PreviewComponent =
    PREVIEW_COMPONENT_MAPPINGS[targetDataSearchTypeEnum.id];
  return (
    <div className={styles.detail}>
      <div className={styles.content}>
        <DetailTitleBox
          title={`${intl.formatMessage({
            id: 'pages.dataSearch.groupDetail.addSearchQueryItem',
            defaultValue: '添加查询项',
          })}(${combineInfo.length}/${targetDataSearchTypeEnum.maxItem})`}
          desc={
            targetDataSearchGroupTypeEnum
              ? `${intl.formatMessage(
                  targetDataSearchGroupTypeEnum.label
                )}：${intl.formatMessage(
                  targetDataSearchGroupTypeEnum.desc || {}
                )}`
              : ''
          }
        >
          <SearchList
            list={combineInfo}
            queryType={dataSearch.queryType}
            ref={searchListRef}
            onChange={(list) => {
              dataSearch.setting.combineInfo = list;
              onChange && onChange(dataSearch);
              setTimeout(() => {
                if (searchListRef && searchListRef.current) {
                  setItemValid(false);
                  searchListRef.current.validate().then((result) => {
                    setItemValid(result.isValid);
                  });
                }
              }, 0);
            }}
          />
          {targetDataSearchTypeEnum.id ===
            dataSearchTypeMappings.multipleValueRowGroup.id ||
          targetDataSearchTypeEnum.id ===
            dataSearchTypeMappings.multipleValueColGroup.id ? (
            <div className={styles.mergeWrap}>
              <div className={styles.mergeLabel}>
                <FormattedMessage
                  id='pages.dataSearch.groupDetail.mergeWayLabel'
                  defaultValue='合并方式'
                />
              </div>
              <div className={styles.mergeContent}>
                <Radio.Group
                  name='dataSearchTypeGroup'
                  disabled={dataSearch.settingId > 0}
                  value={Number(dataSearch.queryType)}
                  onChange={(e) => {
                    const type = e.target.value;
                    dataSearch.queryType = type;
                    onChange && onChange(dataSearch);
                    setTimeout(() => {
                      if (searchListRef && searchListRef.current) {
                        searchListRef.current.validate().then((result) => {
                          setItemValid(result.isValid);
                        });
                      }
                    });
                  }}
                >
                  <Radio
                    value={dataSearchTypeMappings.multipleValueRowGroup.id}
                  >
                    <FormattedMessage
                      id='pages.dataSearch.groupDetail.mergeByRow'
                      defaultValue='按行合并'
                    />
                    <Tooltip
                      title={
                        <FormattedMessage
                          {...dataSearchTypeMappings.multipleValueRowGroup.desc}
                        />
                      }
                    >
                      <Icon
                        className={styles.mergeWayItemIcon}
                        type='exclamation-circle'
                      />
                    </Tooltip>
                  </Radio>
                  <Radio
                    value={dataSearchTypeMappings.multipleValueColGroup.id}
                  >
                    <FormattedMessage
                      id='pages.dataSearch.groupDetail.mergeByCol'
                      defaultValue='按列合并'
                    />
                    <Tooltip
                      title={
                        <FormattedMessage
                          {...dataSearchTypeMappings.multipleValueColGroup.desc}
                        />
                      }
                    >
                      <Icon
                        className={styles.mergeWayItemIcon}
                        type='exclamation-circle'
                      />
                    </Tooltip>
                  </Radio>
                </Radio.Group>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className={styles.actionList}>
            <Button
              disabled={combineInfo.length >= targetDataSearchTypeEnum.maxItem}
              className={styles.action}
              onClick={() => {
                if (combineInfo.length >= targetDataSearchTypeEnum.maxItem) {
                  return;
                }
                dataSearch.setting.combineInfo = [
                  ...combineInfo,
                  {
                    key:
                      new Date().getTime() +
                      Math.ceil(Math.random() * 10000000),
                    value: null,
                  },
                ];
                onChange && onChange(dataSearch);
                setTimeout(() => {
                  if (searchListRef && searchListRef.current) {
                    searchListRef.current.validate().then((result) => {
                      setItemValid(result.isValid);
                    });
                  }
                });
              }}
            >
              <Icon className={styles.actionIcon} type='plus' />
              <FormattedMessage id='common.create' defaultValue='添加' />
            </Button>
            <Button
              disabled={!isItemValid}
              loading={loading}
              className={styles.action}
              onClick={() => {
                if (isItemValid) {
                  store.getQueryDataList(
                    {
                      queryType: dataSearch.queryType,
                      combineIds: combineInfo.map((c) => c.value.settingId),
                    },
                    () => {},
                    errorCallback
                  );
                }
              }}
            >
              <FormattedMessage
                id='pages.dataSearch.groupDetail.preview'
                defaultValue='预览'
              />
            </Button>
          </div>
        </DetailTitleBox>
        {queryData && queryData.length > 0 && (
          <div className={styles.previewWrap}>
            <DetailTitleBox
              title={`${intl.formatMessage({
                id: 'pages.dataSearch.groupDetail.preview',
                defaultValue: '预览',
              })}`}
            >
              <div className={styles.previewTableWrap}>
                {targetDataSearchTypeEnum.id && (
                  <PreviewComponent data={queryData} dataSearch={dataSearch} />
                )}
              </div>
            </DetailTitleBox>
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <Button
          type='primary'
          onClick={() => {
            if (
              combineInfo.filter(
                (item) => item && item.value && item.value.settingId
              ).length === 0
            ) {
              return message.info(
                intl.formatMessage({
                  id: 'pages.dataSearch.groupDetail.pleaseChooseOneItem',
                  defaultValue: '请至少选择一个查询项！',
                })
              );
            }
            setSaveModalVisible(true);
          }}
        >
          <FormattedMessage id='common.ok' defaultValue='确定' />
        </Button>
        <Button
          onClick={() => {
            onCancel && onCancel();
          }}
        >
          <FormattedMessage id='common.cancel' defaultValue='取消' />
        </Button>
      </div>
      {isSaveModalVisible && (
        <EidtModal
          dataSearch={dataSearch}
          onCancel={() => {
            setSaveModalVisible(false);
          }}
          onSave={(values) => {
            const newDataSearch = {
              ...dataSearch,
              ...values,
              setting: {
                combineIds: combineInfo
                  .filter((item) => item && item.value && item.value.settingId)
                  .map((item) => item.value.settingId),
              },
            };
            onSave &&
              onSave(newDataSearch, () => {
                setSaveModalVisible(false);
              });
          }}
        />
      )}
    </div>
  );
});
export default Detail;
