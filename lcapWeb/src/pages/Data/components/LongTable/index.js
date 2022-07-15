import React, { Component } from "react";
import { Table, Tooltip } from "@chaoswise/ui";

class TablePreview extends Component {
  state = {};
  render() {
    let { columns,data } = this.props;
    if (!data || data.length === 0) {
      return "";
    }
    const myData = data && data.map(item => {
      return {
        ...item
      };
    });
    let endColumns = columns && columns.map((item, index) => {
      return {
        title: (text) => {
          return (
            <Tooltip title={item.name}>
              <div >{item.name}</div>
            </Tooltip>
          );
        },
        ellipsis: true,
        dataIndex: item.name,
        key: item.name,
        render: (text) => {
          if (text) {
            return (
              <Tooltip title={JSON.stringify(text)} placement="topLeft">
                <span> {JSON.stringify(text)}</span>
              </Tooltip>
            );
          }
          return "";
        },

      };
    });
    return (
      <Table
        style={{ marginTop: '12px' }}
        columns={endColumns}
        dataSource={myData}
        scroll={{ x: endColumns.length * 200 }}
        pagination={false}
        rowKey={(record) => columns && columns.length > 0 ? record[columns[0]] : record}
      />
    );
  }
}

export default TablePreview;
