/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import moment from 'moment';
import Table from 'templates/ToolComponents/Table';
import BoxContent from 'templates/ToolComponents/BoxContent';
import { PureComponent } from 'react';
import { Button, Input, Select, Row, Col, DatePicker } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';


import { getOperateLogPageListAction, doGetAllUser } from '../../action/operateLog';
import { EnumAllType } from 'constants/app/EnumCommon';
import { EnumOperateLogType } from 'constants/app/system/operateLog';

const EnumOperateLogTypeMap = (() => {
    let typeToLabelMap = {};
    Object.values(EnumOperateLogType).forEach(item => typeToLabelMap[item.value] = item.label);
    return typeToLabelMap;
})();

@T.decorator.contextTypes('store')
export default class OperateLogList extends PureComponent {
    state = {
        allUserLoading: false,
        allUser: {}
    }

    componentDidMount() {
        this.setState({ allUserLoading: true }, () => {
            doGetAllUser().then((resp) => {
                this.setState({
                    allUserLoading: false,
                    allUser: (() => {
                        let allUser = {};
                        resp.data.forEach(item => allUser[item.user_id] = item);
                        return allUser;
                    })()
                }, () => this.getOperateLogList());

            }, (resp) => T.prompt.error(resp.msg));
        });
    }

    // 获取操作日志列表
    getOperateLogList(page = 1, search = {}) {
        this.context.store.dispatch(getOperateLogPageListAction(page, search));
    }

    render() {
        const { loading, operateLogList } = this.props.operateLogListReducer;
        const { count, pageSize, currentPage, data } = operateLogList;

        const columns = [
            {
                title: '时间',
                dataIndex: 'created_at',
                render: (created_at) => T.helper.dateFormat(created_at)
            },
            {
                title: '操作内容',
                dataIndex: 'content',
            },
            {
                title: '日志类型',
                dataIndex: 'log_type',
                render: (log_type) => EnumOperateLogTypeMap[log_type]
            },
            {
                title: '操作用户',
                dataIndex: 'user_id',
                render: (user_id) => this.state.allUser[user_id].user_name || null
            },
        ];

        return (
            <div>
                <MainHeader title="日志审计" />

                <MainContent>
                    <BoxContent loading={this.state.allUserLoading}>
                        <Filter doSearch={(search) => this.getOperateLogList(1, search)} allUser={this.state.allUser} />

                        <Table
                            dataSource={data}
                            columns={columns}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: count,
                                onChange: (page) => this.getOperateLogList(page)
                            }}
                            loading={loading}
                            rowKey={(record) => record.operate_log_id}
                        />
                    </BoxContent>
                </MainContent>
            </div>
        );
    }
}

@T.decorator.propTypes({
    doSearch: PropTypes.func.isRequired
})
class Filter extends PureComponent {
    constructor() {
        super();
        this.state = {
            log_type: EnumAllType,
            user_id: EnumAllType,
            keyword: null,
            startTime: null,
            endTime: null,
        };
    }

    doSearch = () => {
        const { doSearch } = this.props;
        console.log(this.state);
        doSearch(this.state);
    }

    render() {
        let allUser = [{ label: '所有', value: EnumAllType }];
        Object.values(this.props.allUser).forEach(item => allUser.push({ label: item.user_name, value: item.user_id }));

        return (
            <Row gutter={16} type="flex" align="middle" style={{ marginBottom: 5 }}>
                <Col span={1}><span>类型：</span></Col>
                <Col span={2}>
                    <Select value={this.state.log_type} style={{ width: '100%' }} onChange={(log_type) => this.setState({ log_type })}>
                        {Object.values(EnumOperateLogType).map((item) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                    </Select>
                </Col>
                <Col span={1}><span>用户：</span></Col>
                <Col span={2}>
                    <Select value={this.state.user_id} style={{ width: '100%' }} onChange={(user_id) => this.setState({ user_id })}>
                        {allUser.map((item) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                    </Select>
                </Col>
                <Col span={1}><span>关键字：</span></Col>
                <Col span={4}>
                    <Input
                        value={this.state.keyword}
                        onChange={(e) => this.setState({ keyword: e.target.value.trim() })}
                        onBlur={() => this.doSearch()}
                        onKeyDown={(e) => e.keyCode === 13 && this.doSearch()}
                    />
                </Col>

                <Col span={1}><span>时间：</span></Col>
                <Col span={5}>
                    <DatePicker.RangePicker
                        style={{ width: '100%' }}
                        onChange={(e) => this.setState({ startTime: e[0].format('X') * 1000, endTime: e[1].format('X') * 1000 })}
                        disabledDate={(current) => current && current > moment().endOf('day')}
                        disabledTime={
                            (_, type) => {
                                function range(start, end) {
                                    const result = [];
                                    for (let i = start; i < end; i++) {
                                        result.push(i);
                                    }
                                    return result;
                                }
                                if (type === 'start') {
                                    return {
                                        disabledHours: () => range(0, 60).splice(4, 20),
                                        disabledMinutes: () => range(30, 60),
                                        disabledSeconds: () => [55, 56],
                                    };
                                }
                                    return {
                                    disabledHours: () => range(0, 60).splice(20, 4),
                                    disabledMinutes: () => range(0, 31),
                                    disabledSeconds: () => [55, 56],
                                };
                            }
                        }
                        showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                    >

                    </DatePicker.RangePicker>
                </Col>

                <Col span={2}><Button type="primary" onClick={() => this.doSearch()}>确定</Button></Col>
            </Row>
        );
    }
}
