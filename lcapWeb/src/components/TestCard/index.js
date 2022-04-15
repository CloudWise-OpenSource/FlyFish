import React from 'react';
import { Form, Popconfirm } from "@chaoswise/ui";
import { Card, Tag, Col, Row, Icon, Avatar, Empty, message, Tooltip, Progress, Spin, Button } from 'antd';
const { Meta } = Card;
import styles from './index.less';
import back from '../../public/img/dashboard/back1.png';
// import logo from '../../assets/images/logo.svg';
import doing from '../../public/img/dashboard/doing.png';
import test from '../../public/img/dashboard/test.png';
import over from '../../public/img/dashboard/over.png';
import demo from '../../public/img/dashboard/demo.png';
import recommend from '../../public/img/dashboard/good.png';


export default Form.create({ name: "BASIC_CARD" })(
    function BasicCard({ number, downLoadArr = [], dashboardAdd, isLib, projectID, isDashboard, onDelete, setActiveCard, addOwn, checkCard, value, state, showStateTag, actions, canDelete, canAdd }) {
        let [loadFlag, setLoadFlag] = React.useState([]);
        const tradesArr = (trades, flag) => {
            if (flag) {
                if (trades.length === 0) {
                    return (
                        <Button className={styles.tags}>暂无</Button>
                    );
                } else {
                    return trades.map((item) => {
                        if (item.name) {
                            return (<Button key={item.id} className={styles.tags}>{item.name}</Button>);
                        }
                    });
                }
            } else {
                if (trades.length === 0) {
                    return '暂无';
                } else {
                    return trades.map((item, index) => {
                        if (index !== trades.length - 1) {
                            return item.name + ',';
                        } else {
                            return item.name;
                        }
                    });
                }
            }

        };
        const tagSrc = (item) => {
            let developStatus = item.developStatus;
            if (isLib && item.isRecommend) {
                return recommend;
            }
            if (!isLib) {
                if (developStatus === 'doing') {
                    return doing;
                }
                if (developStatus === 'testing') {
                    return test;
                }
                if (developStatus === 'delivered') {
                    return over;
                }
                if (developStatus === 'demo') {
                    return demo;
                }

            }

        };
        let [checkid, setCheckId] = React.useState('');

        return (
            <Row justify="space-around" gutter={['16', '16']} style={{ margin: '10px' }}
                className={[styles['cardList'], isLib ? 'longCard' : null].join(' ')}
            >
                {
                    isDashboard && <Col span={number || 8} >
                        <Card
                            className='myAddCard'
                            cover={
                                <img
                                    className='hoverImg'
                                    alt="example"
                                />
                            }
                        >
                            <div className='addApplication' onClick={() => { dashboardAdd(); }}>
                                <Icon type="plus" />
                                <div>添加应用</div>
                            </div>
                        </Card>
                    </Col>
                }
                {
                    value && value.list && value.list.length > 0 ? value.list.map((item, index) => <Col span={number || 8} key={item.id}>

                        <Card
                            onClick={() => {
                                if (projectID) {
                                    setActiveCard && setActiveCard(item, projectID);
                                } else {
                                    setActiveCard && setActiveCard(item);
                                }
                            }}
                            style={{ boxShadow: checkid == item.id ? '3px 3px 3px 3px #dedede' : null, position: 'relative' }}
                            cover={
                                <>
                                    {
                                        canDelete && item.isLib ? <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
                                            onDelete && onDelete(item);
                                        }}>
                                            <Tag className={styles.deleteTag} color='red' >
                                                <Icon type="minus" />
                                            </Tag>
                                        </Popconfirm> : null
                                    }
                                    {
                                        canAdd ? <Tag className={styles.deleteTag} color={item.projects.map(item => item.id).includes(projectID) ? "#52C41A" : "#2db7f5"} onClick={() => {
                                            if (item.projects.map(item => item.id).includes(projectID)) {
                                                message.error('该组件已归属该项目');
                                                return;
                                            }
                                            let projectsArr = item.projects.map(item => item.id);
                                            addOwn && addOwn(item.id, projectsArr);
                                        }}>
                                            {item.projects.map(item => item.id).includes(projectID) ? <Icon type="check" /> : <Icon type="plus" />}
                                        </Tag> : null
                                    }
                                    {
                                        !showStateTag ? null : (<img className={styles.tag} style={{ display: (isLib && !item.isRecommend) ? 'none' : 'block' }} src={tagSrc(item)}></img>)
                                    }
                                    <div className={styles.imgContainer}>
                                        {/* 模拟展位 */}
                                        <img src={back}
                                            className={styles.zhan} />
                                        <img
                                            className={styles.ben}
                                            onClick={() => {
                                                checkCard && checkCard(item.id);
                                                setCheckId(item.id);
                                            }}
                                            onLoad={(event) => {
                                                const target = event.target;
                                                if (target.complete) {
                                                    let a = [...loadFlag, item.id];
                                                    setLoadFlag(a);
                                                }

                                            }}
                                            onError={
                                                () => {
                                                    let a = [...loadFlag, item.id];
                                                    setLoadFlag(a);
                                                }
                                            }
                                            alt="暂无照片"
                                            src={window.LCAP_CONFIG.snapshotAddress + item.cover}
                                        />

                                        {!loadFlag.includes(item.id) && <div className={styles.img} style={{ minHeight: (number) ? '70px' : '174px' }}>
                                            <img src={back} className={styles.zhan} />
                                            <Spin size="default" className={styles.spin} /></div>}
                                    </div>


                                </>
                            }
                            actions={actions && actions(item).props.children}
                        >
                            <Meta
                                onClick={() => {
                                    checkCard && checkCard(item.id);
                                    setCheckId(item.id);
                                }}
                                title={(() => {
                                    return <Tooltip title={item.name}>
                                        <span>{`${item.name || '暂无'}`}</span>
                                    </Tooltip>;

                                })()}
                                description={(() => {
                                    const apply = [
                                        <div key='apply'>
                                            <Row>
                                                <Col span={12}>
                                                    <div className='titleOverflowContainer'>
                                                        <p>当前开发人：</p>
                                                        <Tooltip title={item.updater}>
                                                            <p className='titleOverflowTItle'>{item.updater || '暂无'}</p>
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className='titleOverflowContainer'>
                                                        <p>创建人：</p>
                                                        <Tooltip title={item.creator}>
                                                            <p className='titleOverflowTItle'>{item.creator || '暂无'}</p>
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Tooltip title={tradesArr(item.tags)}>
                                                <div className='titleOverflow'>{item.tags && tradesArr(item.tags, true)}</div>
                                            </Tooltip>

                                        </div>
                                    ];
                                    const actionsOk = [
                                        <div key='template'>
                                            <Tooltip title={item.id}><p className='titleOverflow'>模板编号：{item.id || '暂无'}</p>  </Tooltip>
                                            <Tooltip title={item.trades && tradesArr(item.trades)}>
                                                <div className='titleOverflow'>{item.trades && tradesArr(item.trades, true)}</div>
                                            </Tooltip>
                                        </div>
                                    ];
                                    const applyList = [
                                        <div key='apply'>
                                            <Tooltip title={item.id}>
                                                <p className='titleOverflow'>组件编号：{item.id || '暂无'}</p>
                                            </Tooltip>
                                            <Tooltip title={item.desc}>
                                                <p className='titleOverflow'>描述：{item.desc || '暂无'}</p>
                                            </Tooltip>
                                        </div>
                                    ];
                                    if (!actions) return applyList;
                                    if (state) {
                                        return actionsOk;
                                    } else {
                                        return apply;
                                    }
                                })()}
                            />

                        </Card>
                        {/* 进度条 */}
                        {
                            downLoadArr.filter(ele => ele.id === item.id).map(option => (
                                <Progress key={option.id} percent={option.value} showInfo={false} style={{ position: 'absolute', bottom: '0', width: '96%' }} />
                            ))}
                    </Col>) : <div className='flexContainer' style={{ height: number ? 'calc(100vh - 500px)' : null }}> <Empty /></div>
                }
            </Row>
        );

    }
);
