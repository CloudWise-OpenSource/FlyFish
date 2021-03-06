/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input, Button, message, SearchBar, Icon, Pagination, Progress, Popconfirm, Tooltip } from "@chaoswise/ui";
import {
  observer
} from "@chaoswise/cw-mobx";
import store from "./model/index";
import AppProjectModal from "@/components/AddProjectModal";
import TsetCard from '@/components/TestCard';
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import { Select } from '@chaoswise/ui';
import { APP_DEVELOP_STATUS } from '@/config/global';
import axios from 'axios';
const { Option } = Select;
import DeleteApplyListModal from './components/DeleteApplyListModal';
import globalStore from '@/stores/globalStore';
const ApplyDevelop = observer((props) => {
  const { userInfo } = globalStore;
  let [checkFlag, setCheckFlag] = useState(null);
  const intl = useIntl(); const {
    getApplicationList, setPageSize,
    setSearchParams, setActiveCard,
    setCurPage, addApplicationOne, deleteApplicationOne, getApplicationListDelete, clearApplication,
    getTagsList, getProjectList, changeApplicationOne,
    openAddProjectModal, closeDeleteApplyListModal, copyApplicationOne,
    closeAppProjectModal, openDeleteApplyListModal, setType, addNewTag
  } = store;
  const { total, key, curPage, totalDelete, deleteCurPage, tagList, pageSize, activeCard, applicationListDelete, projectList, applicationList1, isDeleteApplyListModalVisible, applicationList, isAddModalVisible, activeProject } =
    store;
  const [downLoadArr, setDownLoadArr] = useState([]);
  const exportCode = async (id, name) => {
    let obj = {
      id,
      value: 0
    };
    setDownLoadArr(downLoadArr => {
      downLoadArr.push(obj);
      return downLoadArr.slice(0);
    });
    axios.get(`${window.LCAP_CONFIG.apiDomain}/applications/export/${id}`, {
      responseType: 'blob',
      timeout: 0,
      onDownloadProgress: (evt) => {
        setDownLoadArr(downLoadArr => {
          return downLoadArr.map(item => {
            if (item.id === id) {
              return {
                ...item,
                value: parseInt(
                  (evt.loaded / evt.total) * 100
                )
              };
            } else {
              return item;
            }
          });
        });
      },
    },
    ).then((res) => {
      const $link = document.createElement("a");
      const url = window.URL.createObjectURL(res.data);
      $link.href = url;
      const disposition = res.headers['content-disposition'];
      $link.download = decodeURI(disposition.replace('attachment;filename=', ''));
      document.body.appendChild($link);
      $link.click();
      document.body.removeChild($link); // ????????????????????????
    }).catch((e) => {
      console.log('e:',e);
      message.error(`${name}??????????????????????????????`);
    }).finally(() => {
      setDownLoadArr(list => {
        return list.filter(item => item.value < 100);
      });

    });
  };
  const searchContent = [
    {
      components: (
        <Select
          id="projectId"
          key="projectId"
          showSearch
          allowClear
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          style={{ width: "200px" }}
          name='????????????'
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchSelectProgressName",
            defaultValue: "??????????????????????????????",
          })}
        >
          {
            projectList.map(item => {
              return <Option key={item.id} value={item.id} title={item.name}>{item.name}</Option>;
            })
          }
        </Select>
      ),
    },
    {
      components: (

        <Select
          id="developStatus"
          key="developStatus"
          allowClear
          name='????????????'

          style={{ width: "100px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputDevelopmentState",
            defaultValue: "??????????????????????????????",
          })}
        >
          {
            APP_DEVELOP_STATUS.map(item => {
              return <Option key={item.id} value={item.id}>{item.name}</Option>;
            })
          }
        </Select>
      ),
    },
    {
      components: (
        <Input
          id="name"
          key="name"
          allowClear
          name='????????????'
          suffix={<Icon type="search" />
          }
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputAppName",
            defaultValue: "??????????????????????????????",
          })}
        />
      ),
    },
    {
      components: (
        <Select id="tags"
          key="tags"
          allowClear
          maxTagCount={4}
          onChange={(arr) => {
            if (arr.length > 10) {
              arr.pop();
              message.error('?????????????????????????????????');
            }

          }}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          name='????????????' style={{ width: 200 }}
          mode="multiple"
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputApplyLabel",
            defaultValue: "??????????????????????????????",
          })}
        >
          {
            tagList.map(item => {
              return <Option key={item.id} value={item.id}>{item.name}</Option>;
            })
          }
        </Select>
      ),
    },
  ];
  const searchTypeContent = [
    {
      components: (
        <Select
          id="type"
          key="type"
          name='??????????????????'
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputPlaceholder",
            defaultValue: "??????????????????????????????",
          })}
        >
          <Option value="2D" >2D????????????</Option>
          <Option value="3D">3D????????????</Option>
        </Select>
      ),
      formAttribute: { initialValue: key || '2D' }
    },

  ];
  // ??????????????????
  useEffect(() => {
    if (props.location.state) {
      let paramsType = props.location.state.type;
      if (paramsType) {
        setType(paramsType);
        clearApplication();
      }
    }

    setSearchParams();
    getProjectList();
    getApplicationList();
    getTagsList();

  }, []);
  const onSearchType = (params) => {
    if (params['type']) {
      setType(params.type);
    }
    getApplicationList({
      curPage: 0
    });
  };
  const onSearch = (params) => {
    for (const i in params) {
      if (!params[i] || params[i].length === 0) {
        delete params[i];
      }
    }
    setSearchParams(params);
    getApplicationList({
      curPage: 0,
    });
  };
  const extra = () => {
    return [
      <Button
        type="primary"
        key="create_project"
        onClick={() => {
          openAddProjectModal({ tags: [] });
          setCheckFlag(0);
          setActiveCard();

        }}
      >
        <FormattedMessage
          id="pages.applyDevelop.create"
          defaultValue="????????????"
        />
      </Button>,
      <Button
        key="reset_project"
        onClick={() => {
          getApplicationListDelete({ status: 'invalid' });
          openDeleteApplyListModal();
        }}
      >
        <FormattedMessage
          id="pages.applyDevelop.reset"
          defaultValue="????????????"
        />
      </Button>,
    ];
  };
  return (
    <div className={styles.container}>
      <SearchBar
        onSearch={onSearchType}
        searchContent={searchTypeContent} showSearchCount={6} extra={extra}
      />
      <SearchBar
        onSearch={onSearch}
        className={styles.search}
        searchContent={searchContent} showSearchCount={6}
      />
      {
        <div style={{ minHeight: 'calc(100vh - 292px)' }}>
          <TsetCard value={applicationList}
            downLoadArr={downLoadArr}
            setActiveCard={setActiveCard}
            state={0} showStateTag={true}
            actions={(item) => {
              return (
                <>
                  <Tooltip key="edit" title="??????">
                    <a
                      title="??????"
                      target="_blank"
                      onClick={() => {
                        setCheckFlag(1), openAddProjectModal();
                      }}
                    >
                      <Icon type="edit" style={{ color: "#333" }} />
                    </a>
                  </Tooltip>
                  <Tooltip key="delete" title="??????">
                    <Popconfirm
                      title="???????????????"
                      okText="??????"
                      cancelText="??????"
                      onConfirm={() => {
                        deleteApplicationOne(item.id, (res) => {
                          if (res.code === successCode) {
                            message.success(
                              intl.formatMessage({
                                id: "common.deleteSuccess",
                                defaultValue: "???????????????",
                              })
                            );
                            getApplicationList();
                          } else {
                            message.error(
                              res.msg ||
                              intl.formatMessage({
                                id: "common.deleteError",
                                defaultValue: "?????????????????????????????????",
                              })
                            );
                          }
                        });
                      }}
                    >
                      <a title="??????">
                        <Icon type="delete" style={{ color: "#333" }} />
                      </a>
                    </Popconfirm>
                  </Tooltip>
                  <Tooltip key="export" title="??????">
                    <a title="??????" target="_blank" >
                      {
                        downLoadArr.map(item => item.id).includes(item.id) ? <Icon type="loading" /> : <Icon onClick={() => {
                          exportCode(item.id, item.name);
                        }} type="export" style={{ color: '#333' }} />
                      }
                    </a>
                  </Tooltip>

                  <Tooltip key="copy" title="??????">
                    <a
                      title="??????"
                      onClick={() => {
                        setCheckFlag(2);
                        openAddProjectModal();
                      }}
                    >
                      <Icon type="copy" style={{ color: "#333" }} />
                    </a>
                  </Tooltip>

                  <a
                    title="????????????"
                    target="_blank"
                    href={`${window.LCAP_CONFIG.screenEditAddress}?id=${item.id}&token=${userInfo.yapiAuthorization}`}
                    rel="noreferrer"
                  >
                    <Button value="small" type="primary">
                      ??????
                    </Button>
                  </a>
                  <a
                    title="????????????"
                    target="_blank"
                    href={`${window.LCAP_CONFIG.screenViewAddress}?id=${item.id}`}
                    rel="noreferrer"
                  >
                    <Button value="small" >
                      ??????
                    </Button>
                  </a>
                </>
              );
            }}
          >
          </TsetCard>
        </div>
      }
      <Pagination
        hideOnSinglePage={true}
        total={total}
        showSizeChanger={true}
        showTotal={(total) => {
          return `???${total}?????????`;
        }}
        pageSizeOptions={['15', '45', '75', '150']}
        current={curPage + 1}
        pageSize={pageSize}
        onChange={(current) => {
          setCurPage(current - 1);
          getApplicationList();
        }}
        onShowSizeChange={
          (page, pageSize) => {
            setCurPage(0);
            setPageSize(pageSize);
            getApplicationList();
          }
        }
      />
      {isAddModalVisible && (
        <AppProjectModal
          addOrChangeFlag={checkFlag}
          project={activeCard}
          tagList={tagList}
          type={key}
          addNewTag={addNewTag}
          projectList={projectList}
          onCopy={(id, item) => {
            copyApplicationOne(id, item, (res => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.copySuccess",
                    defaultValue: "???????????????",
                  })
                );
                closeAppProjectModal();
                getApplicationList();
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.copyError",
                    defaultValue: "?????????????????????????????????",
                  })
                );
              }
            }));
          }}
          onChange={(id, application) => {
            changeApplicationOne(id, application, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.changeSuccess",
                    defaultValue: "???????????????",
                  })
                );
                closeAppProjectModal();
                getTagsList();
                getApplicationList();
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.changeError",
                    defaultValue: "?????????????????????????????????",
                  })
                );
              }
            });
          }}
          onSave={(application) => {
            addApplicationOne(application, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.addSuccess",
                    defaultValue: "???????????????",
                  })
                );
                closeAppProjectModal();
                getTagsList();
                getApplicationList({
                  curPage: 0,
                });
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.addError",
                    defaultValue: "?????????????????????????????????",
                  })
                );
              }
            });
          }}
          onCancel={closeAppProjectModal}
        />
      )}
      {
        isDeleteApplyListModalVisible && (
          <DeleteApplyListModal
            total={totalDelete}
            curPage={deleteCurPage}
            project
            onChange={(id, params) => {
              changeApplicationOne(id, params, (res) => {
                if (res.code === successCode) {
                  message.success(
                    intl.formatMessage({
                      id: "common.reductionSuccess",
                      defaultValue: "???????????????",
                    })
                  );
                  getApplicationListDelete({ status: 'invalid' });
                  getApplicationList({
                    curPage: 0,
                  });
                } else {
                  message.error(
                    res.msg || intl.formatMessage({
                      id: "common.reductionError",
                      defaultValue: "?????????????????????????????????",
                    })
                  );
                }
              });
            }}
            deleteApplyList={applicationListDelete.list}
            getDeleteApplyList={getApplicationListDelete}
            onCancel={closeDeleteApplyListModal}
          />
        )
      }

    </div>
  );
});
export default ApplyDevelop;
