/**
 * 标签选择器
 */
import React, { Component } from 'react';
import { message, Select, Tooltip } from 'antd';
import T from 'utils/T';
import PropTypes from 'prop-types';

import { getTagList } from '../../../system/webAPI/componentTag';

const noop = () => { };

class TagSelect extends Component {
    static propTypes = {
        // 自定义列表
        customTagList: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number, name: PropTypes.string, status: PropTypes.number })),
        // 当前选中标签id组(受控)
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
        // 选中事件(考虑配合form用)
        onChange: PropTypes.func,
        // select选择模式
        mode: PropTypes.oneOf(['multiple', 'tag']),
        // 是否展示默认标签
        needDefault: PropTypes.bool,
        status: PropTypes.number
    }

    static defaultProps = {
        onChange: noop,
        mode: 'multiple',
        needDefault: false,
        status: 1
    }

    state = {
        tagList: [], // 标签列表
        selectTagId: [], // 选中id组
        count: null, // 总数量
        page: {
            page: 0,
            pageSize: 1000
        },
        loading: false // 加载状态
    }

    componentDidMount() {
        this.fetchTagList();
    }

    /**
     * 获取标签列表
     */
    fetchTagList() {
        // 判断一下是不是受控
        const { isAdmin } = T.auth.getLoginInfo() || {}
        const controlled = this.checkType(this.props.customTagList, 'Array');
        const { page: { page, pageSize }, tagList, count, loading } = this.state;
        const { needDefault, status } = this.props;

        if (loading || controlled || count === 0 || tagList.length === count) {
            return;
        }

        this.toggleLoading();
        const payload = {
            page: page + 1, pageSize, status
        };
        if (!needDefault) {
            payload.not_default = 1;
        }
        getTagList(payload).then(({ code, data }) => { 
            if (code) return;
            const { count = 0, currentPage = 1, pageSize = 10, data: list = [] } = data;
            const _tagList= [...tagList, ...list]
            this.setState({
                tagList: isAdmin ? _tagList : _tagList.filter((item)=>{
                    return item.id !== 1
                }),
                page: {
                    page: currentPage,
                    pageSize
                },
                count
            });
        }).catch(() => {
            message.warn('获取标签列表失败');
        }).finally(() => {
            this.toggleLoading();
        });
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        });
    }

    checkType = (target, type) => {
        return Object.prototype.toString.call(target) === `[object ${type}]`;
    }

    /**
     * 下拉菜单变化事件
     * @param {number} value
     */
    handleSelectChange = (value) => {
        this.setState({
            selectTag: value
        });
        this.props.onChange(value);
    }

    handlePopupScroll = (event) => {
        const { clientHeight, scrollHeight, scrollTop } = event.target;
        if (clientHeight + scrollTop + 10 >= scrollHeight) {
            this.fetchTagList();
        }
    }

    render() { 
        const { customTagList, value, onChange, ...props } = this.props;
        const { isAdmin } = T.auth.getLoginInfo() || {}
        const { tagList, selectTagId, loading } = this.state;
        const list = this.checkType(customTagList, 'Array') ? (isAdmin ? customTagList : customTagList.filter((item)=>{
            return item.id !== 1
        })) : tagList;
        // 这里避免数据没回来直接展示id
        const chooseValue = list.length ? (value || selectTagId) : [];
        return (
            <Select
                placeholder="请选择标签"
                loading={loading}
                value={chooseValue}
                onChange={this.handleSelectChange}
                onPopupScroll={this.handlePopupScroll}
                {
                ...props
                }
            >
                {
                    list.map(({ name, id, status = 1 }) => {
                        const deleteChooseValue = !status && chooseValue.includes(id);
                        if (deleteChooseValue || status) {
                            return (
                                <Select.Option disabled={!status && !deleteChooseValue} key={id} value={id}>
                                    {
                                        deleteChooseValue
                                            ?
                                            <Tooltip defaultVisible={true} title="该标签已被删除, 若移除则无法重新选择该标签">
                                                {name}
                                            </Tooltip>
                                            :
                                            name
                                    }
                                </Select.Option>
                            );
                        }
                        return null;
                    })
                }
            </Select>
        );
    }
}

export default TagSelect;
