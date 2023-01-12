import React, { Component } from 'react';
import { Tooltip } from '@chaoswise/ui';
import { toJS } from '@chaoswise/cw-mobx';
import { CWTable } from '@chaoswise/ui';
class TablePreview extends Component {
  state = {};

  shouldComponentUpdate(prevProps) {
    let { data } = this.props;
    if (prevProps.data === data) {
      return false;
    }
    return true;
  }

  render() {
    let data = toJS(this.props.data);
    let paging = toJS(this.props.paging);
    if (!data || data.length === 0) {
      return '';
    }
    let columns = Object.keys(data[0]).map((key) => {
      return {
        title: key,
        dataIndex: key,
        key: key,
        width: 200,
        render: (text) => {
          if (text == null || text === '') {
            return '';
          }
          let showText = '';
          if (text && typeof text !== 'string') {
            try {
              showText = JSON.stringify(text);
            } catch (error) {
              showText = '';
            }
          } else {
            showText = String(text);
          }

          if (showText.length > 15) {
            return (
              <Tooltip title={showText}>
                <span className='TableTopTitle'>{showText}</span>
              </Tooltip>
            );
          }
          return showText || '';
        },
      };
    });
    return (
      <CWTable
        columns={columns}
        dataSource={data}
        pagination={{
          showTotal: true,
          total: paging.total || 0,
          current: paging.pageNo || 1,
          pageSize: paging.pageSize || 10,
          onChange: (curPage, pageSize) => {
            this.props.onPageChanged &&
              this.props.onPageChanged(curPage, pageSize);
          },
          onShowSizeChange: (curPage, pageSize) => {
            this.props.onPageChanged &&
              this.props.onPageChanged(curPage, pageSize);
          },
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{
          x: columns.length * 200,
          y: 45 * (data.length > 10 ? 10 : data.length) + 15,
        }}
      />
    );
  }
}

export default TablePreview;
