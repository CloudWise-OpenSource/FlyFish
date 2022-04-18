/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import styles from './index.scss';
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';
import Input from 'templates/ToolComponents/TitleInput';
import ButtonSelf from 'templates/ToolComponents/Button';
import ComponentModalCreate from './ComponentModalCreate';
import UploadCoverModal from './UploadCoverModal';

import { Component } from 'react';
import { Row, Col, Button, Tooltip, message } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

import { getComponentCover } from 'constants/app/dataVisualComponents';
import { getComponentPageListAction, doDelComponent, delComponentAction, doChangeVisibleComponent } from '../../action/component';
import customComponentImg from './assets/custom_component.png';
import TagSelect from 'routes/common/components/TagSelect';

@T.decorator.contextTypes('store', 'router')
export default class ComponentList extends Component {
    constructor(props) {
        super(props);
        this.search = {};
        this.state = {
            changeComponentId: null,
            componentList: props.componentListReducer.componentList
        };
    }

    componentDidMount() {
        this.getComponentList();
    }

    // 获取组件列表
    getComponentList(page = 1, type = 0, search = {}) {
        this.search = Object.assign({}, this.search, search || {});
        this.context.store.dispatch(getComponentPageListAction(page, type, this.search));
    }

    /**
     * 删除数据存储
     * @param {Array | number}component_ids
     */
    delComponent(component_ids) {
        component_ids = !Array.isArray(component_ids) ? [component_ids] : component_ids;

        T.prompt.confirm(() => {

            return doDelComponent(component_ids).then(() => {
                this.context.store.dispatch(delComponentAction(component_ids));
                T.prompt.success('删除成功');
                this.handerRefresh();
            }, (resp) => {
                T.prompt.error(resp.msg);
            });
        }, { title: '确定删除？' });
    }

    handerRefresh() {
        const { componentList } = this.props.componentListReducer;
        const { currentPage, data } = componentList;
        const page = data.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        this.getComponentList(page, this.search.type, this.search);
    }

    // 更改组件可见状态
    changeVisible = (component_id, is_hide) => {
        this.setState({ changeComponentId: component_id });
        const { componentList } = this.state;
        doChangeVisibleComponent({ component_id, is_hide }).then((res) => {
            this.setState({ changeing: false });
            if (res.code === 0) {
                this.setState({
                    componentList: {
                        ...componentList,
                        data: componentList.data.map(v => ({
                            ...v,
                            is_hide: v.component_id === component_id ? is_hide : v.is_hide
                        }))
                    },
                    changeComponentId: null
                });
                // this.getComponentList();
            } else {
                message.error('更改组件可见状态失败, 请重试!');
            }
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            componentList: nextProps.componentListReducer.componentList
        });
    }


    render() {
        const { loading } = this.props.componentListReducer;
        const { changeComponentId, componentList = {} } = this.state;
        let { count = 0, currentPage = 1, pageSize, data = [] } = componentList;
        const { isAdmin } = T.auth.getLoginInfo() || {};
        data = data.map(item => {
            item.cover = getComponentCover(item.component_mark, item.account_id);
            return item;
        });

        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '组织名称',
                dataIndex: 'org_name',
            },
            {
                title: '组件标识',
                dataIndex: 'component_mark',
            },
            {
                title: '组件封面',
                dataIndex: 'cover',
                render: (cover) => {
                    return <img src={cover} style={{ width: 80, height: 50 }} onError={(e) => {
                        // 替换的图片
                        e.target.src = customComponentImg;
                        e.onError = null;
                    }}
                    />;
                }
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                render: (text) => T.helper.dateFormat(text)
            },
            {
                title: '操作',
                render: (text, record) => [
                    <ButtonSelf
                        key={1}
                        type="primary"
                        icon="edit"
                        disabled={!isAdmin && record.org_mark === 'comonComponent'}
                        onClick={() => T.helper.renderModal(<ComponentModalCreate component_id={record.component_id} getComponentListCb={this.getComponentList.bind(this)} />)}
                    >更新组件</ButtonSelf>,
                    <ButtonSelf
                        key={2}
                        type="primary"
                        icon="edit"
                        disabled={!isAdmin && record.org_mark === 'comonComponent'}
                        style={{ marginLeft: 5 }}
                        onClick={() => T.helper.renderModal(<UploadCoverModal component_id={record.component_id} getComponentListCb={this.getComponentList.bind(this)} />)}
                    >更新封面</ButtonSelf>,
                    <ButtonSelf key={3} type="danger"
                        icon="delete"
                        disabled={!isAdmin && record.org_mark === 'comonComponent'}
                        onClick={() => {
                            this.delComponent(record.component_id);
                        }} style={{ marginLeft: 5 }} >删除</ButtonSelf>,
                    isAdmin
                        ?
                        (
                            <Tooltip key={4} title="隐藏将在编辑大屏时不会出现在可选组件中, 并不影响在用大屏">
                                <ButtonSelf
                                    type="dashed"
                                    loading={changeComponentId === record.component_id}
                                    icon={record.is_hide === 0 ? 'stop' : 'check-circle'}
                                    onClick={() => this.changeVisible(record.component_id, record.is_hide === 0 ? 1 : 0)}
                                    style={{ marginLeft: 5 }}
                                >
                                    {record.is_hide === 0 ? '隐藏' : '显示'}
                                </ButtonSelf>
                            </Tooltip>
                        )
                        :
                        null
                ]
            }
        ];

        return (
            <div>
                <MainHeader title="组件列表" rightRender={
                    <Button
                        type="primary"
                        icon="plus"
                        onClick={() => T.helper.renderModal(<ComponentModalCreate component_id={false} getComponentListCb={this.getComponentList.bind(this)} />)}
                    >添加组件</Button>
                }
                />

                <MainContent>
                    <Filter doSearch={(search) => {
                        this.search = search;
                        this.getComponentList(1, search.type, search);
                    }
                    }
                    />

                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: count,
                            onChange: (page) => this.getComponentList(page)
                        }}
                        loading={loading}
                        rowKey={(record) => record.component_id}
                    />
                </MainContent>
            </div>
        );
    }
}

/**
 * 筛选组件
 */
@T.decorator.propTypes({
    doSearch: PropTypes.func.isRequired
})
class Filter extends Component {
    constructor() {
        super();
        this.state = {
            name: null,
            tagList: []
        };
    }

    doSearch = () => {
        const { doSearch } = this.props;
        const cloneState = T.lodash.clone(this.state);
        if (T.lodash.isEmpty(cloneState.name)) delete cloneState.name;
        if (T.lodash.isEmpty(cloneState.tagList)) { delete cloneState.tagList } else {
            cloneState.tagList = cloneState.tagList.join(',');
        }


        doSearch(cloneState);
    }

    render() {
        return (
            <Row gutter={0} type="flex" align="middle" className={styles['filter']}>
                <Col span={5}>
                    <Input
                        title={'名称'}
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value.trim() })}
                        onBlur={() => this.doSearch()}
                        onKeyDown={(e) => e.keyCode === 13 && this.doSearch()}
                    />
                </Col>
                <span style={{ marginLeft: '15px' }}>标签：</span>
                <Col span={5}>
                    <TagSelect
                        style={{ width: '100%' }}
                        value={this.state.tagList}
                        onChange={(val) => this.setState({ tagList: val }, () => this.doSearch())}
                        allowClear={true}
                        mode={'multiple'}
                    />
                </Col>
            </Row>
        );
    }
}

