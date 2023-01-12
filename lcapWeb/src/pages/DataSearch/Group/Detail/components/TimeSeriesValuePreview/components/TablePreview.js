import React, { Component } from 'react';
import { Tooltip } from '@chaoswise/ui';
import { CWTable } from '@chaoswise/ui';
import { formatDate } from '@/config/global';
import { tileQueryDataColumns } from '@/pages/DataSearch/Group/Detail/utils';

const COLUMN_KEY_NAME_MAPPING = {
  ts: '时间',
  type: '分类',
  value: '值',
};
class TablePreview extends Component {
  state = {};

  render() {
    let data = this.props.data;
    if (!data || data.length === 0) {
      return '';
    }
    let columns = tileQueryDataColumns(data).map((key) => {
      return {
        title: COLUMN_KEY_NAME_MAPPING[key] || key,
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
    let tsColumnIndex = columns.findIndex((col) => col.key === 'ts');
    if (tsColumnIndex != -1) {
      let targetColumn = columns[tsColumnIndex];
      targetColumn.render = (text) => {
        if (!text) {
          return '';
        }
        return formatDate(Number(text));
      };
      columns.splice(tsColumnIndex, 1);
      columns.unshift(targetColumn);
    }
    return (
      <CWTable
        columns={columns}
        dataSource={data}
        scroll={{
          x: columns.length * 200,
          y: 50 * (data.length > 10 ? 10 : data.length),
        }}
      />
    );
  }
}

export default TablePreview;
