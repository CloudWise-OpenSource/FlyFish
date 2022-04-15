import React from 'react';
import { Card, Dropdown, Menu, Tooltip, Icon } from 'antd';
import stylues from './index.scss';
import { Link } from 'react-router-dom';
import {
    observer
} from "@chaoswise/cw-mobx";
import circle from '../../../../public/img/dashboard/circle.png';
import globalStore from '@/stores/globalStore';
const SummaryCard = observer((props) => {
    const {menuNameArr}=globalStore;
    const {
        id,
        title,
        noData,
        indexes = [],
        styles: _styles,
    } = props;
    let menu;
    const checkHasMenu = (name) => {
        return menuNameArr.includes(name);
    };


    switch (id) {
        case 1:
            menu = (<Menu >
                <Menu.Item disabled={checkHasMenu('项目管理') ? false : true}>
                    {
                        checkHasMenu('项目管理') ? <Link to={'/app/project-manage'}>
                            项目管理
                        </Link> : <>项目管理</>
                    }
                </Menu.Item>
            </Menu>);
            break;
        case 2:
            menu = (<Menu>
                <Menu.Item disabled={checkHasMenu('应用开发') ? false : true}>
                    {
                        checkHasMenu('应用开发') ? <Link to={'/app/apply-develop'}>
                            应用开发
                        </Link> : <>应用开发</>
                    }
                </Menu.Item>
            </Menu>);
            break;
        case 3:
            menu = (<Menu>
                <Menu.Item disabled={checkHasMenu('组件开发') ? false : true}>
                    {
                        checkHasMenu('组件开发') ? <Link to={'/app/component-develop'}>
                            组件开发
                        </Link> : <> 组件开发</>
                    }
                </Menu.Item>
            </Menu>);
            break;
        case 4:
            menu = (<Menu>
                <Menu.Item disabled={checkHasMenu('应用模板库') ? false : true}>
                    {checkHasMenu('应用模板库') ?
                        <Link to={'/template/apply-template'}>
                            应用模板库
                        </Link> : <> 应用模板库</>
                    }
                </Menu.Item>
                < Menu.Item disabled={checkHasMenu('组件库') ? false : true}>
                    {
                        checkHasMenu('组件库') ?
                            <Link to={'/template/library-template'}>
                                组件库
                            </Link> : <> 组件库</>
                    }
                </Menu.Item>
            </Menu >);
            break;
        case 5:
            menu = (<Menu>
                <Menu.Item disabled={checkHasMenu('API列表') ? false : true}>
                    {
                        checkHasMenu('API列表') ? <Link to={'/api/api-list'}>
                            API列表
                        </Link> : <>API列表</>
                    }
                </Menu.Item>
            </Menu>);
            break;
        case 6:
            menu = (<div></div>);
            break;
    }
    function addThousandSeparator(number, unit) {
        if (!isNaN(number)) {
            var source = String(number).split(".");
            source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
            if (unit) {
                return source.join(".") + unit;
            } else {
                return source.join(".");
            }
        } else {
            return number;
        }
    }
    return (
        <Card className={stylues.cards}
            extra={
                <Dropdown overlay={menu}>
                    <img style={{ width: '16px', height: '16px' }} src={circle}></img>
                </Dropdown>
            }
            style={{ width: _styles.width || "100%", display: "inline-block", margin: id / 3 === 0 ? '0 16px 16px 0' : '0 0 16px 0', height: '116px' }}>
            <div className={stylues.cardLeft}>
                <div className={[stylues['icon'], stylues[`img${id}`]].join(' ')}></div>
            </div>
            <div className={stylues.cardRight}>
                <div className={stylues.content}>
                    {
                        !noData ? indexes.map((item, index) => {
                            return (<div key={index} className={stylues.contentItem}>
                                <p >{title[index]}</p>
                                <div className={stylues.numContainer}>
                                    <span>共</span>
                                    <span className={stylues.big}>{addThousandSeparator(item) || 0}</span>
                                    <span className={stylues.small}>个</span>
                                </div>
                            </div>);
                        }) :
                            [{}].map((item, index) => {
                                return (<div key={index} className={stylues.contentItem}>
                                    <div style={{ display: 'flex' }} >
                                        <p >暂未接入</p>
                                        <Tooltip title={`暂未接入${title[index]}模块,如需接入请联系管理员！`}>
                                            <Icon style={{ marginTop: '1px' }} type="question-circle" />
                                        </Tooltip>
                                    </div>
                                    <div className={stylues.numContainer}>
                                        <span >-</span>
                                    </div>
                                </div>);
                            })
                    }
                </div>
            </div>
        </Card>

    );
});

export default SummaryCard;
