import React, { Component } from 'react';
import { Row, Col, Card, Icon, Avatar, Button, Tooltip, Spin } from '@chaoswise/ui';
const { Meta } = Card;
import { getComputedStyle } from '@/utils/common';
import { Link } from 'react-router-dom';
import img from '../../../../public/img/dashboard/back1.png';
import stylues from './index.scss';
class SummaryCards extends Component {
    constructor(props) {
        super();
        this.state = {
            loadFlag: []
        };
    }

    render() {
        const {
            use,
            setActiveCard,
            items
        } = this.props;
        const tradesArr = (trades) => {
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
        };
        return (
            <Row justify="space-around" gutter={['16', '16']} style={{ margin: '0 15px' }} className={stylues.basicCard}>
                {
                    items.map((item, index) => {
                        return (<Col span={8} key={index}>
                            <Card
                               onClick={() => { delete item.projects; setActiveCard({ ...item, developStatus: 'doing' });}}
                                key={item.id}
                                cover={
                                    <>
                                        <div className={stylues.imgContainer}>
                                            <img src={img} 
                                                className={stylues.zhan} />
                                            <img
                                                className={stylues.ben}
                                                alt="暂无照片"
                                                src={window.LCAP_CONFIG.snapshotAddress+item.cover}
                                                onLoad={(event) => {
                                                    const target = event.target;
                                                    if (target.complete) {
                                                        let a = [...this.state.loadFlag, item.id];
                                                        this.setState({
                                                            loadFlag: a
                                                        });
                                                    }

                                                }}
                                                onError={
                                                    ()=>{
                                                        let a = [...this.state.loadFlag, item.id];
                                                        this.setState({
                                                            loadFlag: a
                                                        });
                                                    }
                                                }
                                            />

                                            <div className={stylues.mask}>
                                                <a
                                                    title=""
                                                    target="_blank"
                                                    href={`${window.LCAP_CONFIG.screenViewAddress}?id=${item.id}`}
                                                    rel="noreferrer"
                                                >
                                                    <Button onClick={() => { }} className={stylues.btn}>预览</Button>
                                                </a>
                                                <Button className={stylues.btn} type="primary" onClick={() => { use(item); }}>使用模板</Button>

                                            </div>
                                        </div>
                                        {!this.state.loadFlag.includes(item.id) && <div className={stylues.img} style={{ minHeight: '174px' }}>
                                            <img src={img} className={stylues.zhan} />
                                            <Spin size="default" className={stylues.spin} /></div>}
                                    </>

                                }
                            >
                                <Meta
                                    title={item.name}
                                    description={<Tooltip title={item.trades && tradesArr(item.trades)} > <div className='titleOverflow'>行业：{item.trades && tradesArr(item.trades) || '暂无'}</div>  </Tooltip>}
                                />
                            </Card>
                        </Col>
                        );
                    })
                }
            </Row>
        );
    }
}

export default SummaryCards;
