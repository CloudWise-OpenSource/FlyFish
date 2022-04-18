import React, { useEffect, useState } from 'react';
import { Row, Col, Icon, Card, Menu, Carousel, Progress, Button, message, Tooltip, Empty, Popconfirm } from '@chaoswise/ui';
import SummaryCards from './components/card';
import { FormattedMessage, useIntl } from "react-intl";
import { successCode } from "@/config/global";
import BasicCard from './components/basicCard';
import store from "./model/index";
import TsetCard from '@/components/TestCard';
import axios from 'axios';
import AppProjectModal from "@/components/AddProjectModal";
import {
  observer
} from "@chaoswise/cw-mobx";
import styles from './assets/style.less';
import btn from '../../public/img/dashboard/btn.png';
import globalStore from '@/stores/globalStore';
const Dashboard = observer((props) => {
  const { userInfo, getUserInfo } = globalStore;
  const { addApplicationOne, getTopTotal, setKeys, deleteApplicationOne, changeApplicationOne, getProjectList, getTagsList, copyApplicationOne, setCarouselPage, getApplicationList, openAddProjectModal, closeAppProjectModal, setActiveCard } = store;
  const { key, activeCard, swiperData, cardItems, projectList, carouselPage, tagList, applicationList, isAddModalVisible } = store;
  let [checkFlag, setCheckFlag] = useState(null);
  const [downLoadArr, setDownLoadArr] = useState([]);
  const intl = useIntl();
  // 请求列表数据
  useEffect(() => {
    if (!userInfo) getUserInfo();
    setCarouselPage(1);
    getTagsList();
    getProjectList();
    getTopTotal();
  }, []);
  useEffect(() => {
    getApplicationList();
  }, [key]);
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
      document.body.removeChild($link); // 下载完成移除元素
    }).catch(() => {
      message.error(`${name}导出失败，请重新导出`);
    }).finally(() => {
      setDownLoadArr(list => {
        return list.filter(item => item.value < 100);
      });

    });
  };
  const openUrl = (id) => {
    window.top.open(`${window.LCAP_CONFIG.screenEditAddress}?id=${id}&token=${userInfo?userInfo.yapiAuthorization:''}`, "_blank", "");
  };
  // 添加应用
  const newApplication = () => {
    openAddProjectModal({ tags: [] });
    setCheckFlag(0);
    setActiveCard();
  };
  // 使用模板
  const useApplicatinon = () => {
    setCheckFlag(3);
    openAddProjectModal();
  };
  const next = () => {
    slider.slick.slickNext();
  };
  const prev = () => {
    slider.slick.slickPrev();
  };
  let slider = null;
  const lunboSetting = {
    dots: true,
  };
  const cardRowsSwipers = [];
  if (swiperData.length > 0) {
    for (let i = 0; i < swiperData.length; i++) {
      cardRowsSwipers.push(
        <Row key={i}>
          <BasicCard
            setActiveCard={setActiveCard}
            use={(item) => { useApplicatinon(item); }}
            items={swiperData[i]}
          />
        </Row>
      );
    }
  }
  const cardRows = [];
  let colorId = 0;
  for (let i = 0; i < cardItems.length; i += 3) {
    cardRows.push(
      <Row key={i}>
        <SummaryCards
          items={cardItems.slice(i, i + 3)}
          style={{ width: "100%" }}
          colorId={colorId} />
      </Row>
    );
    colorId++;
  }
  // didi
  return (
    <div className={styles.dashboard}>
      <div style={{ background: '#e9f0ff' }}>
        {
          cardRows
        }
      </div>
      <Menu
        style={{ paddingLeft: '30px' }}
        onClick={(e) => { setKeys(e.key); }}
        selectedKeys={[key]}
        mode="horizontal">
        <Menu.Item key="2D">2D应用大屏</Menu.Item>
        <Menu.Item key="3D" >3D应用大屏</Menu.Item>
      </Menu>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <p className={styles.title}>模板推荐</p>
          <a onClick={() => { props.history.push({ pathname: '/template/apply-template', state: { type: key } }); }}>查看全部<Icon type="right" /> </a>
        </div>
      </div>
      {/* 幻灯片 */}
      {
        swiperData.length === 0 ? <Empty /> : <div className={styles.carouselContainer} >
          <Carousel
            {...lunboSetting}
            beforeChange={(e) => { setCarouselPage(e); }} ref={el => (slider = el)}
          >
            {cardRowsSwipers}
          </Carousel>
          {
            swiperData.length > 1 && carouselPage === 0 && <img src={btn} className={styles.RightBtn} onClick={next}></img>
          }
          {
            swiperData.length > 1 && carouselPage === 1 && <img src={btn} className={styles.leftBtn} onClick={prev}></img>
          }


        </div>
      }
      {/* 我的应用 */}
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p className={styles.title}>我的应用</p>
            <p className={styles.grayTitle}>最近14天创建的应用</p>
          </div>
          <a onClick={() => { props.history.push({ pathname: '/app/apply-develop', state: { type: key } }); }}>查看全部<Icon type="right" /> </a>
        </div>
        {
          <TsetCard
            downLoadArr={downLoadArr}
            dashboardAdd={() => { newApplication(); }}
            isDashboard='true'
            actions={(item) => {
              return (
                <div>
                  <Tooltip key="edit" title="编辑">
                    <a title="编辑" target="_blank" onClick={() => {
                      setCheckFlag(1);
                      openAddProjectModal();
                    }}><Icon type="edit" style={{ color: '#333' }} /></a>
                  </Tooltip>
                  <Tooltip key="delete" title="删除">
                    <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
                      deleteApplicationOne(item.id, (res) => {
                        if (res.code === successCode) {
                          message.success(
                            intl.formatMessage({
                              id: "common.deleteSuccess",
                              defaultValue: "删除成功！",
                            })
                          );
                          getApplicationList();
                        } else {
                          message.error(
                            res.msg || intl.formatMessage({
                              id: "common.deleteError",
                              defaultValue: "删除失败，请稍后重试！",
                            })
                          );
                        }
                      });
                    }}>
                      <a title="删除"><Icon type="delete" style={{ color: '#333' }} /></a>
                    </Popconfirm>
                  </Tooltip>
                  <Tooltip key="export" title="导出">
                    <a title="导出" target="_blank" >
                      {
                        downLoadArr.map(item => item.id).includes(item.id) ? <Icon type="loading" /> : <Icon onClick={() => {
                          exportCode(item.id, item.name);
                        }} type="export" style={{ color: '#333' }} />
                      }
                    </a>
                  </Tooltip>
                  <Tooltip key="copy" title="复制">
                    <a title="复制" onClick={() => {
                      setCheckFlag(2);
                      openAddProjectModal();
                    }}><Icon type="copy" style={{ color: '#333' }} /></a>
                  </Tooltip>

                  <a
                    title="开发应用"
                    target="_blank"
                    href={`${window.LCAP_CONFIG.screenEditAddress}?id=${item.id}&token=${userInfo?userInfo.yapiAuthorization:''}`}
                    rel="noreferrer"
                  >
                    <Button value="small" type="primary">
                      开发
                    </Button>
                  </a>
                  <a
                    title="预览应用"
                    target="_blank"
                    href={`${window.LCAP_CONFIG.screenViewAddress}?id=${item.id}`}
                    rel="noreferrer"
                  >
                    <Button value="small" >
                      预览
                    </Button>
                  </a>
                </div>
              );
            }}
            value={applicationList}
            setActiveCard={setActiveCard}
            state={0} showStateTag={true}
          ></TsetCard>
        }
      </div>
      {isAddModalVisible && (
        <AppProjectModal
          addOrChangeFlag={checkFlag}
          project={activeCard}
          tagList={tagList}
          type={key}
          projectList={projectList}
          onCopy={(id, item) => {
            copyApplicationOne(id, item, (res => {
              if (res.code === successCode) {
                if (checkFlag === 3) {
                  openUrl(res.data.id);
                }
                message.success(
                  intl.formatMessage({
                    id: checkFlag === 2 ? "common.copySuccess" : 'common.useSuccess',
                    defaultValue: "复制成功！",
                  })
                );
                closeAppProjectModal();
                getApplicationList();
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.copyError",
                    defaultValue: "复制失败，请稍后重试！",
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
                    defaultValue: "编辑成功！",
                  })
                );
                closeAppProjectModal();
                getTagsList();
                getApplicationList();
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.changeError",
                    defaultValue: "编辑失败，请稍后重试！",
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
                    defaultValue: "新增成功！",
                  })
                );
                openUrl(res.data.id);
                closeAppProjectModal();
                getTagsList();
                getApplicationList();
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.addError",
                    defaultValue: "新增失败，请稍后重试！",
                  })
                );
              }
            });
          }}
          onCancel={closeAppProjectModal}
        />
      )}
    </div>
  );
});
export default Dashboard;