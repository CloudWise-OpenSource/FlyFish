import React, { Component } from 'react';
import { Tooltip } from '@chaoswise/ui';
import { toJS } from '@chaoswise/cw-mobx';
import { CWTable } from '@chaoswise/ui';
import { tileQueryDataColumns } from '@/pages/DataSearch/Group/Detail/utils';
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
    if (!data || data.length === 0) {
      return '';
    }
    let columns = tileQueryDataColumns(data).map((key) => {
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
      <div>
        <CWTable
          columns={columns}
          dataSource={data}
          scroll={{
            x: columns.length * 200,
            y: 50 * (data.length > 10 ? 10 : data.length),
          }}
        />
      </div>
    );
  }
}

export default TablePreview;
